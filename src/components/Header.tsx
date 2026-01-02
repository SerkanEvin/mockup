import { Frame } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";

export const Header = () => {
  const { t } = useTranslation();

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Frame className="w-6 h-6 text-primary" />
          <span className="font-serif text-xl font-medium text-foreground">ArtVision</span>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6">
            <a href="#visualizer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("header.nav.visualizer")}
            </a>
            <a href="#tips" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("header.nav.tips")}
            </a>
          </nav>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};
