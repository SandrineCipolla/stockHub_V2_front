
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from "@/pages/Dashboard.tsx";
import { Analytics } from "@/pages/Analytics.tsx";
import { ThemeProvider } from "@/components/providers/ThemeProvider.tsx";
import "./styles/index.css"


function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                {/* AJOUT OBLIGATOIRE pour RGAA : Skip link */}
                <a
                    href="#main-content"
                    className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 z-50 bg-purple-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
                >
                    Aller au contenu principal
                </a>

                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App