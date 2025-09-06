import { useState } from "react";
import { ArrowLeft, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AddProductProps {
  onNavigate: (page: string) => void;
  onProductAdded?: (product: any) => void;
}

const categories = [
  "kitchen",
  "accessories", 
  "electronics",
  "personal care",
  "home",
  "clothing",
  "books",
  "toys",
  "garden",
  "other"
];

export const AddProduct = ({ onNavigate, onProductAdded }: AddProductProps) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    condition: "new",
  });
  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Mock image upload - in real app would upload to server
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImages(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Product title is required";
    }
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Product description is required";
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Please enter a valid price";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Mock API call
    setTimeout(() => {
      const newProduct = {
        id: Date.now().toString(),
        ...formData,
        price: `$${parseFloat(formData.price).toFixed(2)}`,
        images,
        createdAt: new Date().toISOString(),
      };

      onProductAdded?.(newProduct);
      setIsSubmitting(false);
      onNavigate("dashboard");
    }, 1000);
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
          <h1 className="text-xl font-semibold">List Your Item</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="card-eco">
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
            <p className="text-muted-foreground">
              Share your eco-friendly items with our community
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Product Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={`input-eco ${errors.title ? "border-destructive" : ""}`}
                  placeholder="e.g., Bamboo Water Bottle"
                />
                {errors.title && (
                  <p className="text-destructive text-sm">{errors.title}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange("category", value)}
                >
                  <SelectTrigger className={`input-eco ${errors.category ? "border-destructive" : ""}`}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-destructive text-sm">{errors.category}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className={`input-eco min-h-24 ${errors.description ? "border-destructive" : ""}`}
                  placeholder="Describe your item, its condition, and why it's eco-friendly..."
                />
                {errors.description && (
                  <p className="text-destructive text-sm">{errors.description}</p>
                )}
              </div>

              {/* Price and Condition */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className={`input-eco ${errors.price ? "border-destructive" : ""}`}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="text-destructive text-sm">{errors.price}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Condition</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) => handleInputChange("condition", value)}
                  >
                    <SelectTrigger className="input-eco">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="like-new">Like New</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <Label>Product Images</Label>
                
                {/* Upload Button */}
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      Click to upload images or drag and drop
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      PNG, JPG up to 10MB each
                    </p>
                  </label>
                </div>

                {/* Image Preview */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground 
                                   rounded-full w-6 h-6 flex items-center justify-center opacity-0 
                                   group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="btn-eco w-full"
              >
                {isSubmitting ? "Creating Listing..." : "Submit Listing"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};