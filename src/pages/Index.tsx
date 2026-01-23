import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageUploader from "@/components/ImageUploader";
import OutfitInput from "@/components/OutfitInput";
import GenerateButton from "@/components/GenerateButton";
import GeneratedGallery from "@/components/GeneratedGallery";
import { useOutfitGeneration } from "@/hooks/useOutfitGeneration";
import { toast } from "sonner";

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [outfitDescription, setOutfitDescription] = useState("");
  const { isGenerating, generatedImages, generateAllViews, resetImages } = useOutfitGeneration();

  const handleGenerate = async () => {
    if (!uploadedImage) {
      toast.error("Please upload a full-body image first");
      return;
    }
    if (!outfitDescription.trim()) {
      toast.error("Please describe the outfit you want to visualize");
      return;
    }

    await generateAllViews(uploadedImage, outfitDescription);
  };

  const handleClearImage = () => {
    setUploadedImage(null);
    resetImages();
  };

  const isReadyToGenerate = uploadedImage && outfitDescription.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <section className="text-center mb-16 animate-fade-in">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-4 tracking-tight">
              Virtual Fashion <span className="text-gradient-gold">Try-On</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform any photo into a professional fashion visualization. 
              AI-powered outfit rendering for e-commerce, AR, and personal styling.
            </p>
          </section>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Left Column - Input */}
            <div className="space-y-8 animate-slide-up" style={{ animationDelay: "100ms" }}>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-widest">
                  Step 1
                </span>
                <h2 className="font-serif text-2xl font-semibold text-foreground mt-1 mb-4">
                  Upload Your Photo
                </h2>
                <ImageUploader
                  onImageUpload={setUploadedImage}
                  uploadedImage={uploadedImage}
                  onClear={handleClearImage}
                />
              </div>
            </div>

            {/* Right Column - Description */}
            <div className="space-y-8 animate-slide-up" style={{ animationDelay: "200ms" }}>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-widest">
                  Step 2
                </span>
                <h2 className="font-serif text-2xl font-semibold text-foreground mt-1 mb-4">
                  Describe Your Outfit
                </h2>
                <OutfitInput
                  value={outfitDescription}
                  onChange={setOutfitDescription}
                />
              </div>

              <div className="pt-4">
                <GenerateButton
                  onClick={handleGenerate}
                  isGenerating={isGenerating}
                  disabled={!isReadyToGenerate}
                />
                {!isReadyToGenerate && (
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    {!uploadedImage
                      ? "Upload an image to continue"
                      : "Enter an outfit description to continue"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Gallery Section */}
          <section className="animate-slide-up" style={{ animationDelay: "300ms" }}>
            <GeneratedGallery
              images={generatedImages}
              isGenerating={isGenerating}
            />
          </section>

          {/* Features Section */}
          <section className="mt-24 mb-12">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl font-semibold text-foreground mb-4">
                Professional-Grade Results
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Every generation is optimized for commercial use across platforms
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "E-Commerce Ready",
                  description: "Clean edges and transparent backgrounds for product listings and catalogs",
                },
                {
                  title: "AR Compatible",
                  description: "Multi-angle views perfect for 3D rotation and augmented reality try-on",
                },
                {
                  title: "Consistent Quality",
                  description: "Same outfit, same colors, same details across all generated views",
                },
              ].map((feature, index) => (
                <div
                  key={feature.title}
                  className="p-6 rounded-lg border border-border bg-surface-elevated hover:border-accent/30 transition-colors animate-fade-in"
                  style={{ animationDelay: `${400 + index * 100}ms` }}
                >
                  <h3 className="font-serif text-xl font-medium text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
