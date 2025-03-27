import { useState } from 'react';
import { Eye, ShoppingCart } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  discount?: number;
  colors?: string[];
}

const products: Product[] = [
  {
    id: '1',
    name: 'Crest Piqué Polo',
    brand: 'Wbpingo',
    price: 55.00,
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    name: 'Fleece Beret',
    brand: 'Slime',
    price: 40.00,
    originalPrice: 50.00,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3',
    name: 'Double Snap Unisphere Hoodie',
    brand: 'Unknown',
    price: 65.00,
    originalPrice: 90.00,
    discount: 27,
    colors: ['red', 'gray'],
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80'
  }
];

export function NewArrivals() {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  return (
    <div className="py-16">
      <div className="container flex gap-24 justify-center items-center mx-auto px-4">
        <div className="mb-8">
          <span className="text-sm text-gray-600 mb-2 block">788 NEW ITEMS</span>
          <h2 className="text-3xl font-light mb-2">New arrivals</h2>
          <p className="text-gray-600 mb-4">Get ahead of the style curve with our latest arrivals</p>
          <button className="inline-block bg-black text-white px-8 py-3 text-sm hover:bg-gray-800 transition">
            Shop New In
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="group relative"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div className="relative aspect-[3/4] bg-gray-50 mb-4 overflow-hidden">
                {product.discount && (
                  <span className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1">
                    -{product.discount}%
                  </span>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-60 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {hoveredProduct === product.id && (
                  <div 
                    className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={() => setQuickViewProduct(product)}
                  >
                    <Eye className="text-white w-10 h-10 cursor-pointer" />
                  </div>
                )}
              </div>
              <h3 className="font-medium mb-1">{product.name}</h3>
              <div className="flex items-center gap-2">
                {product.originalPrice ? (
                  <>
                    <span className="text-gray-600 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <span className="text-black">
                      ${product.price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-600">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
              {product.colors && (
                <div className="flex gap-1 mt-2">
                  {product.colors.map((color) => (
                    <div
                      key={color}
                      className={`w-4 h-4 rounded-full bg-${color}-500 border border-gray-200`}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick View Modal */}
        {quickViewProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white w-11/12 max-w-4xl max-h-[90vh] flex overflow-hidden">
              {/* Left Side - Image */}
              <div className="w-1/2 p-8">
                <img 
                  src={quickViewProduct.image} 
                  alt={quickViewProduct.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Right Side - Product Details */}
              <div className="w-1/2 p-8 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-medium mb-2">{quickViewProduct.name}</h2>
                  <p className="text-gray-600 mb-4">By {quickViewProduct.brand}</p>
                  
                  <div className="flex items-center gap-4 mb-6">
                    {quickViewProduct.originalPrice ? (
                      <>
                        <span className="text-gray-600 line-through text-lg">
                          ${quickViewProduct.originalPrice.toFixed(2)}
                        </span>
                        <span className="text-black text-2xl font-semibold">
                          ${quickViewProduct.price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-black text-2xl font-semibold">
                        ${quickViewProduct.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  {quickViewProduct.colors && (
                    <div className="mb-6">
                      <p className="text-gray-600 mb-2">Color</p>
                      <div className="flex gap-2">
                        {quickViewProduct.colors.map((color) => (
                          <div
                            key={color}
                            className={`w-6 h-6 rounded-full bg-${color}-500 border-2 border-gray-200 cursor-pointer`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-4">
                  <button 
                    className="flex-1 bg-black text-white py-3 flex items-center justify-center gap-2 hover:bg-gray-800 transition"
                    onClick={() => {/* Add to cart logic */}}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                  <button 
                    className="flex-1 border border-gray-300 py-3 hover:bg-gray-100 transition"
                    onClick={() => setQuickViewProduct(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NewArrivals;