import { useSelectedCat } from "@/contexts/SelectedCatContext.jsx";
import { useCatChat } from "@/hooks/useCatChat.js";

import CatProfileCard from "./CatProfileCard.jsx";
import CatProfileSkeleton from "./CatProfileSkeleton.jsx";
import ErrorMessage from "@/components/Errors/ErrorMessage.jsx";

import UserInterface from "./UserInterface.jsx";
import ChatAnswer from "./ChatAnswer.jsx";

import { useMoodDecay } from "@/hooks/useMoodDecay.js";

export default function ChatInterface({ cat, loading, error, refetchCat }) {
  const { selectedCatId } = useSelectedCat();

  const catName = cat?.name ?? "";
  const catImage = cat?.image || null;

  const { answer, thinking, sendPrompt } = useCatChat(cat);

  const decreaseMood = useMoodDecay(selectedCatId, {
    onCatUpdated: () => refetchCat({ background: true })
  });

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <CatProfileSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <ErrorMessage
          title="Failed to load your cat."
          message="Please try again!"
          onRetry={() => refetchCat({ background: false })}
        />
      </div>
    );
  }

  const handleSend = async (text) => {
    await sendPrompt(text);
    await decreaseMood();
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <div className="w-full flex justify-center">
        <CatProfileCard catName={catName} catImage={catImage} />
      </div>

      <div className="w-full flex-1 flex items-center justify-center">
        <ChatAnswer text={answer} thinking={thinking} />
      </div>

      <div className="w-full flex justify-center">
        <UserInterface
          disabled={thinking || !cat}
          placeholder={`Asking ${catName || "Your cat"}…`}
          onSend={handleSend}
        />
      </div>
    </div>
  );
}
