import { useRandomBreedCat } from "@/hooks/useRandomBreedCat.js";
import { useCaughtCatForm } from "@/hooks/useCaughtCatForm.js";
import { useCats } from "@/hooks/useCats.js";

import ModalFrame from "./ModalFrame.jsx";
import BreedHeader from "./BreedHeader.jsx";
import BreedImage from "./BreedImage.jsx";
import BreedDescription from "./BreedDescription.jsx";
import NicknameForm from "./NicknameForm.jsx";

export default function CaughtCatPopup({ onClose }) {
  const { cat, loading, error: loadError } = useRandomBreedCat();
  const { hasDuplicateName } = useCats();
  const form = useCaughtCatForm(cat, hasDuplicateName, onClose);

  return (
    <ModalFrame onClose={onClose}>
      {loading ? (
        <>
          <div className="skeleton h-8 w-48 mx-auto" />
          <div className="skeleton h-44 w-full rounded-lg" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-10 w-full mt-2" />
        </>
      ) : (
        <>
          <BreedHeader name={cat?.name} />
          {cat?.image && <BreedImage src={cat.image} alt={cat.name} />}
          <BreedDescription description={cat?.description} error={loadError} />
          <NicknameForm
            nickname={form.nickname}
            setNickname={form.setNickname}
            hint={form.error}
            error={form.error}
            onSubmit={form.handleSubmit}
            onCancel={onClose}
          />
        </>
      )}
    </ModalFrame>
  );
}
