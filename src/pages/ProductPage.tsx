import { useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../components/data/products";
import { useCart } from "../store/useCart";

export function ProductPage() {
  const { id } = useParams();
  const product = getProductById(id || "");
  const { addItem } = useCart();

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleAddToCart = () => {
    if (!selectedColor) {
      alert("Please select a color");
      return;
    }
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    // Add the item to cart with selected color and size
    addItem({
      ...product,
      id: `${product.id}-${selectedColor}-${selectedSize}`, // Create a unique ID
      // selectedColor,
      // selectedSize,
    });
  };

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
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded hover:border-black 
                      ${selectedColor === color ? "border-black" : ""}`}
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
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded hover:border-black 
                      ${selectedSize === size ? "border-black" : ""}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition"
            disabled={!selectedColor || !selectedSize}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
