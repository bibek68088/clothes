import { Product } from '../../types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Crew Pique Polo',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80',
    category: 'shirt',
    description: 'Classic polo shirt with a modern fit',
    colors: ['White', 'Black', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: '2',
    name: 'Slim Fit Chinos',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1607345366928-199ea26bfd4f?auto=format&fit=crop&w=800&q=80',
    category: 'pants',
    description: 'Comfortable slim-fit chinos for everyday wear',
    colors: ['Khaki', 'Navy', 'Olive'],
    sizes: ['30', '32', '34', '36']
  },
  {
    id: '3',
    name: 'Classic Leather Sneakers',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1535043431092-4a14cd800910?auto=format&fit=crop&w=800&q=80',
    category: 'shoes',
    description: 'Timeless leather sneakers with cushioned insole',
    colors: ['White', 'Black', 'Brown'],
    sizes: ['7', '8', '9', '10', '11']
  }
];

// Helper function to find a product by ID
export const getProductById = (id: string): Product | undefined => {
  return PRODUCTS.find(product => product.id === id);
};