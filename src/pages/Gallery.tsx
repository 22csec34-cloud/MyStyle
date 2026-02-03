import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GeneratedGallery from "@/components/GeneratedGallery";
import { useStorage } from "@/context/StorageContext";

const Gallery = () => {
    const { savedImages } = useStorage();

    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-accent/30">
            <Header />

            <main className="flex-1 py-12 px-6">
                <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
                    <div className="text-center">
                        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4">
                            Your <span className="text-gradient-gold">Collection</span>
                        </h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Browse your generated styles and fashion visualizations.
                        </p>
                    </div>

                    <div className="mt-12">
                        {savedImages.length === 0 ? (
                            <div className="text-center py-20 bg-surface-elevated/30 rounded-2xl border border-white/10 backdrop-blur-sm">
                                <p className="text-muted-foreground">No images generated yet.</p>
                                <a href="/generate" className="text-accent hover:underline mt-2 inline-block">
                                    start creating
                                </a>
                            </div>
                        ) : (
                            <GeneratedGallery images={[...savedImages].reverse()} isGenerating={false} />
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Gallery;
