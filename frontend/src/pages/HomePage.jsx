import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LayoutBackground from "@/components/Layouts/LayoutBackground.jsx";
import ThemePicker from "@/components/ThemePicker/ThemePicker.jsx";
import LanguageSwitcher from "@/components/LanguageSwitcher/LanguageSwitcher.jsx";
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
import { useSseEvent } from "@/hooks/useSseEvent.js";
import { useCallback } from "react";

export default function HomePage() {
  const { t } = useTranslation();
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [friendListOpen, setFriendListOpen] = useState(false);
  const [statusPeek, setStatusPeek] = useState(false);
  const { selectedCatId, setSelectedCatId } = useSelectedCat();
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  const { cat, loading: catLoading, error: catError, updateCat } = useCat(selectedCatId);
  const { items, loading: invLoading, error: invError, usingId, useItem, refetchItems } = useInventory(selectedCatId, updateCat);
  const { friends, incoming, outgoing, loading: friendsLoading, error: friendsError, sendRequest, approve, decline, remove, returnBorrowed } = useFriends(friendListOpen);

  useHungerDecay(selectedCatId, updateCat);

  const handleBorrowUpdate = useCallback(async () => { await refreshUser(); }, [refreshUser]);
  useSseEvent("cat-borrow-update", handleBorrowUpdate);

  const handleLogout = () => { logout(); navigate("/login", { replace: true }); };
  const toggleInventory = () => setInventoryOpen(o => !o);
  const toggleFriendList = () => setFriendListOpen(o => !o);

  const handleBorrowed = useCallback(async (catId) => {
    await setSelectedCatId(catId);
    await refreshUser();
  }, [setSelectedCatId, refreshUser]);

  const handleReturnCat = useCallback(async (catId) => {
    try {
      await returnBorrowed(catId);
      const updated = await refreshUser();
      const fallbackId = updated?.selectedCatId ?? null;
      await setSelectedCatId(fallbackId ? Number(fallbackId) : null);
    } catch { /* ignore */ }
  }, [returnBorrowed, setSelectedCatId, refreshUser]);

  const borrowedCatId = cat && user && cat.borrowedByUsername === user.username ? selectedCatId : null;

  return (
    <LayoutBackground variant="warm">
      <div className="h-dvh flex">
        {inventoryOpen && (
          <div className="fixed inset-0 z-50 bg-base-200 md:static md:inset-auto md:z-auto md:h-full md:w-80 md:border-r md:border-base-300 md:bg-base-200/90 md:shadow-xl md:shrink-0">
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

        <div className="flex-1 relative min-w-0 flex flex-col">
          {/* Mobile top bar */}
          <div className="md:hidden flex items-center justify-between gap-2 px-3 py-2 shrink-0 z-10">
            <div className="relative shrink-0">
              <button
                type="button"
                className="btn btn-xs btn-ghost opacity-70"
                onPointerDown={() => setStatusPeek(true)}
                onPointerUp={() => setStatusPeek(false)}
                onPointerLeave={() => setStatusPeek(false)}
              >
                {t("home.stats")}
              </button>
              {statusPeek && (
                <div className="absolute top-full left-0 mt-1 z-50">
                  <StatusPanel cat={cat} loading={catLoading} error={catError} />
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {user && (
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  title={`Go to your profile — ${user.nickname ?? user.username}`}
                  className="btn btn-ghost btn-xs px-2 text-xs opacity-80 hover:opacity-100 max-w-24"
                >
                  <span className="truncate">{t("home.greeting", { name: user.nickname ?? user.username })}</span>
                </button>
              )}
              <button type="button" onClick={handleLogout} className="btn btn-xs btn-outline">
                {t("home.logout")}
              </button>
              <LanguageSwitcher />
              <ThemePicker />
            </div>
          </div>

          {/* Desktop overlays */}
          <div className="hidden md:block absolute top-3 left-3 z-10">
            <StatusPanel cat={cat} loading={catLoading} error={catError} />
          </div>
          <div className="hidden md:flex absolute top-3 right-3 z-10 items-center gap-2">
            {user && (
              <button
                id="home-username-display"
                type="button"
                onClick={() => navigate("/profile")}
                title="Go to your profile"
                className="text-sm opacity-80 hover:opacity-100 cursor-pointer btn btn-ghost btn-xs px-2"
              >
                {t("home.greeting", { name: user.nickname ?? user.username })}
              </button>
            )}
            <button id="home-logout-button" type="button" onClick={handleLogout} className="btn btn-xs btn-outline">
              {t("home.logout")}
            </button>
            <LanguageSwitcher />
            <ThemePicker />
          </div>

          {/* Bottom-left: Inventory */}
          <div className="absolute bottom-3 left-3 z-10">
            <InventoryButton open={inventoryOpen} onToggle={toggleInventory} />
          </div>

          {/* Bottom-right: Cat Box + Friend List */}
          <div className="absolute bottom-3 right-3 z-10 flex gap-2">
            <CatBoxButton />
            <FriendListButton open={friendListOpen} onToggle={toggleFriendList} pendingCount={incoming.length} />
          </div>

          <div className="flex-1 min-h-0">
            <ChatInterface cat={cat} loading={catLoading} error={catError} onCatUpdated={updateCat} />
          </div>
        </div>

        {friendListOpen && (
          <div className="fixed inset-0 z-50 bg-base-200 md:static md:inset-auto md:z-auto md:h-full md:w-80 md:border-l md:border-base-300 md:bg-base-200/90 md:shadow-xl md:shrink-0">
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
              onBorrowed={handleBorrowed}
              borrowedCatId={borrowedCatId}
              onReturnCat={handleReturnCat}
            />
          </div>
        )}
      </div>

      <RunningCat />
      <FallingItems onItemCaught={refetchItems} />
    </LayoutBackground>
  );
}
