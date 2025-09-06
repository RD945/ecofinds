import { useState } from "react";
import { Search, ShoppingCart, User, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartCount?: number;
  onNavigate: (page: string) => void;
  currentUser?: any;
}

export const Navigation = ({
  searchQuery,
  onSearchChange,
  cartCount = 0,
  onNavigate,
  currentUser,
}: NavigationProps) => {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">E</span>
            </div>
            <h1 className="text-xl font-bold text-primary">EcoFinds</h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search eco-friendly products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="input-eco pl-10"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-accent"
              onClick={() => onNavigate('cart')}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground 
                               text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>

            {/* User Menu */}
            {currentUser ? (
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent"
                onClick={() => onNavigate('dashboard')}
              >
                <User className="w-5 h-5" />
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => onNavigate('login')}
                className="btn-eco-outline"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Floating Add Button */}
      {currentUser && (
        <button
          className="fab-eco"
          onClick={() => onNavigate('add-product')}
        >
          <Plus className="w-6 h-6" />
        </button>
      )}
    </header>
  );
};