import { useState } from "react";
import { WallPreview } from "./WallPreview";
import { PaintingSelector, paintings } from "./PaintingSelector";
import { OptionsPanel } from "./OptionsPanel";
import { PhotoUploader } from "./PhotoUploader";

export const Visualizer = () => {
  const [wallImage, setWallImage] = useState<string | null>(null);
  const [selectedPainting, setSelectedPainting] = useState(0);
  const [hasFrame, setHasFrame] = useState(true);
  const [size, setSize] = useState<"small" | "medium" | "large">("medium");

  return (
    <section id="visualizer" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-4">
            Wall Art Visualizer
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload your wall photo, choose your artwork, and customize the frame and size to see a realistic preview.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <WallPreview
              wallImage={wallImage}
              paintingImage={paintings[selectedPainting].src}
              hasFrame={hasFrame}
              size={size}
            />
            <div className="p-4 bg-card border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">
                    {paintings[selectedPainting].name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {paintings[selectedPainting].artist} • {size.charAt(0).toUpperCase() + size.slice(1)} • {hasFrame ? "Framed" : "Unframed"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <PhotoUploader onUpload={setWallImage} hasImage={!!wallImage} />
            <PaintingSelector
              selectedPainting={selectedPainting}
              onSelect={setSelectedPainting}
            />
            <OptionsPanel
              hasFrame={hasFrame}
              onFrameChange={setHasFrame}
              size={size}
              onSizeChange={setSize}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
