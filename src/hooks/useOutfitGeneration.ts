import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface GeneratedImage {
  id: string;
  label: string;
  description: string;
  url: string | null;
}

const defaultImages: GeneratedImage[] = [
  { id: "front", label: "Front View", description: "Full-body, facing forward", url: null },
  { id: "left", label: "Left View", description: "90° left side profile", url: null },
  { id: "right", label: "Right View", description: "90° right side profile", url: null },
  { id: "back", label: "Back View", description: "Facing backward", url: null },
  { id: "outfit", label: "Outfit Only", description: "Transparent background", url: null },
];

type ViewType = "front" | "left" | "right" | "back" | "outfit";

export function useOutfitGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>(defaultImages);
  const [currentView, setCurrentView] = useState<ViewType | null>(null);

  const generateSingleView = useCallback(async (
    userImage: string,
    outfitDescription: string,
    viewType: ViewType
  ): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke("generate-outfit", {
        body: { userImage, outfitDescription, viewType },
      });

      if (error) {
        console.error(`Error generating ${viewType}:`, error);
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      return data.imageUrl;
    } catch (error) {
      console.error(`Failed to generate ${viewType}:`, error);
      return null;
    }
  }, []);

  const generateAllViews = useCallback(async (
    userImage: string,
    outfitDescription: string
  ) => {
    setIsGenerating(true);
    setGeneratedImages(defaultImages);

    const viewTypes: ViewType[] = ["front", "left", "right", "back", "outfit"];

    for (const viewType of viewTypes) {
      setCurrentView(viewType);
      toast.info(`Generating ${viewType} view...`);

      const imageUrl = await generateSingleView(userImage, outfitDescription, viewType);

      if (imageUrl) {
        setGeneratedImages((prev) =>
          prev.map((img) =>
            img.id === viewType ? { ...img, url: imageUrl } : img
          )
        );
        toast.success(`${viewType.charAt(0).toUpperCase() + viewType.slice(1)} view complete!`);
      } else {
        toast.error(`Failed to generate ${viewType} view`);
      }
    }

    setCurrentView(null);
    setIsGenerating(false);
    toast.success("All views generated!");
  }, [generateSingleView]);

  const resetImages = useCallback(() => {
    setGeneratedImages(defaultImages);
  }, []);

  return {
    isGenerating,
    generatedImages,
    currentView,
    generateAllViews,
    resetImages,
  };
}
