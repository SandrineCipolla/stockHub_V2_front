

import "./index.css"
import {Dashboard} from "@/pages/Dashboard.tsx";
import {ThemeProvider} from "@/hooks/useTheme.tsx";




function App() {
    return (
        <ThemeProvider>
                         <Dashboard />

        </ThemeProvider>
    );

}

export default App