import { useState, useCallback, memo } from "react";
import { Eye, ShoppingCart, Minus, Plus, ChevronRight } from "lucide-react";
import { Modal } from "antd";
import { useNavigate } from "react-router-dom";

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  discount?: number;
  colors?: string[];
  description?: string;
  inStock?: boolean;
  category?: string;
  sizes?: string[];
}

interface NewArrivalsProps {
  onProductClick?: (product: Product) => void;
}

// Mock data - ideally this would be moved to a separate file or fetched from an API
const products: Product[] = [
  {
    id: "1",
    name: "Crest Piqué Polo",
    brand: "Wbpingo",
    price: 55.0,
    description:
      "Curabitur egestas malesuada volutpat. Nunc vel vestibulum odio, ac pellentesque lacus. Pellentesque dapibus nunc nec est imperdiet, a malesuada sem rutrum.",
    inStock: true,
    colors: ["black", "white", "blue"],
    category: "shirt",
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2",
    name: "Fleece Beret",
    brand: "Slime",
    price: 40.0,
    originalPrice: 50.0,
    inStock: true,
    colors: ["black", "white"],
    category: "accessories",
    sizes: ["One Size"],
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "3",
    name: "Classic Leather Sneakers",
    brand: "Nike",
    price: 79.99,
    originalPrice: 90.0,
    discount: 27,
    colors: ["white", "black", "brown"],
    category: "shoes",
    sizes: ["7", "8", "9", "10", "11"],
    image:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c25lYWtlcnN8ZW58MHx8MHx8fDA%3D",
  },
];

// Memoized product card component to prevent unnecessary re-renders
const ProductCard = memo(({ 
  product, 
  isHovered, 
  onMouseEnter, 
  onMouseLeave, 
  onProductClick, 
  onQuickViewClick 
}: { 
  product: Product, 
  isHovered: boolean, 
  onMouseEnter: () => void, 
  onMouseLeave: () => void, 
  onProductClick: () => void, 
  onQuickViewClick: (e: React.MouseEvent) => void 
}) => {
  return (
    <div
      className="group relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className="relative aspect-[3/4] bg-gray-50 mb-4 overflow-hidden cursor-pointer"
        onClick={onProductClick}
      >
        {product.discount && (
          <span className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1">
            -{product.discount}%
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {isHovered && (
          <div
            className="absolute h-14 bottom-0 left-0 right-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={onQuickViewClick}
          >
            <Eye className="text-white w-6 h-6 cursor-pointer" />
          </div>
        )}
      </div>
      <h3 className="font-medium mb-1">{product.name}</h3>
      <div className="flex items-center gap-2">
        {product.originalPrice ? (
          <>
            <span className="text-gray-600 line-through text-sm">
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
              className="w-4 h-4 rounded-full border border-gray-200"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      )}
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export function NewArrivals({ onProductClick }: NewArrivalsProps) {
  const navigate = useNavigate();
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = useCallback(() => {
    // Placeholder for add to cart logic
    console.log(
      "Added to cart:",
      quickViewProduct?.name,
      "Quantity:",
      quantity
    );
    // Close modal after adding to cart
    setQuickViewProduct(null);
  }, [quickViewProduct, quantity]);

  const handleProductPageNavigation = useCallback((product: Product) => {
    // First, check if a custom onProductClick handler is provided
    if (onProductClick) {
      onProductClick(product);
    } else {
      // Default navigation or logging
      navigate(`/product/${product.id}`);
    }
  }, [onProductClick, navigate]);

  const handleDecreaseQuantity = useCallback(() => {
    setQuantity(prev => Math.max(1, prev - 1));
  }, []);

  const handleIncreaseQuantity = useCallback(() => {
    setQuantity(prev => prev + 1);
  }, []);

  const handleCloseModal = useCallback(() => {
    setQuickViewProduct(null);
    setQuantity(1);
  }, []);

  return (
    <div className="py-8 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 md:gap-24 justify-center items-center mb-8">
          <div className="text-center md:text-left w-full md:w-auto">
            <span className="text-sm text-gray-600 mb-2 block">
              788 NEW ITEMS
            </span>
            <h2 className="text-2xl md:text-3xl font-light mb-2">
              New arrivals
            </h2>
            <p className="text-gray-600 mb-4">
              Get ahead of the style curve with our latest arrivals
            </p>
            <button className="inline-block bg-black text-white px-6 md:px-8 py-2 md:py-3 text-sm hover:bg-gray-800 transition">
              Shop New In
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 w-full">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isHovered={hoveredProduct === product.id}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                onProductClick={() => handleProductPageNavigation(product)}
                onQuickViewClick={(e) => {
                  e.stopPropagation(); // Prevent product page navigation
                  setQuickViewProduct(product);
                  setQuantity(1);
                }}
              />
            ))}
          </div>
        </div>

        {/* Quick View Modal using Ant Design */}
        <Modal
          open={!!quickViewProduct}
          onCancel={handleCloseModal}
          footer={null}
          width={1000}
          closeIcon={
            <div className="text-2xl font-light cursor-pointer">&times;</div>
          }
          style={{ top: 20 }}
          styles={{ body: { padding: 0 } }}
        >
          {quickViewProduct && (
            <div className="flex flex-col md:flex-row">
              {/* Left Side - Image */}
              <div className="w-full md:w-1/2 relative">
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  className="w-full h-auto object-cover"
                />
                <button className="absolute top-4 right-4 text-gray-600 hover:text-black transition flex items-center">
                  <span className="text-sm mr-1">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Right Side - Product Details */}
              <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl md:text-2xl font-medium mb-2">
                    {quickViewProduct.name}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    By {quickViewProduct.brand}
                  </p>

                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-black text-xl md:text-2xl font-semibold">
                      ${quickViewProduct.price.toFixed(2)}
                    </span>
                    {quickViewProduct.inStock && (
                      <span className="text-green-600 text-sm">In stock</span>
                    )}
                  </div>

                  {quickViewProduct.description && (
                    <p className="text-gray-600 mb-6 text-sm md:text-base">
                      {quickViewProduct.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center border border-gray-300">
                      <button
                        className="p-2 hover:bg-gray-100"
                        onClick={handleDecreaseQuantity}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4">{quantity}</span>
                      <button
                        className="p-2 hover:bg-gray-100"
                        onClick={handleIncreaseQuantity}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    className="w-full bg-black text-white py-3 flex items-center justify-center gap-2 hover:bg-gray-800 transition"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default memo(NewArrivals);