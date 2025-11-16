import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCat } from "@/hooks/useCat.js";
import useCats from "@/hooks/useCats.js";
import { useSelectedCat } from "@/contexts/SelectedCatContext.jsx";

import { renameCatById, deleteCatById } from "@/services/catApi.js";

import CatProfileCard from "./CatProfileCard.jsx";
import CatInfoCard from "./CatInfoCard.jsx";
import RenameSection from "./RenameSection.jsx";
import ActionButtons from "./ActionButtons.jsx";
import ReleaseModal from "./ReleaseModal.jsx";

function validateCatName(rawName, currentName, hasDuplicateName) {
    const trimmed = rawName.trim();

    if (!trimmed) return "Name is required.";
    if (!/^[A-Za-z][A-Za-z0-9 ]*$/.test(trimmed)) {
        return "Only letters, numbers, and spaces allowed. Must start with a letter.";
    }
    if (trimmed.length < 3) return "Name must be at least 3 characters.";
    if (trimmed.length > 16) return "Name must be less than 16 characters.";

    if (
        currentName &&
        trimmed.toLowerCase() !== currentName.toLowerCase() &&
        hasDuplicateName(trimmed)
    ) {
        return `You already have a cat named "${trimmed}"`;
    }

    return "";
}

export default function CatDetailsInterface() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { selectedCatId, setSelectedCatId } = useSelectedCat();
    const { cat, loading, error, refetch } = useCat(id);
    const { hasDuplicateName } = useCats();

    const [renaming, setRenaming] = useState(false);
    const [newName, setNewName] = useState("");
    const [nameHint, setNameHint] = useState("");
    const [nameError, setNameError] = useState("");
    const [showRelease, setShowRelease] = useState(false);

    const isSelected = String(cat?.id) === String(selectedCatId);
    const isBob = cat?.id === 1;

    async function handleRename(e) {
        e.preventDefault();
        if (!cat) return;

        setNameError("");

        const validationMessage = validateCatName(
            newName,
            cat.name,
            hasDuplicateName
        );

        if (validationMessage) {
            setNameHint(validationMessage);
            return;
        }

        const trimmedName = newName.trim();

        try {
            await renameCatById(cat.id, trimmedName);
            await refetch({ background: true });

            setRenaming(false);
            setNewName("");
            setNameHint("");
        } catch (err) {
            const serverMsg =
                err?.response?.data?.error ||
                err?.response?.data?.message ||
                err?.response?.data?.detail ||
                err?.message ||
                "Failed to rename. Please try again.";

            setNameError(serverMsg);
        }
    }

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
                        <div className="self-start">
                            <CatProfileCard cat={cat} />
                        </div>

                        <div className="flex flex-col gap-4 self-center">
                            <CatInfoCard cat={cat} />
                        </div>
                    </div>
                </main>

                <ActionButtons
                    isSelected={isSelected}
                    isBob={isBob}
                    onRename={() => {
                        setRenaming(true);
                        setNewName(cat.name); // optional: prefill with current name
                    }}
                    onRelease={() => setShowRelease(true)}
                    onBack={() => navigate("/catbox")}
                    onSelect={() => setSelectedCatId(cat.id)}
                />
            </div>

            {renaming && (
                <RenameSection
                    newName={newName}
                    setNewName={(val) => {
                        setNewName(val);
                        if (nameHint) setNameHint("");
                        if (nameError) setNameError("");
                    }}
                    hint={nameHint}
                    error={nameError}
                    onSubmit={handleRename}
                    onCancel={() => {
                        setRenaming(false);
                        setNewName("");
                        setNameHint("");
                        setNameError("");
                    }}
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
