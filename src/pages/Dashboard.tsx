import React, { useState, useEffect } from 'react';
import { Search, Download } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import NavSection from '../components/layout/NavSection';
import MetricCard from '../components/dashboard/MetricCard';
import StockCard from '../components/dashboard/StockCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { stockData, metricsData } from '../data/stockData';

const Dashboard: React.FC = () => {
    const { themeClasses } = useTheme();
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);

    // Simuler un chargement
    useEffect(() => {
        setIsLoaded(true);
    }, []);

    // Filtrer les stocks en fonction du terme de recherche
    const filteredStocks = stockData.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`min-h-screen ${themeClasses.background} ${themeClasses.text}`}>
            <Header />
            <NavSection />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Métriques principales */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {metricsData.map((metric) => (
                        <MetricCard
                            key={metric.id}
                            title={metric.title}
                            value={metric.value}
                            change={metric.change}
                            isPositive={metric.isPositive}
                            iconType={metric.iconType}
                            icon={
                                // Importation dynamique des icônes
                                (() => {
                                    const lucideIcons = require('lucide-react');
                                    return lucideIcons[metric.icon];
                                })()
                            }
                        />
                    ))}
                </section>

                {/* Recherche */}
                <section className="mb-8">
                    <div className="relative max-w-md">
                        <Input
                            type="text"
                            placeholder="Rechercher un produit..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            icon={Search}
                        />
                    </div>
                </section>

                {/* Section titre stocks */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Mes Stocks Récents</h2>
                    <Button variant="ghost" icon={Download}>
                        Exporter
                    </Button>
                </div>

                {/* Grid des stocks */}
                <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredStocks.map((item, index) => (
                        <StockCard
                            key={item.id}
                            stock={item}
                            index={index}
                            isLoaded={isLoaded}
                        />
                    ))}
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Dashboard;