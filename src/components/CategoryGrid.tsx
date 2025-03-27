import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
  {
    id: "shirt",
    name: "Shirt",
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "coats",
    name: "Coats",
    image:
      "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "eyewear",
    name: "Eyewear",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "dress",
    name: "Dress",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "bags",
    name: "Bags",
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "top",
    name: "Top",
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=400&q=80",
  },
];

export function CategoryGrid() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Determine how many items to show based on screen size
  const getVisibleItems = () => {
    if (window.innerWidth >= 1024) return 6; // Large screens
    if (window.innerWidth >= 768) return 3; // Medium screens
    return 2; // Small screens
  };

  const handleNext = () => {
    setCurrentSlide((prev) =>
      (prev + 1) * getVisibleItems() >= categories.length ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    setCurrentSlide((prev) =>
      prev === 0
        ? Math.floor((categories.length - 1) / getVisibleItems())
        : prev - 1
    );
  };

  // Auto-sliding effect
  useEffect(() => {
    // Only auto-slide if not hovered
    if (!isHovered) {
      const autoSlideInterval = setInterval(() => {
        handleNext();
      }, 3000); // Change slide every 3 seconds

      // Cleanup interval on unmount or when dependencies change
      return () => clearInterval(autoSlideInterval);
    }
  }, [currentSlide, isHovered]);

  return (
    <div
      className="bg-[#FFF5F2] py-16 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container mx-auto px-4 relative">
        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/70 rounded-full p-2 shadow-md hover:bg-white transition"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/70 rounded-full p-2 shadow-md hover:bg-white transition"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel Container */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${
                currentSlide * (100 / getVisibleItems())
              }%)`,
              width: `${(categories.length / getVisibleItems()) * 100}%`,
            }}
          >
            {categories.map((category) => (
              <div
                key={category.id}
                className="w-1/2 md:w-1/3 lg:w-1/6 flex-shrink-0 px-2"
              >
                <Link
                  to={`/category/${category.id}`}
                  className="text-center block group"
                >
                  <div className="aspect-square rounded-full overflow-hidden mb-4">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <h3 className="font-medium">{category.name}</h3>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
