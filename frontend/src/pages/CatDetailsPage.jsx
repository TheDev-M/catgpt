import LayoutBackground from "@/components/Layouts/LayoutBackground.jsx";
import CatDetailsInterface from "@/components/CatDetails/CatDetailsInterface.jsx";

export default function CatDetailsPage() {
  return (
    <LayoutBackground variant="neutral">
      <div className="h-screen overflow-y-auto">
        <CatDetailsInterface />
      </div>
    </LayoutBackground>
  );
}
