import React, { useState } from "react";
import { Modal } from "antd";

interface Product {
  name: string;
  price: number;
  colors: string[];
  sizes: string[];
  description: string;
  image: string;
}

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  return (
    <Modal
      title={product.name}
      open={isOpen}
      onCancel={onClose}
      footer={[
        <button
          key="add-to-cart"
          className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition"
          onClick={() => {
            onClose();
          }}
        >
          Add to Cart - ${product.price.toFixed(2)}
        </button>,
      ]}
      width={800}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="mb-6">
            <h2 className="font-medium mb-2">Colors</h2>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  className={`px-4 py-2 border rounded hover:border-black ${
                    selectedColor === color ? "border-black" : ""
                  }`}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="font-medium mb-2">Size</h2>
            <div className="flex gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`px-4 py-2 border rounded hover:border-black ${
                    selectedSize === size ? "border-black" : ""
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductModal;
