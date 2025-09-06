import { useState } from "react";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CartProps {
  onNavigate: (page: string) => void;
}

// Mock cart data
const mockCartItems = [
  {
    id: "cart-1",
    title: "Bamboo Water Bottle",
    price: 25.00,
    category: "kitchen",
    quantity: 1,
    image: null,
    seller: "EcoStore"
  },
  {
    id: "cart-2",
    title: "Organic Cotton Tote Bag",
    price: 18.00,
    category: "accessories",
    quantity: 2,
    image: null,
    seller: "GreenGoods"
  },
];

export const Cart = ({ onNavigate }: CartProps) => {
  const [cartItems, setCartItems] = useState(mockCartItems);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }
    setCartItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    console.log("Proceeding to checkout...");
    // In a real app, would integrate with payment processor
    alert("Checkout functionality would be implemented with a payment processor like Stripe!");
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
          <h1 className="text-xl font-semibold">Shopping Cart</h1>
          <span className="text-muted-foreground">
            ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
          </span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          // Empty Cart State
          <div className="max-w-md mx-auto text-center">
            <Card className="card-eco">
              <CardContent className="p-12">
                <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">
                  Discover amazing eco-friendly products from our community
                </p>
                <Button
                  className="btn-eco"
                  onClick={() => onNavigate("home")}
                >
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Cart with Items
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-2xl font-semibold mb-4">Cart Items</h2>
              
              {cartItems.map((item) => (
                <Card key={item.id} className="card-eco">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-accent rounded-lg flex-shrink-0 flex items-center justify-center">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-muted-foreground text-sm">No image</span>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 truncate">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground text-sm capitalize mb-1">
                          {item.category} • by {item.seller}
                        </p>
                        <p className="text-primary font-semibold">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>

                      {/* Quantity Controls & Remove */}
                      <div className="flex flex-col items-end gap-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive h-8 w-8"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        <p className="text-lg font-bold text-primary">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="card-eco sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="text-success">Free</span>
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Free shipping on orders over $50
                      </p>
                    )}
                  </div>

                  <hr className="border-border" />

                  {/* Total */}
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    onClick={handleCheckout}
                    className="btn-eco w-full"
                    size="lg"
                  >
                    Proceed to Checkout
                  </Button>

                  {/* Trust Indicators */}
                  <div className="pt-4 border-t border-border space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="text-success">✓</span>
                      Secure checkout
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="text-success">✓</span>
                      30-day return policy
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="text-success">✓</span>
                      Eco-friendly packaging
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};