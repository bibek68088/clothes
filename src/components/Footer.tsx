import { Container, Text, Group, ActionIcon,} from "@mantine/core"
import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, Linkedin, ShoppingBag } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-50 py-12 mt-auto">
      <Container size="xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag size={24} className="text-blue-600" />
              <Text fw={700} size="lg">
                Aashish
              </Text>
            </div>
            <Text size="sm" c="dimmed" className="max-w-xs">
              Your one-stop destination for premium clothing and accessories. Quality meets style in every product.
            </Text>
            <Group mt="md">
              <ActionIcon variant="subtle" color="gray">
                <Facebook size={18} />
              </ActionIcon>
              <ActionIcon variant="subtle" color="gray">
                <Twitter size={18} />
              </ActionIcon>
              <ActionIcon variant="subtle" color="gray">
                <Instagram size={18} />
              </ActionIcon>
              <ActionIcon variant="subtle" color="gray">
                <Linkedin size={18} />
              </ActionIcon>
            </Group>
          </div>

          <div>
            <Text fw={600} mb="md">
              Shop
            </Text>
            <div className="flex flex-col gap-2">
              <Link to="/products" className="text-gray-600 hover:text-blue-600 no-underline text-sm">
                All Products
              </Link>
              <Link to="/categories/men" className="text-gray-600 hover:text-blue-600 no-underline text-sm">
                Men's Collection
              </Link>
              <Link to="/categories/women" className="text-gray-600 hover:text-blue-600 no-underline text-sm">
                Women's Collection
              </Link>
              <Link to="/sale" className="text-gray-600 hover:text-blue-600 no-underline text-sm">
                Sale
              </Link>
              <Link to="/new-arrivals" className="text-gray-600 hover:text-blue-600 no-underline text-sm">
                New Arrivals
              </Link>
            </div>
          </div>

          <div>
            <Text fw={600} mb="md">
              Support
            </Text>
            <div className="flex flex-col gap-2">
              <Link to="/contact" className="text-gray-600 hover:text-blue-600 no-underline text-sm">
                Contact Us
              </Link>
              <Link to="/faq" className="text-gray-600 hover:text-blue-600 no-underline text-sm">
                FAQs
              </Link>
              <Link to="/shipping" className="text-gray-600 hover:text-blue-600 no-underline text-sm">
                Shipping & Returns
              </Link>
              <Link to="/size-guide" className="text-gray-600 hover:text-blue-600 no-underline text-sm">
                Size Guide
              </Link>
              <Link to="/track-order" className="text-gray-600 hover:text-blue-600 no-underline text-sm">
                Track Order
              </Link>
            </div>
          </div>

          <div>
            <Text fw={600} mb="md">
              Company
            </Text>
            <div className="flex flex-col gap-2">
              <Link to="/about" className="text-gray-600 hover:text-blue-600 no-underline text-sm">
                About Us
              </Link>
              <Link to="/careers" className="text-gray-600 hover:text-blue-600 no-underline text-sm">
                Careers
              </Link>
              <Link to="/privacy-policy" className="text-gray-600 hover:text-blue-600 no-underline text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-600 hover:text-blue-600 no-underline text-sm">
                Terms & Conditions
              </Link>
              <Link to="/sustainability" className="text-gray-600 hover:text-blue-600 no-underline text-sm">
                Sustainability
              </Link>
            </div>
          </div>
        </div>

      </Container>
    </footer>
  )
}

