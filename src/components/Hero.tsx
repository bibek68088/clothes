import { useState, useEffect } from 'react';

const carouselItems = [
  {
    title: "Modern design",
    subtitle: "Discover the latest fashion trends",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    bgColor: "from-purple-100 via-pink-100 to-yellow-100"
  },
  {
    title: "Summer Collection",
    subtitle: "Explore our new summer styles",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80",
    bgColor: "from-blue-100 via-green-100 to-yellow-100"
  },
  {
    title: "Sale Up To 80% Off",
    subtitle: "Shop the season's best deals",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
    bgColor: "from-red-100 via-pink-100 to-orange-100"
  }
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[500px] overflow-hidden">
      {carouselItems.map((item, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className={`h-full bg-gradient-to-r ${item.bgColor}`}>
            <div className="container mx-auto px-4 h-full flex items-center">
              <div className="max-w-2xl">
                <h1 className="text-6xl font-light mb-4">{item.title}</h1>
                <p className="text-xl text-gray-600 mb-8">{item.subtitle}</p>
                <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition">
                  Shop now
                </button>
              </div>
            </div>
          </div>
          <img
            src={item.image}
            alt={item.title}
            className="absolute right-0 top-0 h-full w-1/2 object-cover"
          />
        </div>
      ))}
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentSlide ? 'bg-black' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}