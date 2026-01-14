import LayoutBackground from "@/components/Layouts/LayoutBackground.jsx";
import HomeButton from "@/components/NavButtons/HomeButton.jsx";
import CatBoxInterface from "@/components/CatBox/CatBoxInterface.jsx";

export default function CatBoxPage() {
  return (
    <LayoutBackground variant="neutral">
      <div className="fixed bottom-3 right-3 z-1000">
        <HomeButton />
      </div>

      <CatBoxInterface />
    </LayoutBackground>
  );
}
