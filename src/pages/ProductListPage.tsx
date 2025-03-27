import { Link } from 'react-router-dom';
import { PRODUCTS } from '../components/data/products';

export function ProductListPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PRODUCTS.map(product => (
          <Link 
            to={`/product/${product.id}`} 
            key={product.id} 
            className="block"
          >
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="aspect-square">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <p className="text-gray-600">${product.price.toFixed(2)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}