import { Hero } from '../components/Hero';
import { NewArrivals } from '../components/NewArrivals';
import { CategoryGrid } from '../components/CategoryGrid';
import { Features } from '../components/Features';
import { InstagramShop } from '../components/InstagramShop';

export function HomePage() {
  return (
    <div>
      <Hero />
      <NewArrivals />
      <CategoryGrid />
      
      <div className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-8">
        <div className="relative aspect-[4/3] group cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=800&q=80"
            alt="The knitted dress"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition flex items-end p-8">
            <div className="text-white">
              <h3 className="text-2xl font-medium mb-2">The knitted dress</h3>
              <p className="mb-4">Shop the carefully handpicked fabrics and classic lines</p>
              <button className="bg-white text-black px-6 py-2 rounded-full">
                Shop knitted dresses
              </button>
            </div>
          </div>
        </div>
        
        <div className="relative aspect-[4/3] group cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=80"
            alt="From the top"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition flex items-end p-8">
            <div className="text-white">
              <h3 className="text-2xl font-medium mb-2">From the top</h3>
              <p className="mb-4">Shop the latest trends and affordable alternatives for our valued customers</p>
              <button className="bg-white text-black px-6 py-2 rounded-full">
                Shop the drop
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Features />
      <InstagramShop />
    </div>
  );
}