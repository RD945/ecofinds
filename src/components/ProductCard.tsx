import { Card } from "@/components/ui/card";

interface ProductCardProps {
  id: string;
  title: string;
  price: string;
  category: string;
  image?: string;
  onClick?: () => void;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ProductCard = ({
  title,
  price,
  category,
  image,
  onClick,
  showActions = false,
  onEdit,
  onDelete,
}: ProductCardProps) => {
  return (
    <Card className="card-eco cursor-pointer group" onClick={onClick}>
      <div className="aspect-[4/3] bg-accent rounded-t-xl overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent to-muted flex items-center justify-center">
            <div className="text-muted-foreground text-sm">No image</div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <span className="text-lg font-bold text-primary ml-2 shrink-0">
            {price}
          </span>
        </div>
        
        <p className="text-muted-foreground text-sm capitalize mb-3">
          {category}
        </p>
        
        {showActions && (
          <div className="flex gap-2 pt-2 border-t border-border">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              className="btn-eco-outline text-xs py-1 px-3 flex-1"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="text-xs py-1 px-3 border border-destructive text-destructive 
                       hover:bg-destructive hover:text-destructive-foreground
                       rounded-lg transition-all duration-200 flex-1"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};