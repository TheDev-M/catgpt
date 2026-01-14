import { useState } from "react";
import { useRandomBreedCat } from "@/hooks/useRandomBreedCat.js";
import useCats from "@/hooks/useCats.js";
import { createCat } from "@/services/catApi.js";

import ModalFrame from "./ModalFrame.jsx";
import LoadingSkeleton from "./LoadingSkeleton.jsx";
import BreedHeader from "./BreedHeader.jsx";
import BreedImage from "./BreedImage.jsx";
import BreedDescription from "./BreedDescription.jsx";
import NicknameForm from "./NicknameForm.jsx";

export default function CaughtCatPopup({ onClose }) {
    const { cat, loading, error: loadError } = useRandomBreedCat();
    const { hasDuplicateName } = useCats();

    const [nickname, setNickname] = useState("");
    const [hint, setHint] = useState("");
    const [error, setError] = useState("");

    function validateNickname(rawName) {
        const trimmed = rawName.trim();

        if (!trimmed) return "Nickname is required.";
        if (trimmed.length < 3) return "Must be at least 3 characters.";
        if (trimmed.length > 16) return "Must be less than 16 characters.";
        if (!/^[A-Za-z][A-Za-z0-9 ]*$/.test(trimmed)) {
            return "Only letters, numbers and spaces allowed. Must start with a letter.";
        }
        if (hasDuplicateName(trimmed)) {
            return `You already have a cat named "${trimmed}"`;
        }

        return "";
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        const validationMessage = validateNickname(nickname);
        if (validationMessage) {
            setHint(validationMessage);
            return;
        }

        const trimmedName = nickname.trim();

        try {
            await createCat({
                name: trimmedName,
                breed: cat.name,
                temperaments: cat.temperaments,
                sourceMetrics: {
                    energyLevel: cat.energy_level,
                    grooming: cat.grooming,
                    healthIssues: cat.health_issues,
                },
                image: cat.image || null,
            });

            onClose();
        } catch (err) {
            const serverMsg =
                err?.response?.data?.error ||
                err?.response?.data?.message ||
                err?.response?.data?.detail ||
                err?.message ||
                "Failed to save cat. Please try again.";

            setError(serverMsg);
        }
    }

    if (loading) return <LoadingSkeleton />;
    if (!cat) return null;

    return (
        <ModalFrame onClose={onClose}>
            <BreedHeader name={cat.name} />
            {cat.image && <BreedImage src={cat.image} alt={cat.name} />}
            <BreedDescription description={cat.description} error={loadError} />
            <NicknameForm
                nickname={nickname}
                setNickname={(val) => {
                    setNickname(val);

                    if (hint) setHint("");
                    if (error) setError("");
                }}
                hint={hint}
                error={error}
                onSubmit={handleSubmit}
                onCancel={onClose}
            />
        </ModalFrame>
    );
}
