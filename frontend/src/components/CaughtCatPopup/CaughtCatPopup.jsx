import { useRandomBreedCat } from "@/hooks/useRandomBreedCat.js";
import { useCaughtCatForm } from "@/hooks/useCaughtCatForm.js";
import { useCats } from "@/hooks/useCats.js";

import ModalFrame from "./ModalFrame.jsx";
import LoadingSkeleton from "./LoadingSkeleton.jsx";
import BreedHeader from "./BreedHeader.jsx";
import BreedImage from "./BreedImage.jsx";
import BreedDescription from "./BreedDescription.jsx";
import NicknameForm from "./NicknameForm.jsx";

export default function CaughtCatPopup({ onClose }) {
  const { cat, loading, error: loadError } = useRandomBreedCat();
  const { hasDuplicateName } = useCats();
  const form = useCaughtCatForm(cat, hasDuplicateName, onClose);

  if (loading) return <LoadingSkeleton />;
  if (!cat) return null;

  return (
    <ModalFrame onClose={onClose}>
      <BreedHeader name={cat.name} />
      {cat.image && <BreedImage src={cat.image} alt={cat.name} />}
      <BreedDescription description={cat.description} error={loadError} />
      <NicknameForm
        nickname={form.nickname}
        setNickname={form.setNickname}
        hint={form.error}
        error={form.error}
        onSubmit={form.handleSubmit}
        onCancel={onClose}
      />
    </ModalFrame>
  );
}
