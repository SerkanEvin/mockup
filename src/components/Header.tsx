import { Frame } from "lucide-react";

export const Header = () => {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Frame className="w-6 h-6 text-primary" />
          <span className="font-serif text-xl font-medium text-foreground">ArtVision</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#visualizer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Visualizer
          </a>
          <a href="#tips" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Photo Tips
          </a>
        </nav>
      </div>
    </header>
  );
};
