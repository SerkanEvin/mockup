import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Visualizer } from "@/components/Visualizer";
import { PhotoTips } from "@/components/PhotoTips";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Visualizer />
        <section id="tips">
          <PhotoTips />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
