import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LayoutBackground from "@/components/Layouts/LayoutBackground.jsx";
import ThemePicker from "@/components/ThemePicker/ThemePicker.jsx";
import RunningCat from "@/components/RunningCat.jsx";
import FallingItems from "@/components/FallingItems.jsx";
import ChatInterface from "@/components/ChatInterface/ChatInterface.jsx";
import CatBoxButton from "@/components/NavButtons/CatBoxButton.jsx";
import InventoryButton from "@/components/NavButtons/InventoryButton.jsx";
import InventoryDrawer from "@/components/Inventory/InventoryDrawer.jsx";
import StatusPanel from "@/components/Status/StatusPanel.jsx";
import { useSelectedCat } from "@/contexts/SelectedCatContext.jsx";
import { useCat } from "@/hooks/useCat.js";
import { useInventory } from "@/hooks/useInventory.js";
import { useHungerDecay } from "@/hooks/useHungerDecay.js";
import { useAuth } from "@/hooks/useAuth.js";

export default function HomePage() {
    const [inventoryOpen, setInventoryOpen] = useState(false);
    const { selectedCatId } = useSelectedCat();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const username = user?.username ?? "";

    const {
        cat,
        loading: catLoading,
        error: catError,
        refetch: refetchCat,
        updateCatSilently,
    } = useCat(selectedCatId);

    const {
        items,
        loading: invLoading,
        error: invError,
        usingId,
        useItem,
        reload: reloadInventory,
    } = useInventory(selectedCatId, { onCatUpdated: updateCatSilently });

    useHungerDecay(selectedCatId, { onCatUpdated: updateCatSilently });

    function handleLogout() {
        logout();
        navigate("/login", { replace: true });
    }

    return (
        <LayoutBackground variant="warm">
            <div className="h-screen flex">
                {inventoryOpen && (
                    <div className="h-full w-72 sm:w-80 md:w-96 border-r border-base-300 bg-base-200/90 shadow-xl">
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

                <div className="flex-1 relative">
                    <div className="absolute top-3 left-3 z-1000">
                        <StatusPanel cat={cat} loading={catLoading} error={catError} />
                    </div>

                    <div className="absolute top-3 right-3 z-1000 flex items-center gap-2">
                        {username && (
                            <span id="home-username-display" className="text-xs sm:text-sm opacity-80">
                Logged in as{" "}
                                <span className="font-semibold">{username}</span>
              </span>
                        )}

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

                    <div className="absolute bottom-3 left-3 z-1000">
                        <InventoryButton
                            open={inventoryOpen}
                            onToggle={() => setInventoryOpen((o) => !o)}
                        />
                    </div>

                    <div className="absolute bottom-3 right-3 z-1000">
                        <CatBoxButton />
                    </div>

                    <div className="h-full">
                        <ChatInterface
                            cat={cat}
                            loading={catLoading}
                            error={catError}
                            refetchCat={refetchCat}
                        />
                    </div>
                </div>
            </div>

            <RunningCat />
            <FallingItems
                reloadInventory={() => reloadInventory({ background: true })}
            />
        </LayoutBackground>
    );
}
