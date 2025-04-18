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
  {
    id: "shoes",
    name: "Shoes",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "jackets",
    name: "Jackets",
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "hats",
    name: "Hats",
    image:
      "https://images.unsplash.com/photo-1521369909029-2b2f91c6dbf8?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "jeans",
    name: "Jeans",
    image:
      "https://unsplash.com/photos/two-hats-sitting-on-the-sand-of-a-beach-bfH7BHbIhwg",
  },
];

const duplicatedCategories = [...categories, ...categories];

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

export function CategoryGrid() {
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState(1);
  const [speed, setSpeed] = useState(1);
  const windowWidth = useWindowSize();

  const getVisibleItems = () => {
    if (windowWidth >= 1024) return 6;
    if (windowWidth >= 768) return 3;
    return 2;
  };

  const visibleItems = getVisibleItems();
  const baseDuration = categories.length * 4;
  const animationDuration = baseDuration / speed;

  const handleLeftClick = () => {
    if (direction === 1) {
      setDirection(-1);
    } else {
      setSpeed((prev) => Math.min(prev + 0.5, 3));
    }
  };

  const handleRightClick = () => {
    if (direction === -1) {
      setDirection(1);
    } else {
      setSpeed((prev) => Math.min(prev + 0.5, 3));
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "ArrowLeft") {
        handleLeftClick();
      } else if (event.key === "ArrowRight") {
        handleRightClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, speed]);

  return (
    <div
      className="bg-[#FFF5F2] py-16 relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container mx-auto px-4 relative">
        <button
          onClick={handleLeftClick}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/70 rounded-full p-2 shadow-md hover:bg-white transition-colors"
          aria-label={direction === 1 ? "Reverse direction" : "Speed up"}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleRightClick}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/70 rounded-full p-2 shadow-md hover:bg-white transition-colors"
          aria-label={direction === -1 ? "Reverse direction" : "Speed up"}
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="overflow-hidden">
          <div
            className="flex will-change-transform"
            style={{
              animation: `scroll ${animationDuration}s linear infinite`,
              animationPlayState: isHovered ? "paused" : "running",
              animationDirection: direction === 1 ? "normal" : "reverse",
            }}
          >
            {duplicatedCategories.map((category, index) => (
              <div
                key={`${category.id}-${index}`}
                className="w-1/2 md:w-1/3 lg:w-1/6 flex-shrink-0 px-2"
                style={{ flex: `0 0 ${100 / visibleItems}%` }}
              >
                <Link
                  to={`/category/${category.id}`}
                  className="text-center block group"
                >
                  <div className="aspect-square rounded-full overflow-hidden mb-4">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="font-medium">{category.name}</h3>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
