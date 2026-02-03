import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Sparkles, Clock, Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useStorage } from "@/context/StorageContext";

const Dashboard = () => {
  const { savedImages, cartItems } = useStorage();

  // Mock data for trending styles (keep mock for now as we don't have a backend feed)
  const trendingStyles = [
    { id: 1, title: "Cyberpunk Street", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", likes: 234 },
    { id: 2, title: "Minimalist Chic", image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", likes: 189 },
    { id: 3, title: "Boho Festival", image: "https://images.unsplash.com/photo-1529139574466-a302d27f60d0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", likes: 156 },
  ];

  const recentActivity = savedImages.slice(0, 3); // Show last 3 generated images

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Welcome Section */}
          <section className="animate-fade-in">
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-2">
              Welcome back, <span className="text-gradient-gold">Fashionista</span>
            </h1>
            <p className="text-muted-foreground">
              Manage your generated styles and collections.
            </p>
          </section>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
            <Card className="bg-surface-elevated/50 backdrop-blur-sm border-white/10 hover:border-accent/30 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Designs</CardTitle>
                <Sparkles className="w-4 h-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{savedImages.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Generated so far</p>
              </CardContent>
            </Card>

            <Card className="bg-surface-elevated/50 backdrop-blur-sm border-white/10 hover:border-accent/30 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">Saved Items</CardTitle>
                <Heart className="w-4 h-4 text-pink-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{savedImages.filter(img => img.url).length}</div>
                <p className="text-xs text-muted-foreground mt-1">Available in Gallery</p>
              </CardContent>
            </Card>

            <Card className="bg-surface-elevated/50 backdrop-blur-sm border-white/10 hover:border-accent/30 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">In Cart</CardTitle>
                <ShoppingBag className="w-4 h-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{cartItems.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Ready for checkout</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2 space-y-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl font-semibold">Recent Generations</h2>
                <Link to="/gallery">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">View All</Button>
                </Link>
              </div>
              <div className="bg-surface-elevated/30 rounded-xl p-6 border border-white/5 space-y-4">
                {recentActivity.length > 0 ? recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="w-10 h-10 rounded-md bg-accent/10 overflow-hidden flex-shrink-0">
                      {activity.url && <img src={activity.url} alt={activity.label} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Generated {activity.label}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">{activity.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(activity.date).toLocaleDateString()}</span>
                  </div>
                )) : <p className="text-sm text-muted-foreground">No recent activity.</p>}
              </div>
            </div>

            {/* Trending Styles */}
            <div className="space-y-6 animate-slide-up" style={{ animationDelay: "300ms" }}>
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl font-semibold">Trending Now</h2>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Explore</Button>
              </div>
              <div className="space-y-4">
                {trendingStyles.map((style) => (
                  <div key={style.id} className="group relative overflow-hidden rounded-lg aspect-video cursor-pointer">
                    <img src={style.image} alt={style.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100" />
                    <div className="absolute bottom-3 left-3">
                      <p className="text-white font-medium text-sm">{style.title}</p>
                      <div className="flex items-center gap-1 text-xs text-white/70">
                        <Heart className="w-3 h-3 text-red-500 fill-red-500" /> {style.likes} likes
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <section className="animate-slide-up" style={{ animationDelay: "400ms" }}>
            <div className="bg-gradient-to-r from-accent/20 to-purple-500/20 rounded-2xl p-8 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="font-serif text-2xl font-semibold mb-2">Ready to create something new?</h2>
                <p className="text-muted-foreground">Use our AI to generate your next favorite outfit.</p>
              </div>
              <Link to="/generate">
                <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90">
                  Start Generating <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
