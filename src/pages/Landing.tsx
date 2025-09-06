import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Navigation } from "@/components/Navigation";
import { CategoryFilter } from "@/components/CategoryFilter";
import heroImage from "@/assets/hero-image.jpg";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";


interface Product {
  id: number;
  title: string;
  price: string;
  category: { name: string };
  image_url: string | null;
}

const categories = ["kitchen", "accessories", "electronics", "personal care", "home", "clothing"];

export const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartCount, setCartCount] = useState(0); // Mock cart count

  useEffect(() => {
    const fetchProducts = async () => {
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
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
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
    try {
        await api.post('/cart', { productId, quantity: 1});
        // A toast notification would be better here.
        alert('Product added to cart!');
        // Refetch cart to update count
         if (user) {
            const { data } = await api.get('/cart');
            setCartCount(data.reduce((sum: number, item: any) => sum + item.quantity, 0));
        }
    } catch (error) {
        console.error("Failed to add to cart", error);
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
      {!searchQuery && selectedCategory === "all" && (
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
                    className="btn-eco"
                    onClick={() => navigate('/signup')}
                  >
                    Start Shopping
                  </Button>
                  <Button 
                    className="btn-eco-outline"
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

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Products Grid */}
      <main className="container mx-auto px-4 py-8">
        {searchQuery && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground">
              Search results for "{searchQuery}"
            </h2>
            <p className="text-muted-foreground">
              {filteredProducts.length} products found
            </p>
          </div>
        )}

        {filteredProducts.length === 0 ? (
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
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                category={product.category.name}
                image={product.image_url}
                onAddToCart={() => handleAddToCart(product.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};