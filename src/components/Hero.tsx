import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export const Hero = () => {
  const { t } = useTranslation();

  const scrollToVisualizer = () => {
    document.getElementById("visualizer")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-background to-card overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-foreground transform rotate-12" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-foreground transform -rotate-6" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-medium text-foreground mb-6 leading-tight">
          {t("hero.title")}<br />
          <span className="text-primary">{t("hero.subtitle")}</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          {t("hero.description")}
        </p>
        <Button
          onClick={scrollToVisualizer}
          size="lg"
          className="group"
        >
          {t("hero.cta")}
          <ArrowDown className="ml-2 w-4 h-4 transition-transform group-hover:translate-y-1" />
        </Button>
      </div>
    </section>
  );
};
