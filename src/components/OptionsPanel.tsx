import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { WallArtSize, WALL_ART_SIZES } from "@/config/wallSizes";

interface OptionsPanelProps {
  hasFrame: boolean;
  onFrameChange: (value: boolean) => void;
  size: WallArtSize;
  onSizeChange: (value: WallArtSize) => void;
}

export const OptionsPanel = ({ hasFrame, onFrameChange, size, onSizeChange }: OptionsPanelProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-serif text-lg font-medium text-foreground">{t("options.frameTitle")}</h3>
        <div className="flex items-center justify-between p-4 bg-card border border-border">
          <div className="space-y-1">
            <Label htmlFor="frame-toggle" className="text-sm font-medium">
              {hasFrame ? t("options.withFrame") : t("options.withoutFrame")}
            </Label>
            <p className="text-xs text-muted-foreground">
              {hasFrame ? t("options.frameDesc.with") : t("options.frameDesc.without")}
            </p>
          </div>
          <Switch
            id="frame-toggle"
            checked={hasFrame}
            onCheckedChange={onFrameChange}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-serif text-lg font-medium text-foreground">{t("options.sizeTitle")}</h3>
        <div className="grid grid-cols-5 gap-2">
          {(Object.entries(WALL_ART_SIZES) as [WallArtSize, typeof WALL_ART_SIZES.m][]).map(([key, config]) => (
            <button
              key={key}
              onClick={() => onSizeChange(key)}
              className={`p-2 text-center transition-all duration-200 border rounded-md ${size === key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-card-foreground border-border hover:border-primary/50"
                }`}
            >
              <span className="block text-sm font-medium">{config.label}</span>
              <span className={`block text-[10px] mt-0.5 ${size === key ? "text-primary-foreground/80" : "text-muted-foreground"
                }`}>
                {config.width}x{config.height}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
