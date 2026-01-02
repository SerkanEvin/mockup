import { Camera, Sun, Ruler, Smartphone, Move, ZoomIn } from "lucide-react";
import { useTranslation } from "react-i18next";

export const PhotoTips = () => {
  const { t } = useTranslation();

  const tips = [
    {
      icon: Camera,
      title: t("tips.items.faceWall.title"),
      description: t("tips.items.faceWall.description"),
    },
    {
      icon: Move,
      title: t("tips.items.distance.title"),
      description: t("tips.items.distance.description"),
    },
    {
      icon: Sun,
      title: t("tips.items.lighting.title"),
      description: t("tips.items.lighting.description"),
    },
    {
      icon: Ruler,
      title: t("tips.items.reference.title"),
      description: t("tips.items.reference.description"),
    },
    {
      icon: Smartphone,
      title: t("tips.items.steady.title"),
      description: t("tips.items.steady.description"),
    },
    {
      icon: ZoomIn,
      title: t("tips.items.fullWall.title"),
      description: t("tips.items.fullWall.description"),
    },
  ];

  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-4">
            {t("tips.title")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("tips.description")}
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
              <h4 className="font-medium text-foreground mb-1">{t("tips.proTip.title")}</h4>
              <p className="text-sm text-muted-foreground">
                {t("tips.proTip.description")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
