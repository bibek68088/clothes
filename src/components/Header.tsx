import { Search, ShoppingBag, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../store/useCart';

export function Header() {
  const cartItems = useCart((state) => state.items);
  
  return (
    <header className="bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold">
            Aashish
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link to="/new" className="text-gray-600 hover:text-black">New</Link>
            <Link to="/shop" className="text-gray-600 hover:text-black">Shop</Link>
            <Link to="/featured" className="text-gray-600 hover:text-black">Featured</Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Search className="w-5 h-5" />
            </button>
            <Link to="/account" className="p-2 hover:bg-gray-100 rounded-full">
              <User className="w-5 h-5" />
            </Link>
            <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full relative">
              <ShoppingBag className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}