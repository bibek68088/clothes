const instagramPosts = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=800&q=80'
  }
];

export function InstagramShop() {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-2xl mb-8">INSTAGRAM SHOP</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {instagramPosts.map((post) => (
            <a
              key={post.id}
              href="#"
              className="aspect-square overflow-hidden group"
            >
              <img
                src={post.image}
                alt="Instagram post"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}