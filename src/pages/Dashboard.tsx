import { useState } from "react";
import { ArrowLeft, User, Package, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/ProductCard";

interface DashboardProps {
  onNavigate: (page: string) => void;
  currentUser?: any;
}

// Mock user data
const mockUserListings = [
  {
    id: "user-1",
    title: "Vintage Bamboo Cutting Board",
    price: "$35.00",
    category: "kitchen",
    image: null,
  },
  {
    id: "user-2",
    title: "Handmade Organic Soap Set",
    price: "$24.00",
    category: "personal care",
    image: null,
  },
  {
    id: "user-3",
    title: "Upcycled Denim Jacket",
    price: "$45.00",
    category: "clothing",
    image: null,
  },
];

const mockUserPurchases = [
  {
    id: "purchase-1",
    title: "Solar Phone Charger",
    price: "$29.00",
    category: "electronics",
    image: null,
    purchaseDate: "2024-01-15",
  },
  {
    id: "purchase-2",
    title: "Reusable Silicone Food Bags",
    price: "$18.00",
    category: "kitchen",
    image: null,
    purchaseDate: "2024-01-10",
  },
];

export const Dashboard = ({ onNavigate, currentUser }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("listings");

  const handleEditProduct = (productId: string) => {
    console.log("Edit product:", productId);
    // In a real app, would navigate to edit form
  };

  const handleDeleteProduct = (productId: string) => {
    console.log("Delete product:", productId);
    // In a real app, would show confirmation and delete
  };

  const stats = {
    totalListings: mockUserListings.length,
    totalPurchases: mockUserPurchases.length,
    totalEarnings: mockUserListings.reduce((sum, item) => {
      return sum + parseFloat(item.price.replace('$', ''));
    }, 0),
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="container mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate("home")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">My Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {currentUser?.name || "User"}!
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Profile & Navigation */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="card-eco">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg">{currentUser?.name || "User"}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {currentUser?.email || "user@example.com"}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="btn-eco-outline"
                  onClick={() => console.log("Edit profile")}
                >
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="space-y-4">
              <Card className="card-eco">
                <CardContent className="p-4 flex items-center gap-3">
                  <Package className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Listings</p>
                    <p className="text-xl font-bold">{stats.totalListings}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-eco">
                <CardContent className="p-4 flex items-center gap-3">
                  <ShoppingBag className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Purchases</p>
                    <p className="text-xl font-bold">{stats.totalPurchases}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-eco">
                <CardContent className="p-4 flex items-center gap-3">
                  <span className="text-2xl">💰</span>
                  <div>
                    <p className="text-sm text-muted-foreground">Potential Earnings</p>
                    <p className="text-xl font-bold text-success">
                      ${stats.totalEarnings.toFixed(2)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="listings" className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  My Listings
                </TabsTrigger>
                <TabsTrigger value="purchases" className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  My Purchases
                </TabsTrigger>
              </TabsList>

              {/* My Listings Tab */}
              <TabsContent value="listings" className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-semibold">My Listings</h2>
                    <p className="text-muted-foreground">
                      Manage your products and track their performance
                    </p>
                  </div>
                  <Button
                    className="btn-eco"
                    onClick={() => onNavigate("add-product")}
                  >
                    Add New Product
                  </Button>
                </div>

                {mockUserListings.length === 0 ? (
                  <Card className="card-eco">
                    <CardContent className="p-12 text-center">
                      <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start selling your eco-friendly items today!
                      </p>
                      <Button
                        className="btn-eco"
                        onClick={() => onNavigate("add-product")}
                      >
                        Create Your First Listing
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockUserListings.map((product) => (
                      <ProductCard
                        key={product.id}
                        {...product}
                        showActions={true}
                        onEdit={() => handleEditProduct(product.id)}
                        onDelete={() => handleDeleteProduct(product.id)}
                        onClick={() => console.log("View product", product.id)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* My Purchases Tab */}
              <TabsContent value="purchases" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold">My Purchases</h2>
                  <p className="text-muted-foreground">
                    View your purchase history and track orders
                  </p>
                </div>

                {mockUserPurchases.length === 0 ? (
                  <Card className="card-eco">
                    <CardContent className="p-12 text-center">
                      <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No purchases yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Discover amazing eco-friendly products from our community!
                      </p>
                      <Button
                        className="btn-eco"
                        onClick={() => onNavigate("home")}
                      >
                        Start Shopping
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {mockUserPurchases.map((purchase) => (
                      <Card key={purchase.id} className="card-eco">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-accent rounded-lg flex-shrink-0"></div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{purchase.title}</h3>
                              <p className="text-sm text-muted-foreground capitalize">
                                {purchase.category}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Purchased on {new Date(purchase.purchaseDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-primary">
                                {purchase.price}
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};