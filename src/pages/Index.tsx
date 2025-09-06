import { useState } from "react";
import { Landing } from "./Landing";
import { Auth } from "./Auth";
import { AddProduct } from "./AddProduct";
import { Dashboard } from "./Dashboard";
import { Cart } from "./Cart";

type Page = "home" | "login" | "signup" | "add-product" | "dashboard" | "cart";

const Index = () => {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [currentUser, setCurrentUser] = useState(null);

  const handleNavigation = (page: string) => {
    setCurrentPage(page as Page);
  };

  const handleAuth = (user: any) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage("home");
  };

  // Render current page
  switch (currentPage) {
    case "login":
      return <Auth mode="login" onNavigate={handleNavigation} onAuth={handleAuth} />;
    case "signup":
      return <Auth mode="signup" onNavigate={handleNavigation} onAuth={handleAuth} />;
    case "add-product":
      return <AddProduct onNavigate={handleNavigation} />;
    case "dashboard":
      return <Dashboard onNavigate={handleNavigation} currentUser={currentUser} />;
    case "cart":
      return <Cart onNavigate={handleNavigation} />;
    default:
      return <Landing onNavigate={handleNavigation} currentUser={currentUser} />;
  }
};

export default Index;
