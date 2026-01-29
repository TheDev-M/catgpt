import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCat } from "@/hooks/useCat.js";
import useCats from "@/hooks/useCats.js";
import { useSelectedCat } from "@/contexts/SelectedCatContext.jsx";
import { useRenameForm } from "@/hooks/useRenameForm.js";

import { deleteCatById } from "@/services/catApi.js";

import CatProfileCard from "./CatProfileCard.jsx";
import CatInfoCard from "./CatInfoCard.jsx";
import RenameSection from "./RenameSection.jsx";
import ActionButtons from "./ActionButtons.jsx";
import ReleaseModal from "./ReleaseModal.jsx";

export default function CatDetailsInterface() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedCatId, setSelectedCatId } = useSelectedCat();
  const { cat, loading, error, refetch } = useCat(id);
  const { hasDuplicateName } = useCats();
  const [showRelease, setShowRelease] = useState(false);

  const {
    renaming,
    newName,
    nameHint,
    nameError,
    startRenaming,
    cancelRenaming,
    updateName,
    handleRename,
  } = useRenameForm(cat, hasDuplicateName, () => refetch({ background: true }));

  const isSelected = String(cat?.id) === String(selectedCatId);
  const isDefaultCat = cat?.isDefaultCat;

  async function handleRelease() {
    if (!cat) return;

    try {
      const wasSelected = isSelected;
      await deleteCatById(cat.id);

      if (wasSelected) {
        setSelectedCatId(1);
      }

      navigate("/catbox");
    } catch {
      alert("Failed to release cat. Please try again.");
    }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!cat || error) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center gap-4">
        <p className="opacity-70 text-lg">Cat not found.</p>
        <button
          className="btn btn-primary rounded-full px-6"
          onClick={() => navigate("/catbox")}
        >
          Back to CatBox
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-full flex flex-col">
        <main className="flex-1 max-w-6xl mx-auto px-4 py-8">
          <div className="grid gap-8 lg:grid-cols-2 items-start">
            <CatProfileCard cat={cat} />
            <CatInfoCard cat={cat} />
          </div>
        </main>

        <ActionButtons
          isSelected={isSelected}
          isDefaultCat={isDefaultCat}
          onRename={startRenaming}
          onRelease={() => setShowRelease(true)}
          onBack={() => navigate("/catbox")}
          onSelect={() => setSelectedCatId(cat.id)}
        />
      </div>

      {renaming && (
        <RenameSection
          newName={newName}
          setNewName={updateName}
          hint={nameHint}
          error={nameError}
          onSubmit={handleRename}
          onCancel={cancelRenaming}
        />
      )}

      <ReleaseModal
        cat={cat}
        open={showRelease}
        onClose={() => setShowRelease(false)}
        onConfirm={handleRelease}
      />
    </>
  );
}
