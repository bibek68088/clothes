// src/pages/ProductPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { useCart } from '../store/useCart';
import { useAuth } from '../store/useAuth';
import { Button, Alert } from '@mantine/core';
import { IconAlertCircle, IconShoppingCart } from '@tabler/icons-react';

export function ProductPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id || '');
        setProduct(data);
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login', {
        state: { from: `/product/${id}` },
        replace: false,
      });
      return;
    }

    if (!selectedColor) {
      alert('Please select a color');
      return;
    }
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    try {
      // Add the item to cart with selected color and size
      await addItem(product, {
        color: selectedColor,
        size: selectedSize,
      });

      // Show confirmation message
      setAddedToCart(true);

      // Hide confirmation after 3 seconds
      setTimeout(() => {
        setAddedToCart(false);
      }, 3000);
    } catch (err) {
      setError('Failed to add item to cart');
    }
  };

  if (loading) return <div className="container mx-auto p-4">Loading...</div>;
  if (error) return <div className="container mx-auto p-4">Error: {error}</div>;
  if (!product) return <div className="container mx-auto p-4">Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-100">
          <img src={product.image_url || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div>
          <h1 className="text-3xl font-medium mb-2">{product.name}</h1>
          <p className="text-2xl mb-4">${product.price}</p>

          {product.description && <p className="text-gray-600 mb-6">{product.description}</p>}

          {!isAuthenticated && (
            <Alert icon={<IconAlertCircle size={16} />} color="blue" className="mb-6">
              Please{" "}
              <Button variant="subtle" size="xs" onClick={() => navigate("/login")}>
                sign in
              </Button>{" "}
              to add items to your cart.
            </Alert>
          )}

          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <h2 className="font-medium mb-2">Colors</h2>
              <div className="flex gap-2">
                {product.colors.map((color: string) => (
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

          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h2 className="font-medium mb-2">Size</h2>
              <div className="flex gap-2">
                {product.sizes.map((size: string) => (
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

          <Button
            onClick={handleAddToCart}
            className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition"
            disabled={!isAuthenticated || !selectedColor || !selectedSize}
            leftSection={<IconShoppingCart size={20} />}
          >
            Add to Cart
          </Button>

          {addedToCart && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">Item added to cart successfully!</div>
          )}
        </div>
      </div>
    </div>
  );
}