import React, { useState } from "react";
import { Plus } from "lucide-react";
import ProductModal from "./ProductModal";

const ProductImageContainer: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const product = {
    name: "ALD Uniform Hoodie",
    price: 69.0,
    colors: ["Black", "Green", "Gray", "Brown"],
    sizes: ["S", "M", "L", "XL"],
    description: "Comfortable and versatile hoodie for everyday wear.",
    image:
      "https://images.unsplash.com/photo-1513789181297-6f2ec112c0bc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG9vZGllfGVufDB8fDB8fHww",
  };

  return (
    <div
      className="relative w-full max-w-full mx-auto overflow-hidden"
      style={{ height: "90vh" }}
    >
      <img
        src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80"
        alt={product.name}
        className="w-full h-full object-cover sm:object-contain pt-16"
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {/* Wave circles */}
        <div className="absolute inset-0 animate-ping-slow bg-blue-500/30 rounded-full"></div>
        <div className="absolute inset-0 animate-ping-slow animation-delay-300 bg-blue-500/20 rounded-full"></div>
        <div className="absolute inset-0 animate-ping-slow animation-delay-600 bg-blue-500/10 rounded-full"></div>

        {/* Button with Plus icon */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="relative z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition"
        >
          <Plus className="w-8 h-8 text-gray-700" />
        </button>
      </div>

      <ProductModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ProductImageContainer;
