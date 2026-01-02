import { useCallback } from "react";
import { Upload, Camera } from "lucide-react";

interface PhotoUploaderProps {
  onUpload: (imageUrl: string) => void;
  hasImage: boolean;
}

export const PhotoUploader = ({ onUpload, hasImage }: PhotoUploaderProps) => {
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          onUpload(result);
        };
        reader.readAsDataURL(file);
      }
    },
    [onUpload]
  );

  return (
    <div className="space-y-4">
      <h3 className="font-serif text-lg font-medium text-foreground">Your Wall Photo</h3>
      <label
        className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed cursor-pointer transition-all duration-200 ${
          hasImage
            ? "border-primary/50 bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-accent/50"
        }`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center gap-2 text-center">
          {hasImage ? (
            <>
              <Camera className="w-8 h-8 text-primary" />
              <span className="text-sm font-medium text-foreground">Change Photo</span>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Upload Wall Photo</span>
              <span className="text-xs text-muted-foreground">PNG, JPG up to 10MB</span>
            </>
          )}
        </div>
      </label>
    </div>
  );
};
