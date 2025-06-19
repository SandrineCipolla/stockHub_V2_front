import "./index.css"
import {Dashboard} from "@/pages/Dashboard.tsx";
import {ThemeProvider} from "@/hooks/useTheme.tsx";

function App() {
    return (
        <ThemeProvider>
            {/* AJOUT OBLIGATOIRE pour RGAA : Skip link */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 z-50 bg-purple-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
            >
                Aller au contenu principal
            </a>

            <Dashboard />
        </ThemeProvider>
    );
}

export default App