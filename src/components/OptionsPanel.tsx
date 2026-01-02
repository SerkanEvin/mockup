import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

interface OptionsPanelProps {
  hasFrame: boolean;
  onFrameChange: (value: boolean) => void;
  size: "small" | "medium" | "large";
  onSizeChange: (value: "small" | "medium" | "large") => void;
}

export const OptionsPanel = ({ hasFrame, onFrameChange, size, onSizeChange }: OptionsPanelProps) => {
  const { t } = useTranslation();

  const sizes: Array<{ value: "small" | "medium" | "large"; label: string; dimensions: string }> = [
    { value: "small", label: t("options.sizes.small"), dimensions: '12" × 16"' },
    { value: "medium", label: t("options.sizes.medium"), dimensions: '18" × 24"' },
    { value: "large", label: t("options.sizes.large"), dimensions: '24" × 32"' },
  ];

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
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((s) => (
            <button
              key={s.value}
              onClick={() => onSizeChange(s.value)}
              className={`p-3 text-center transition-all duration-200 border ${size === s.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-card-foreground border-border hover:border-primary/50"
                }`}
            >
              <span className="block text-sm font-medium">{s.label}</span>
              <span className={`block text-xs mt-0.5 ${size === s.value ? "text-primary-foreground/80" : "text-muted-foreground"
                }`}>
                {s.dimensions}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
