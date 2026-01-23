import { Download, ZoomIn, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GeneratedImage {
  id: string;
  label: string;
  description: string;
  url: string | null;
}

interface GeneratedGalleryProps {
  images: GeneratedImage[];
  isGenerating: boolean;
}

const GeneratedGallery = ({ images, isGenerating }: GeneratedGalleryProps) => {
  const handleDownload = async (url: string, label: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `${label.toLowerCase().replace(/\s+/g, "-")}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(downloadUrl);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            Generated Views
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            5 high-resolution outfit visualizations
          </p>
        </div>
        {images.some((img) => img.url) && (
          <Button variant="minimal" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={cn(
              "group relative aspect-[3/4] rounded-lg overflow-hidden border border-border bg-surface-sunken",
              "animate-fade-in"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {isGenerating && !image.url ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <Loader2 className="w-8 h-8 text-accent animate-spin mb-3" />
                <p className="text-xs text-muted-foreground text-center">
                  Generating...
                </p>
              </div>
            ) : image.url ? (
              <>
                <img
                  src={image.url}
                  alt={image.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-primary-foreground text-sm font-medium mb-2">
                    {image.label}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(image.url!, image.label)}
                      className="w-8 h-8 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
                    >
                      <Download className="w-4 h-4 text-primary-foreground" />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center hover:bg-primary-foreground/30 transition-colors">
                      <ZoomIn className="w-4 h-4 text-primary-foreground" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-border mb-3" />
                <p className="text-sm font-medium text-foreground text-center">
                  {image.label}
                </p>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  {image.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneratedGallery;
