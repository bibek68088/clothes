import { useParams } from 'react-router-dom';
import { Product } from '../types';

// This would typically come from an API or database
const product: Product = {
  id: '1',
  name: 'Crew Pique Polo',
  price: 29.99,
  image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80',
  category: 'shirt',
  description: 'Classic polo shirt with a modern fit',
  colors: ['White', 'Black', 'Navy'],
  sizes: ['S', 'M', 'L', 'XL']
};

export function ProductPage() {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div>
          <h1 className="text-3xl font-medium mb-2">{product.name}</h1>
          <p className="text-2xl mb-4">${product.price}</p>
          
          {product.description && (
            <p className="text-gray-600 mb-6">{product.description}</p>
          )}
          
          {product.colors && (
            <div className="mb-6">
              <h2 className="font-medium mb-2">Colors</h2>
              <div className="flex gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    className="px-4 py-2 border rounded hover:border-black"
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {product.sizes && (
            <div className="mb-6">
              <h2 className="font-medium mb-2">Size</h2>
              <div className="flex gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    className="px-4 py-2 border rounded hover:border-black"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <button className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}