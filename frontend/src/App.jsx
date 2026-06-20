import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext.jsx";
import { SelectedCatProvider } from "@/contexts/SelectedCatContext.jsx";
import { useServerWakeup } from "@/hooks/useServerWakeup.js";
import ServerWakeupPopup from "@/components/ServerWakeupPopup.jsx";

import RequireAuth from "@/routes/RequireAuth.jsx";

import HomePage from "@/pages/HomePage.jsx";
import CatBoxPage from "@/pages/CatBoxPage.jsx";
import CatDetailsPage from "@/pages/CatDetailsPage.jsx";
import LoginPage from "@/pages/LoginPage.jsx";
import SignupPage from "@/pages/SignupPage.jsx";
import OAuthCallbackPage from "@/pages/OAuthCallbackPage.jsx";
import ProfilePage from "@/pages/ProfilePage.jsx";

function AppShell() {
    const wakeupStatus = useServerWakeup();

    return (
        <>
            <ServerWakeupPopup status={wakeupStatus} />
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/oauth/callback" element={<OAuthCallbackPage />} />

                    <Route element={<RequireAuth />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/catbox" element={<CatBoxPage />} />
                        <Route path="/catbox/:id" element={<CatDetailsPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <SelectedCatProvider>
                <AppShell />
            </SelectedCatProvider>
        </AuthProvider>
    );
}
