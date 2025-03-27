import { Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-medium mb-4">COMPANY</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-black">About Us</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:text-black">Careers</Link></li>
              <li><Link to="/stores" className="text-gray-600 hover:text-black">Store Locator</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">HELP</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-gray-600 hover:text-black">FAQ</Link></li>
              <li><Link to="/shipping" className="text-gray-600 hover:text-black">Shipping</Link></li>
              <li><Link to="/returns" className="text-gray-600 hover:text-black">Returns</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">SERVICES</h3>
            <ul className="space-y-2">
              <li><Link to="/style-guide" className="text-gray-600 hover:text-black">Style Guide</Link></li>
              <li><Link to="/gift-cards" className="text-gray-600 hover:text-black">Gift Cards</Link></li>
              <li><Link to="/membership" className="text-gray-600 hover:text-black">Membership</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">SIGN UP FOR STYLE NEWS</h3>
            <form className="mb-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-black"
              />
              <button className="w-full mt-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition">
                SUBSCRIBE
              </button>
            </form>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-black"><Facebook size={20} /></a>
              <a href="#" className="text-gray-600 hover:text-black"><Instagram size={20} /></a>
              <a href="#" className="text-gray-600 hover:text-black"><Twitter size={20} /></a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-wrap justify-between items-center">
            <p className="text-sm text-gray-600">© 2024 Aashish. All rights reserved.</p>
            <div className="flex space-x-4 text-sm text-gray-600">
              <Link to="/privacy" className="hover:text-black">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-black">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}