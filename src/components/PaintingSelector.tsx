import painting1 from "@/assets/painting1.jpg";
import painting2 from "@/assets/painting2.jpg";
import painting3 from "@/assets/painting3.jpg";
import painting4 from "@/assets/painting4.jpg";

interface PaintingSelectorProps {
  selectedPainting: number;
  onSelect: (index: number) => void;
}

const paintings = [
  { src: painting1, name: "Modern Geometry", artist: "Abstract Collection" },
  { src: painting2, name: "Misty Mountains", artist: "Nature Series" },
  { src: painting3, name: "Botanical Study", artist: "Minimalist Collection" },
  { src: painting4, name: "Bold Expression", artist: "Contemporary Art" },
];

export const PaintingSelector = ({ selectedPainting, onSelect }: PaintingSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-serif text-lg font-medium text-foreground">Select Artwork</h3>
      <div className="grid grid-cols-2 gap-3">
        {paintings.map((painting, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className={`group relative aspect-[3/4] overflow-hidden transition-all duration-300 ${
              selectedPainting === index
                ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                : "hover:ring-1 hover:ring-border"
            }`}
          >
            <img
              src={painting.src}
              alt={painting.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-2 text-left opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-xs font-medium text-primary-foreground">{painting.name}</p>
              <p className="text-xs text-primary-foreground/70">{painting.artist}</p>
            </div>
            {selectedPainting === index && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-primary flex items-center justify-center">
                <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export { paintings };
