import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LayoutBackground from "@/components/Layouts/LayoutBackground.jsx";
import ThemePicker from "@/components/ThemePicker/ThemePicker.jsx";
import RunningCat from "@/components/RunningCat.jsx";
import FallingItems from "@/components/FallingItems.jsx";
import ChatInterface from "@/components/ChatInterface/ChatInterface.jsx";
import CatBoxButton from "@/components/NavButtons/CatBoxButton.jsx";
import InventoryButton from "@/components/NavButtons/InventoryButton.jsx";
import FriendListButton from "@/components/NavButtons/FriendListButton.jsx";
import InventoryDrawer from "@/components/Inventory/InventoryDrawer.jsx";
import FriendListDrawer from "@/components/FriendList/FriendListDrawer.jsx";
import StatusPanel from "@/components/Status/StatusPanel.jsx";
import { useSelectedCat } from "@/contexts/SelectedCatContext.jsx";
import { useCat } from "@/hooks/useCat.js";
import { useInventory } from "@/hooks/useInventory.js";
import { useHungerDecay } from "@/hooks/useHungerDecay.js";
import { useAuth } from "@/hooks/useAuth.js";
import { useFriends } from "@/hooks/useFriends.js";

export default function HomePage() {
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [friendListOpen, setFriendListOpen] = useState(false);
  const { selectedCatId } = useSelectedCat();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const {
    cat,
    loading: catLoading,
    error: catError,
    updateCat
  } = useCat(selectedCatId);

  const {
    items,
    loading: invLoading,
    error: invError,
    usingId,
    useItem,
    refetchItems
  } = useInventory(selectedCatId, updateCat);

  const {
    friends,
    incoming,
    outgoing,
    loading: friendsLoading,
    error: friendsError,
    sendRequest,
    approve,
    decline,
    remove
  } = useFriends(friendListOpen);

  useHungerDecay(selectedCatId, updateCat);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const toggleInventory = () => {
    setInventoryOpen(o => !o);
    setFriendListOpen(false);
  };

  const toggleFriendList = () => {
    setFriendListOpen(o => !o);
    setInventoryOpen(false);
  };

  return (
    <LayoutBackground variant="warm">
      <div className="h-screen flex">
        {inventoryOpen && (
          <div className="h-full w-72 sm:w-80 md:w-96 border-r border-base-300 bg-base-200/90 shadow-xl shrink-0">
            <InventoryDrawer
              onClose={() => setInventoryOpen(false)}
              items={items}
              loading={invLoading}
              error={invError}
              usingId={usingId}
              onUse={useItem}
            />
          </div>
        )}

        <div className="flex-1 relative min-w-0">
          <div className="absolute top-3 left-3 z-10">
            <StatusPanel cat={cat} loading={catLoading} error={catError} />
          </div>

          <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
            {user && (
              <span
                id="home-username-display"
                className="text-xs sm:text-sm opacity-80"
              >
                Hi, <span className="font-semibold">{user.nickname ?? user.username}</span>
              </span>
            )}

            <button
                id="home-profile-button"
                type="button"
                onClick={() => navigate("/profile")}
                className="btn btn-xs btn-ghost"
            >
                Profile
            </button>

            <button
              id="home-logout-button"
              type="button"
              onClick={handleLogout}
              className="btn btn-xs btn-outline"
            >
              Log out
            </button>

            <ThemePicker />
          </div>

          <div className="absolute bottom-3 left-3 z-10">
            <InventoryButton
              open={inventoryOpen}
              onToggle={toggleInventory}
            />
          </div>

          <div className="absolute bottom-3 right-3 z-10 flex gap-2">
            <FriendListButton
              open={friendListOpen}
              onToggle={toggleFriendList}
              pendingCount={incoming.length}
            />
            <CatBoxButton />
          </div>

          <div className="h-full">
            <ChatInterface
              cat={cat}
              loading={catLoading}
              error={catError}
              onCatUpdated={updateCat}
            />
          </div>
        </div>

        {friendListOpen && (
          <div className="h-full w-72 sm:w-80 md:w-96 border-l border-base-300 bg-base-200/90 shadow-xl shrink-0">
            <FriendListDrawer
              onClose={() => setFriendListOpen(false)}
              friends={friends}
              incoming={incoming}
              outgoing={outgoing}
              loading={friendsLoading}
              error={friendsError}
              onSendRequest={sendRequest}
              onApprove={approve}
              onDecline={decline}
              onRemove={remove}
            />
          </div>
        )}
      </div>

      <RunningCat />
      <FallingItems onItemCaught={refetchItems} />
    </LayoutBackground>
  );
}
