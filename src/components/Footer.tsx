import { Frame } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="py-8 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Frame className="w-5 h-5" />
            <span className="font-serif text-lg">ArtVision</span>
          </div>
          <p className="text-sm text-primary-foreground/70">
            Visualize the perfect artwork for your space
          </p>
        </div>
      </div>
    </footer>
  );
};
