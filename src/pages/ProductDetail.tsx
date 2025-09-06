import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface Product {
  id: number;
  title: string;
  description: string;
  price: string;
  image_url: string | null;
  category: { name: string };
  seller: { username: string };
}

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
        navigate('/login');
        return;
    }
    try {
      await api.post('/cart', { productId: product!.id, quantity: 1 });
      alert('Product added to cart!');
    } catch (error) {
      console.error("Failed to add to cart", error);
    }
  };

  if (!product) {
    return <div>Loading...</div>; // Or a spinner
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border p-4">
        <div className="container mx-auto">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to products
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square bg-accent rounded-lg flex items-center justify-center overflow-hidden">
            <img 
              src={product.image_url || 'https://placehold.co/600x400'} 
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground capitalize mb-2">
                {product.category.name} / Sold by {product.seller.username}
              </p>
              <h1 className="text-4xl font-bold">{product.title}</h1>
            </div>

            <p className="text-3xl font-bold text-primary">₹{product.price}</p>
            
            <p className="text-lg text-muted-foreground">{product.description}</p>
            
            <Button size="lg" className="w-full btn-eco" onClick={handleAddToCart}>
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
