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
            "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=80",
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
            <button
                onClick={() => setIsModalOpen(true)}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition z-10 sm:p-2"
            >
                <Plus className="w-8 h-8 text-gray-700 sm:w-6 sm:h-6" />
            </button>

            <ProductModal
                product={product}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default ProductImageContainer;
