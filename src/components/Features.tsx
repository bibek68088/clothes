import { Truck, Clock, Shield, Headphones } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Shipping Worldwide',
    description: 'shipping 24/7'
  },
  {
    icon: Clock,
    title: '14 Days Return',
    description: 'shipping 24/7'
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: 'shipping 24/7'
  },
  {
    icon: Headphones,
    title: 'Expert advice',
    description: 'shipping 24/7'
  }
];

export function Features() {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <feature.icon className="w-8 h-8 mx-auto mb-4" />
              <h3 className="font-medium mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}