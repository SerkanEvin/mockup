import { Camera, Sun, Ruler, Smartphone, Move, ZoomIn } from "lucide-react";

const tips = [
  {
    icon: Camera,
    title: "Face the Wall Directly",
    description: "Stand perpendicular to the wall for minimal distortion. Avoid angled shots.",
  },
  {
    icon: Move,
    title: "Stand 6-10 Feet Away",
    description: "For best results, stand 2-3 meters (6-10 ft) from the wall. This captures the whole wall with proper perspective.",
  },
  {
    icon: Sun,
    title: "Natural Lighting",
    description: "Take photos during daylight hours. Avoid harsh shadows or flash.",
  },
  {
    icon: Ruler,
    title: "Include Reference Points",
    description: "Include furniture or objects to help gauge size. Small: 30-50cm, Medium: 50-80cm, Large: 80-120cm width.",
  },
  {
    icon: Smartphone,
    title: "Hold Steady",
    description: "Keep your phone level and steady. Use grid lines if available.",
  },
  {
    icon: ZoomIn,
    title: "Capture Full Wall Section",
    description: "Ensure the entire wall area where you want the painting is visible. Include some floor and ceiling for context.",
  },
];

export const PhotoTips = () => {
  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-4">
            How to Take the Perfect Photo
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Follow these tips to get the most accurate preview of how your chosen artwork will look on your wall.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip, index) => (
            <div
              key={index}
              className="group p-6 bg-background border border-border hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-12 h-12 mb-4 flex items-center justify-center bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                <tip.icon className="w-6 h-6" />
              </div>
              <h3 className="font-medium text-foreground mb-2">{tip.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tip.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-primary/5 border border-primary/20">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-primary text-primary-foreground">
              <span className="text-xl font-bold">!</span>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">Pro Tip</h4>
              <p className="text-sm text-muted-foreground">
                For the best results, take multiple photos from the same position and choose the sharpest one. 
                A clear, well-lit photo will give you the most realistic preview of your artwork placement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
