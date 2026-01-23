import { Sparkles } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full py-6 px-8 border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-semibold tracking-tight">
              Atelier<span className="text-gradient-gold">AI</span>
            </h1>
            <p className="text-xs text-muted-foreground tracking-widest uppercase">
              Virtual Fashion Studio
            </p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#" className="text-foreground hover:text-accent transition-colors">
            Try-On
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Gallery
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            About
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
