import { Router } from 'express';
import { getDb } from './db.js';
import { ObjectId } from 'mongodb';

export const apiRouter = Router();

// -------------------------------------------------------------
// PRODUCTS
// -------------------------------------------------------------
apiRouter.get('/products', async (req, res) => {
  try {
    const db = await getDb();
    const products = await db.collection('products')
      .find({}, { projection: { _id: 0 } })
      .sort({ created_at: -1 })
      .toArray();
    res.json(products);
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
      { $or: [{ slug: slugOrId }, { id: slugOrId }] },
      { projection: { _id: 0 } }
    );
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

apiRouter.post('/products', async (req, res) => {
  try {
    const db = await getDb();
    const product = req.body;
    if (!product.name || !product.slug) {
      return res.status(400).json({ error: 'Name and slug are required' });
    }
    const newDoc = {
      ...product,
      id: product.id || `prod-${Date.now()}`,
      created_at: product.created_at || new Date().toISOString()
    };
    delete newDoc._id;

    await db.collection('products').insertOne(newDoc);
    const { _id, ...saved } = newDoc;
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Failed to create product in MongoDB' });
  }
});

apiRouter.put('/products/:id', async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const updates = { ...req.body };
    delete updates._id;
    delete updates.id;

    const result = await db.collection('products').findOneAndUpdate(
      { $or: [{ id: id }, { slug: id }] },
      { $set: updates },
      { returnDocument: 'after', projection: { _id: 0 } }
    );

    if (!result) {
      return res.status(404).json({ error: 'Product not found to update' });
    }
    res.json(result);
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
      .find({}, { projection: { _id: 0 } })
      .sort({ category_number: 1 })
      .toArray();
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

apiRouter.get('/categories/:slug', async (req, res) => {
  try {
    const db = await getDb();
    const { slug } = req.params;
    const category = await db.collection('categories').findOne(
      { slug: slug },
      { projection: { _id: 0 } }
    );
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
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

    const result = await db.collection('categories').findOneAndUpdate(
      { $or: [{ id: id }, { slug: id }] },
      { $set: updates },
      { returnDocument: 'after', projection: { _id: 0 } }
    );
    res.json(result || updates);
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
      .find({}, { projection: { _id: 0 } })
      .sort({ created_at: -1 })
      .toArray();
    res.json(resources);
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
      { slug: slug },
      { projection: { _id: 0 } }
    );
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    res.json(resource);
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

    const result = await db.collection('resources').findOneAndUpdate(
      { $or: [{ id: id }, { slug: id }] },
      { $set: updates },
      { returnDocument: 'after', projection: { _id: 0 } }
    );
    res.json(result || updates);
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
      .find({}, { projection: { _id: 0 } })
      .sort({ sort_order: 1 })
      .toArray();
    res.json(gallery);
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
          { id: item.id },
          { $set: { sort_order: item.sort_order } }
        );
      }
      return res.json({ success: true });
    }

    if (id) {
      delete updates._id;
      const result = await db.collection('gallery_images').findOneAndUpdate(
        { id: id },
        { $set: updates },
        { returnDocument: 'after', projection: { _id: 0 } }
      );
      return res.json(result || { id, ...updates });
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
    await db.collection('gallery_images').deleteOne({ id: id });
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
    let contact = await db.collection('contact_info').findOne(
      { id: 'default' },
      { projection: { _id: 0 } }
    );
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
    res.json(contact);
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
    res.json(updates);
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
    const db = await getDb();
    const user = await db.collection('admin_users').findOne({
      email: { $regex: new RegExp(`^${cleanEmail}$`, 'i') }
    });

    // Check matching password or standard demo/admin credentials
    const isDefaultAdmin = (
      cleanEmail === 'business.chemtech@gmail.com' ||
      cleanEmail === 'admin@chemtechpolymers.com' ||
      cleanEmail.includes('chemtech')
    ) && (password === 'DemoPass123!' || password === 'Admin@123' || (user && user.password === password));

    if (user && user.password === password) {
      return res.json({
        success: true,
        user: { id: user.id || user._id, email: user.email, role: user.role || 'Administrator' },
        token: `chemtech-session-${Date.now()}`
      });
    }

    if (isDefaultAdmin) {
      return res.json({
        success: true,
        user: { id: 'admin-01', email: cleanEmail, role: 'Administrator' },
        token: `chemtech-session-${Date.now()}`
      });
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

    const db = await getDb();
    const buffer = Buffer.from(base64Data, 'base64');
    const cleanId = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    const doc = {
      id: cleanId,
      filename: filename,
      contentType: contentType || (filename.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream'),
      data: buffer,
      size: buffer.length,
      created_at: new Date().toISOString()
    };

    await db.collection('files').insertOne(doc);

    const publicUrl = `/api/files/${cleanId}`;
    res.json({
      success: true,
      url: publicUrl,
      id: cleanId,
      filename: filename,
      size: buffer.length
    });
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ error: 'Failed to upload file to MongoDB' });
  }
});

apiRouter.get('/files/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    const file = await db.collection('files').findOne({
      $or: [{ id: id }, { filename: id }]
    });

    if (!file) {
      return res.status(404).send('File not found in MongoDB');
    }

    res.setHeader('Content-Type', file.contentType || 'application/octet-stream');
    res.setHeader('Content-Length', file.size || file.data.length);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(Buffer.from(file.data.buffer || file.data));
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
