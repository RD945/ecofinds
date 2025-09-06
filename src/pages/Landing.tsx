import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Navigation } from "@/components/Navigation";
import { CategoryFilter } from "@/components/CategoryFilter";
import heroImage from "@/assets/hero-image.jpg";

// Mock data for demonstration
const mockProducts = [
  {
    id: "1",
    title: "Bamboo Water Bottle",
    price: "$25.00",
    category: "kitchen",
    image: null,
  },
  {
    id: "2", 
    title: "Organic Cotton Tote Bag",
    price: "$18.00",
    category: "accessories",
    image: null,
  },
  {
    id: "3",
    title: "Eco-Friendly Phone Case",
    price: "$35.00",
    category: "electronics",
    image: null,
  },
  {
    id: "4",
    title: "Sustainable Bamboo Toothbrush Set",
    price: "$12.00",
    category: "personal care",
    image: null,
  },
  {
    id: "5",
    title: "Reusable Beeswax Food Wraps",
    price: "$22.00",
    category: "kitchen",
    image: null,
  },
  {
    id: "6",
    title: "Solar-Powered Charger",
    price: "$45.00",
    category: "electronics",
    image: null,
  },
];

const categories = ["kitchen", "accessories", "electronics", "personal care", "home", "clothing"];

interface LandingProps {
  onNavigate: (page: string) => void;
  currentUser?: any;
}

export const Landing = ({ onNavigate, currentUser }: LandingProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartCount] = useState(2); // Mock cart count

  // Filter products based on search and category
  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={cartCount}
        onNavigate={onNavigate}
        currentUser={currentUser}
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
                  <button 
                    className="btn-eco"
                    onClick={() => onNavigate('signup')}
                  >
                    Start Shopping
                  </button>
                  <button 
                    className="btn-eco-outline"
                    onClick={() => onNavigate('add-product')}
                  >
                    Sell Your Items
                  </button>
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
                {...product}
                onClick={() => console.log('Navigate to product', product.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};