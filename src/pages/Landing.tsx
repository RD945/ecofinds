import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Navigation } from "@/components/Navigation";
import { CategoryFilter } from "@/components/CategoryFilter";
import heroImage from "@/assets/hero-image.jpg";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ServerCrash, RefreshCw } from "lucide-react";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";


interface ProductImage {
    id: number;
    url: string | null;
}

interface Product {
  id: number;
  title: string;
  price: string;
  category: { name: string };
  images: ProductImage[];
}

const categories = ["kitchen", "accessories", "electronics", "personal care", "home", "clothing"];

export const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartCount, setCartCount] = useState(0); 
  const [serverError, setServerError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    setServerError(false);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      const { data } = await api.get(`/products?${params.toString()}`);
      setProducts(data);
    } catch (error: any) {
      console.error("Failed to fetch products:", error);
      if (error.code === 'ERR_NETWORK') {
        setServerError(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory]);

   useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const { data } = await api.get('/cart');
          setCartCount(data.reduce((sum: number, item: any) => sum + item.quantity, 0));
        } catch (error) {
          console.error("Failed to fetch cart:", error);
        }
      } else {
        setCartCount(0);
      }
    };
    fetchCart();
  }, [user]);

  const handleAddToCart = async (productId: number) => {
    if (!user) {
        navigate('/auth');
        return;
    }
    try {
        await api.post('/cart', { productId, quantity: 1});
        // A toast notification would be better here.
        alert('Product added to cart!');
        // Refetch cart to update count
        const { data } = await api.get('/cart');
        setCartCount(data.reduce((sum: number, item: any) => sum + item.quantity, 0));
    } catch (error) {
        console.error("Failed to add to cart", error);
        // We could also check for 401 here as a fallback
        if ((error as any).response?.status === 401) {
            navigate('/auth');
        }
    }
  };

  const filteredProducts = products;

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={cartCount}
      />

      {/* Hero Section */}
      {!searchQuery && !serverError && (
        <section className="relative bg-gradient-to-b from-accent/30 to-background">
          <div className="container mx-auto px-4 py-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                  Discover
                  <span className="text-primary"> Sustainable</span>
                  <br />
                  Products for a Better Tomorrow
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Join our community of eco-conscious shoppers and sellers. 
                  Find unique, sustainable products that make a difference.
                </p>
                <div className="flex gap-4">
                  <Button 
                    size="lg"
                    onClick={() => navigate('/auth?mode=signup')}
                  >
                    Start Shopping
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    onClick={() => navigate('/add-product')}
                  >
                    Sell Your Items
                  </Button>
                </div>
              </div>
              <div className="order-first lg:order-last">
                <img
                  src={heroImage}
                  alt="Eco-friendly products"
                  className="w-full h-auto rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {!serverError && (
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      )}

      {/* Products Grid / Error States */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : serverError ? (
          <div className="text-center py-12">
            <div className="w-32 h-32 bg-destructive/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <ServerCrash className="w-16 h-16 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold text-destructive mb-2">
              Server is Offline
            </h3>
            <p className="text-muted-foreground mb-4">
              We couldn't connect to the server. Please make sure the backend is running.
            </p>
            <Button onClick={fetchProducts}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-32 h-32 bg-accent rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-4xl">🌱</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No products found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or browse different categories
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                category={product.category.name}
                image={product.images && product.images.length > 0 ? product.images[0] : null}
                onAddToCart={() => handleAddToCart(product.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};