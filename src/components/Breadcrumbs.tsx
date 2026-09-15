import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs-nav">
      <div className="container">
        <ol className="breadcrumbs-list">
          <li className="breadcrumb-item">
            <Link to="/" className="breadcrumb-link home-icon-link">
              <Home size={14} />
              <span>Home</span>
            </Link>
          </li>

          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={index} className="breadcrumb-item">
                <ChevronRight size={13} className="breadcrumb-separator" />
                {isLast || !item.to ? (
                  <span className="breadcrumb-current" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link to={item.to} className="breadcrumb-link">
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};
