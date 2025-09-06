import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { ImageWithFade } from "./ImageWithFade";

interface ProductCardProps {
  id: number;
  title: string;
  price: string;
  category: string;
  image: { id: number, url?: string | null } | string | null;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddToCart?: () => void;
}

export const ProductCard = ({
  id,
  title,
  price,
  category,
  image,
  showActions,
  onEdit,
  onDelete,
  onAddToCart,
}: ProductCardProps) => {
    const navigate = useNavigate();

    const handleCardClick = (e: React.MouseEvent) => {
        // Prevent navigation when clicking on a button inside the card
        if ((e.target as HTMLElement).closest('button')) {
            return;
        }
        navigate(`/products/${id}`);
    }
    
    const imageUrl = typeof image === 'string' 
        ? image 
        : image?.url 
        ? image.url 
        : image?.id 
        ? `http://localhost:5000/api/images/${image.id}` 
        : 'https://placehold.co/600x400';

  return (
    <Card 
        className="card-eco group cursor-pointer overflow-hidden" 
        onClick={handleCardClick}
    >
      <ImageWithFade
        src={imageUrl}
        alt={title}
        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        wrapperClassName="aspect-[4/3] bg-accent p-2"
      />
      <CardContent className="p-4 space-y-2">
        <p className="text-sm text-muted-foreground capitalize">{category}</p>
        <h3 className="font-semibold text-lg truncate group-hover:text-primary">{title}</h3>
        <div className="flex items-center justify-between">
          <p className="font-bold text-primary text-xl">₹{price}</p>
          {showActions ? (
             <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={onEdit}>Edit</Button>
                <Button variant="destructive" size="sm" onClick={onDelete}>Delete</Button>
            </div>
          ) : (
            <Button size="sm" onClick={onAddToCart}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};