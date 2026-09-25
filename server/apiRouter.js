import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { Binary, ObjectId } from 'mongodb';
import { getDb } from './db.js';

export const apiRouter = Router();

const CATEGORY_SLUG_ALIASES = {
  'non-pvc-inks': ['non-pvc-inks', 'non-pvc-acrysol'],
  'non-pvc-acrysol': ['non-pvc-inks', 'non-pvc-acrysol'],
  'speciality-inks': ['speciality-inks', 'specialty-inks', 'specialty'],
  'specialty-inks': ['speciality-inks', 'specialty-inks', 'specialty'],
  'heat-transfer-solutions': ['heat-transfer-solutions', 'heat-transfer'],
  'heat-transfer': ['heat-transfer-solutions', 'heat-transfer'],
  'craft-inks': ['craft-inks', 'craft-ink'],
  'craft-ink': ['craft-inks', 'craft-ink'],
};

function serializeDoc(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return {
    ...rest,
    id: rest.id || rest.slug || (_id ? String(_id) : undefined),
  };
}

function unwrapWriteResult(result) {
  if (!result) return null;
  if (Object.prototype.hasOwnProperty.call(result, 'value')) {
    return result.value;
  }
  return result;
}

function idOrSlugFilter(id) {
  const or = [{ id }, { slug: id }];
  if (typeof id === 'string' && ObjectId.isValid(id)) {
    try {
      const objectId = new ObjectId(id);
      if (String(objectId) === id) or.push({ _id: objectId });
    } catch {
      // ignore invalid ObjectId values
    }
  }
  return { $or: or };
}

function toNodeBuffer(data) {
  if (!data) return Buffer.alloc(0);
  if (Buffer.isBuffer(data)) return Buffer.from(data);
  if (typeof data === 'string') return Buffer.from(data, 'base64');
  const inner = data.buffer;
  if (Buffer.isBuffer(inner)) return Buffer.from(inner);
  if (inner instanceof Uint8Array) return Buffer.from(inner);
  if (Array.isArray(data)) return Buffer.from(data);
  return Buffer.from(data);
}

const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');

async function saveUploadToDisk(cleanId, buffer) {
  await fs.promises.mkdir(uploadsDir, { recursive: true });
  await fs.promises.writeFile(path.join(uploadsDir, cleanId), buffer);
  return `/uploads/${encodeURIComponent(cleanId)}`;
}

// -------------------------------------------------------------
// PRODUCTS
// -------------------------------------------------------------
apiRouter.get('/products', async (req, res) => {
  try {
    const db = await getDb();
    const products = await db.collection('products')
      .find({})
      .sort({ created_at: 1 })
      .toArray();
    res.json(products.map(serializeDoc));
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products from MongoDB' });
  }
});

apiRouter.get('/products/:slugOrId', async (req, res) => {
  try {
    const db = await getDb();
    const { slugOrId } = req.params;
    const product = await db.collection('products').findOne(
      { $or: [{ slug: slugOrId }, { id: slugOrId }] }
    );
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(serializeDoc(product));
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

apiRouter.post('/products', async (req, res) => {
  try {
    const db = await getDb();
    const product = req.body;
    if (!product.name) {
      return res.status(400).json({ error: 'Product name is required' });
    }
    const cleanSlug = product.slug || product.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newDoc = {
      ...product,
      slug: cleanSlug,
      id: product.id || `prod-${Date.now()}`,
      created_at: product.created_at || new Date().toISOString()
    };
    delete newDoc._id;

    // If product with that id or slug already exists, update it
    const existing = await db.collection('products').findOne({
      $or: [{ id: newDoc.id }, { slug: newDoc.slug }]
    });

    if (existing) {
      await db.collection('products').updateOne(
        { _id: existing._id },
        { $set: newDoc }
      );
      return res.json(newDoc);
    }

    await db.collection('products').insertOne(newDoc);
    const { _id, ...saved } = newDoc;
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: `Failed to create product in MongoDB: ${err?.message || err}` });
  }
});

apiRouter.put('/products/:id', async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const updates = { ...req.body };
    delete updates._id;

    if (updates.pdfUrl && !updates.pdf_url) {
      updates.pdf_url = updates.pdfUrl;
    }
    delete updates.pdfUrl;

    const unset = {};
    if (updates.pdf_url === null || updates.pdf_url === '') {
      unset.pdf_url = '';
      unset.pdfUrl = '';
      delete updates.pdf_url;
    }

    updates.updated_at = new Date().toISOString();
    const updateDoc = { $set: updates };
    if (Object.keys(unset).length) updateDoc.$unset = unset;

    const write = await db.collection('products').updateOne(idOrSlugFilter(id), updateDoc);
    const product = await db.collection('products').findOne(idOrSlugFilter(id));

    if (!product || (write.matchedCount === 0 && !product)) {
      return res.status(404).json({ error: 'Product not found to update' });
    }
    res.json(serializeDoc(product));
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Failed to update product in MongoDB' });
  }
});

apiRouter.delete('/products/:id', async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    await db.collection('products').deleteOne({
      $or: [{ id: id }, { slug: id }]
    });
    res.json({ success: true, message: `Product ${id} deleted` });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// -------------------------------------------------------------
// CATEGORIES
// -------------------------------------------------------------
apiRouter.get('/categories', async (req, res) => {
  try {
    const db = await getDb();
    const categories = await db.collection('categories')
      .find({})
      .sort({ category_number: 1 })
      .toArray();
    res.json(categories.map(serializeDoc));
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

apiRouter.get('/categories/:slug', async (req, res) => {
  try {
    const db = await getDb();
    const { slug } = req.params;
    const slugs = CATEGORY_SLUG_ALIASES[slug] || [slug];
    const category = await db.collection('categories').findOne({
      $or: slugs.flatMap((s) => [{ slug: s }, { id: s }]),
    });
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(serializeDoc(category));
  } catch (err) {
    console.error('Error fetching category:', err);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

apiRouter.put('/categories/:id', async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const updates = { ...req.body };
    delete updates._id;
    updates.updated_at = new Date().toISOString();

    const slugs = CATEGORY_SLUG_ALIASES[id] || [id];
    const result = unwrapWriteResult(await db.collection('categories').findOneAndUpdate(
      { $or: slugs.flatMap((s) => [{ slug: s }, { id: s }]) },
      { $set: updates },
      { returnDocument: 'after' }
    ));
    if (!result) {
      return res.status(404).json({ error: 'Category not found to update' });
    }
    res.json(serializeDoc(result));
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// -------------------------------------------------------------
// RESOURCES / GUIDES
// -------------------------------------------------------------
apiRouter.get('/resources', async (req, res) => {
  try {
    const db = await getDb();
    const resources = await db.collection('resources')
      .find({})
      .sort({ created_at: -1 })
      .toArray();
    res.json(resources.map(serializeDoc));
  } catch (err) {
    console.error('Error fetching resources:', err);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

apiRouter.get('/resources/:slug', async (req, res) => {
  try {
    const db = await getDb();
    const { slug } = req.params;
    const resource = await db.collection('resources').findOne(
      { $or: [{ slug: slug }, { id: slug }] }
    );
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    res.json(serializeDoc(resource));
  } catch (err) {
    console.error('Error fetching resource:', err);
    res.status(500).json({ error: 'Failed to fetch resource' });
  }
});

apiRouter.post('/resources', async (req, res) => {
  try {
    const db = await getDb();
    const doc = {
      ...req.body,
      id: req.body.id || `res-${Date.now()}`,
      created_at: req.body.created_at || new Date().toISOString()
    };
    delete doc._id;
    await db.collection('resources').insertOne(doc);
    const { _id, ...saved } = doc;
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error creating resource:', err);
    res.status(500).json({ error: 'Failed to create resource' });
  }
});

apiRouter.put('/resources/:id', async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const updates = { ...req.body };
    delete updates._id;
    updates.updated_at = new Date().toISOString();

    const result = unwrapWriteResult(await db.collection('resources').findOneAndUpdate(
      idOrSlugFilter(id),
      { $set: updates },
      { returnDocument: 'after' }
    ));
    if (!result) {
      return res.status(404).json({ error: 'Resource not found to update' });
    }
    res.json(serializeDoc(result));
  } catch (err) {
    console.error('Error updating resource:', err);
    res.status(500).json({ error: 'Failed to update resource' });
  }
});

apiRouter.delete('/resources/:id', async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    await db.collection('resources').deleteOne({
      $or: [{ id: id }, { slug: id }]
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting resource:', err);
    res.status(500).json({ error: 'Failed to delete resource' });
  }
});

// -------------------------------------------------------------
// GALLERY
// -------------------------------------------------------------
apiRouter.get('/gallery', async (req, res) => {
  try {
    const db = await getDb();
    const gallery = await db.collection('gallery_images')
      .find({})
      .sort({ sort_order: 1 })
      .toArray();
    res.json(gallery.map(serializeDoc));
  } catch (err) {
    console.error('Error fetching gallery:', err);
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

apiRouter.post('/gallery', async (req, res) => {
  try {
    const db = await getDb();
    const doc = {
      ...req.body,
      id: req.body.id || `gal-${Date.now()}`,
      created_at: req.body.created_at || new Date().toISOString()
    };
    delete doc._id;
    await db.collection('gallery_images').insertOne(doc);
    const { _id, ...saved } = doc;
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error creating gallery item:', err);
    res.status(500).json({ error: 'Failed to create gallery item' });
  }
});

apiRouter.put('/gallery', async (req, res) => {
  try {
    const db = await getDb();
    const { items, id, ...updates } = req.body;

    if (Array.isArray(items)) {
      for (const item of items) {
        await db.collection('gallery_images').updateOne(
          { $or: [{ id: item.id }, { slug: item.id }] },
          { $set: { sort_order: item.sort_order } }
        );
      }
      return res.json({ success: true });
    }

    if (id) {
      delete updates._id;
      const result = unwrapWriteResult(await db.collection('gallery_images').findOneAndUpdate(
        { $or: [{ id: id }, { slug: id }] },
        { $set: updates },
        { returnDocument: 'after' }
      ));
      if (!result) {
        return res.status(404).json({ error: 'Gallery item not found to update' });
      }
      return res.json(serializeDoc(result));
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Error updating gallery:', err);
    res.status(500).json({ error: 'Failed to update gallery' });
  }
});

apiRouter.delete('/gallery/:id', async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    await db.collection('gallery_images').deleteOne({ $or: [{ id: id }, { slug: id }] });
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting gallery item:', err);
    res.status(500).json({ error: 'Failed to delete gallery item' });
  }
});

// -------------------------------------------------------------
// CONTACT INFO
// -------------------------------------------------------------
apiRouter.get('/contact', async (req, res) => {
  try {
    const db = await getDb();
    let contact = await db.collection('contact_info').findOne({ id: 'default' });
    if (!contact) {
      contact = {
        id: 'default',
        phone: "+91 93635 19955 / +91 82208 04830",
        phone_support: "+91 93635 19955",
        phone_sales: "+91 82208 04830",
        email: "business.chemtech@gmail.com",
        email_sales: "business.chemtech@gmail.com",
        address: "",
        whatsapp_number: "918248212154",
        map_embed_url: "",
        hours: "Monday – Saturday: 9:00 AM – 6:30 PM IST",
        formspree_endpoint: "https://formspree.io/f/mvkojeyd",
      };
      await db.collection('contact_info').insertOne(contact);
    }
    res.json(serializeDoc(contact));
  } catch (err) {
    console.error('Error fetching contact info:', err);
    res.status(500).json({ error: 'Failed to fetch contact information' });
  }
});

apiRouter.put('/contact', async (req, res) => {
  try {
    const db = await getDb();
    const updates = { ...req.body, id: 'default', updated_at: new Date().toISOString() };
    delete updates._id;

    await db.collection('contact_info').updateOne(
      { id: 'default' },
      { $set: updates },
      { upsert: true }
    );
    const saved = await db.collection('contact_info').findOne({ id: 'default' });
    res.json(serializeDoc(saved) || updates);
  } catch (err) {
    console.error('Error updating contact info:', err);
    res.status(500).json({ error: 'Failed to update contact information' });
  }
});

// -------------------------------------------------------------
// AUTH
// -------------------------------------------------------------
apiRouter.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check default admin credentials first (works offline)
    const isDefaultAdmin = (
      cleanEmail === 'business.chemtech@gmail.com' ||
      cleanEmail === 'admin@chemtechpolymers.com' ||
      cleanEmail.includes('chemtech')
    ) && (password === 'DemoPass123!' || password === 'Admin@123');

    if (isDefaultAdmin) {
      return res.json({
        success: true,
        user: { id: 'admin-01', email: cleanEmail, role: 'Administrator' },
        token: `chemtech-session-${Date.now()}`
      });
    }

    // Try database for custom admin users (optional)
    try {
      const db = await getDb();
      const user = await db.collection('admin_users').findOne({
        email: { $regex: new RegExp(`^${cleanEmail}$`, 'i') }
      });

      if (user && user.password === password) {
        return res.json({
          success: true,
          user: { id: user.id || user._id, email: user.email, role: user.role || 'Administrator' },
          token: `chemtech-session-${Date.now()}`
        });
      }
    } catch (dbErr) {
      // Database not available, continue to check default credentials only
      console.warn('Database unavailable for admin user lookup, using default credentials only:', dbErr?.message || dbErr);
    }

    return res.status(401).json({ error: 'Invalid admin credentials' });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Internal login error' });
  }
});

// -------------------------------------------------------------
// FILE STORAGE (PDFs and Images directly in MongoDB)
// -------------------------------------------------------------
apiRouter.post('/upload', async (req, res) => {
  try {
    const { filename, contentType, base64Data } = req.body;
    if (!filename || !base64Data) {
      return res.status(400).json({ error: 'filename and base64Data are required' });
    }

    const rawBase64 = String(base64Data).includes(',')
      ? String(base64Data).split(',').pop()
      : String(base64Data);
    const buffer = Buffer.from(rawBase64, 'base64');
    if (!buffer.length) {
      return res.status(400).json({ error: 'Uploaded file was empty or invalid.' });
    }
    // MongoDB documents cannot exceed 16MB
    if (buffer.length > 14 * 1024 * 1024) {
      return res.status(400).json({ error: 'File must be 14MB or smaller.' });
    }

    const safeName = String(filename).replace(/[^a-zA-Z0-9._-]/g, '_');
    const cleanId = `${Date.now()}-${safeName}`;
    const isPdf = (contentType || '').includes('pdf') || safeName.toLowerCase().endsWith('.pdf');
    const type = contentType || (isPdf ? 'application/pdf' : 'application/octet-stream');

    try {
      const db = await getDb();
      await db.collection('files').insertOne({
        id: cleanId,
        filename: safeName,
        contentType: type,
        data: new Binary(buffer),
        size: buffer.length,
        created_at: new Date().toISOString()
      });
      return res.json({
        success: true,
        url: `/api/files/${encodeURIComponent(cleanId)}`,
        id: cleanId,
        filename: safeName,
        size: buffer.length
      });
    } catch (mongoErr) {
      console.warn('MongoDB file upload failed, saving to disk instead:', mongoErr?.message || mongoErr);
      const url = await saveUploadToDisk(cleanId, buffer);
      return res.json({
        success: true,
        url,
        id: cleanId,
        filename: safeName,
        size: buffer.length
      });
    }
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ error: err?.message || 'Failed to upload file to MongoDB' });
  }
});

apiRouter.get('/files/:id', async (req, res) => {
  try {
    const id = decodeURIComponent(req.params.id || '');
    try {
      const db = await getDb();
      const file = await db.collection('files').findOne({
        $or: [{ id }, { filename: id }]
      });

      if (file) {
        const body = toNodeBuffer(file.data);
        const isPdf = (file.contentType || '').includes('pdf') || (file.filename || '').toLowerCase().endsWith('.pdf');
        const type = file.contentType || (isPdf ? 'application/pdf' : 'application/octet-stream');
        const downloadName = file.filename || (isPdf ? 'document.pdf' : 'file');
        res.setHeader('Content-Type', type);
        res.setHeader('Content-Length', String(body.length));
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.setHeader('Content-Disposition', `${isPdf ? 'inline' : 'attachment'}; filename="${downloadName}"`);
        return res.end(body);
      }
    } catch (mongoErr) {
      console.warn('MongoDB file read failed, trying disk:', mongoErr?.message || mongoErr);
    }

    const diskPath = path.join(uploadsDir, id);
    if (fs.existsSync(diskPath)) {
      const isPdf = id.toLowerCase().endsWith('.pdf');
      res.setHeader('Content-Type', isPdf ? 'application/pdf' : 'application/octet-stream');
      res.setHeader('Content-Disposition', `${isPdf ? 'inline' : 'attachment'}; filename="${id}"`);
      return res.sendFile(diskPath);
    }

    return res.status(404).send('File not found');
  } catch (err) {
    console.error('Error retrieving file:', err);
    res.status(500).send('Error retrieving file');
  }
});

apiRouter.delete('/files/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    await db.collection('files').deleteOne({
      $or: [{ id: id }, { filename: id }]
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting file:', err);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});
