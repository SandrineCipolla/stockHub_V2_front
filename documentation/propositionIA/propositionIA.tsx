import {useEffect, useState} from "react";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  ChevronRight,
  Download,
  Edit3,
  Eye,
  Home,
  Moon,
  Package,
  Plus,
  Search,
  Sun,
  Trash2,
  TrendingUp,
  User,
} from "lucide-react";

export const StockHubDesignSystemAligned = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Classes CSS basées sur le thème
  const themeClasses = {
    background: theme === "dark" ? "bg-slate-900" : "bg-gray-50",
    text: theme === "dark" ? "text-white" : "text-gray-900",
    textMuted: theme === "dark" ? "text-gray-300" : "text-gray-600",
    textSubtle: theme === "dark" ? "text-gray-400" : "text-gray-500",
    card:
      theme === "dark"
        ? "bg-white/5 border-white/10"
        : "bg-white/80 border-gray-200 shadow-sm",
    cardHover:
      theme === "dark"
        ? "hover:bg-white/10 hover:border-purple-500/30"
        : "hover:bg-white hover:border-purple-300 hover:shadow-md",
    header:
      theme === "dark"
        ? "bg-slate-900/90 border-white/10"
        : "bg-white/95 border-gray-200",
    input:
      theme === "dark"
        ? "bg-white/10 border-white/20 text-white placeholder-gray-400"
        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500",
    navSection:
      theme === "dark"
        ? "bg-gradient-to-r from-purple-900/30 to-purple-800/20"
        : "bg-gradient-to-r from-purple-100/80 to-purple-50",
    footer:
      theme === "dark"
        ? "border-white/10 bg-slate-900/50"
        : "border-gray-200 bg-gray-50/80",
  };

  const stockData = [
    {
      id: 1,
      name: "MyFirstStock",
      quantity: 156,
      value: 2450,
      status: "optimal",
      lastUpdate: "2h",
    },
    {
      id: 2,
      name: "MonTest",
      quantity: 89,
      value: 1780,
      status: "optimal",
      lastUpdate: "1h",
    },
    {
      id: 3,
      name: "StockVide",
      quantity: 3,
      value: 150,
      status: "low",
      lastUpdate: "30min",
    },
    {
      id: 4,
      name: "Stock Critique",
      quantity: 0,
      value: 0,
      status: "critical",
      lastUpdate: "5min",
    },
  ];

  // Composants avec thèmes accessibles
  type ButtonProps = {
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
    children?: React.ReactNode;
    icon?: React.ElementType;
    className?: string;
    [key: string]: unknown;
  };
  const Button = ({
    variant = "primary",
    size = "md",
    children,
    icon: Icon,
    className = "",
    ...props
  }: ButtonProps) => {
    const baseClasses =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2";

    const variants: { primary: string; secondary: string; ghost: string } = {
      primary:
        "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg",
      secondary:
        theme === "dark"
          ? "bg-white/10 hover:bg-white/20 text-white border border-white/20"
          : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300",
      ghost:
        theme === "dark"
          ? "bg-transparent hover:bg-white/10 text-gray-300 hover:text-white"
          : "bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-900",
    };

    const sizes: { sm: string; md: string; lg: string } = {
      sm: "px-3 py-1.5 text-sm rounded-lg gap-1.5",
      md: "px-4 py-2 text-sm rounded-lg gap-2",
      lg: "px-6 py-3 text-base rounded-xl gap-2",
    };

    return (
      <button
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {Icon && <Icon className="w-4 h-4" />}
        {children}
      </button>
    );
  };

  type CardProps = {
    children?: React.ReactNode;
    hover?: boolean;
    className?: string;
  };
  const Card = ({ children, hover = true, className = "" }: CardProps) => (
    <div
      className={`
      ${themeClasses.card} backdrop-blur-sm border rounded-xl p-6
      transition-all duration-300
      ${hover ? `${themeClasses.cardHover} hover:-translate-y-1` : ""}
      ${className}
    `}
    >
      {children}
    </div>
  );

  type BadgeProps = {
    variant: "success" | "warning" | "danger";
    children?: React.ReactNode;
  };
  const Badge = ({ variant, children }: BadgeProps) => {
    const variants: { success: string; warning: string; danger: string } = {
      success:
        theme === "dark"
          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
          : "bg-emerald-100 text-emerald-700 border-emerald-300",
      warning:
        theme === "dark"
          ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
          : "bg-amber-100 text-amber-700 border-amber-300",
      danger:
        theme === "dark"
          ? "bg-red-500/20 text-red-400 border-red-500/30"
          : "bg-red-100 text-red-700 border-red-300",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${variants[variant]}`}
      >
        {children}
      </span>
    );
  };

  type StockStatus = "optimal" | "low" | "critical";
  const getStatusBadge = (status: StockStatus) => {
    const statusMap: { [K in StockStatus]: { variant: "success" | "warning" | "danger"; label: string } } = {
      optimal: { variant: "success", label: "Optimal" },
      low: { variant: "warning", label: "Faible" },
      critical: { variant: "danger", label: "Critique" },
    };
    const { variant, label } = statusMap[status];
    return (
      <Badge variant={variant}>{label}</Badge>
    );
  };

  const getIconBackground = (type: "success" | "warning" | "info") => {
    const backgrounds: { success: string; warning: string; info: string } = {
      success: theme === "dark" ? "bg-emerald-500/20" : "bg-emerald-100",
      warning: theme === "dark" ? "bg-amber-500/20" : "bg-amber-100",
      info: theme === "dark" ? "bg-blue-500/20" : "bg-blue-100",
    };
    return backgrounds[type];
  };

  const getIconColor = (type: "success" | "warning" | "info") => {
    const colors: { success: string; warning: string; info: string } = {
      success: theme === "dark" ? "text-emerald-400" : "text-emerald-600",
      warning: theme === "dark" ? "text-amber-400" : "text-amber-600",
      info: theme === "dark" ? "text-blue-400" : "text-blue-600",
    };
    return colors[type];
  };

  return (
    <div
      className={`min-h-screen ${themeClasses.background} ${themeClasses.text}`}
    >
      {/* Header avec couleurs ton HTML */}
      <header
        className={`sticky top-0 z-50 ${themeClasses.header} backdrop-blur-xl border-b`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo avec couleurs de ton HTML */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                SH
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
                StockHub
              </h1>
            </div>

            {/* Actions utilisateur */}
            <div className="flex items-center gap-4">
              <button
                className={`relative p-2 rounded-lg transition-colors ${
                  theme === "dark" ? "hover:bg-white/10" : "hover:bg-gray-100"
                }`}
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`p-2 rounded-lg transition-colors ${
                  theme === "dark" ? "hover:bg-white/10" : "hover:bg-gray-100"
                }`}
                aria-label="Changer le thème"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              <div className="flex items-center gap-3">
                <span className={`text-sm ${themeClasses.textMuted}`}>
                  Sandrine Cipolla
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  icon={User}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Section avec couleurs de ton HTML */}
      <section className={themeClasses.navSection}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 text-sm mb-6"
            aria-label="Fil d'Ariane"
          >
            <Home className="w-4 h-4" />
            <ChevronRight className="w-4 h-4 opacity-50" />
            <span className="font-medium">Dashboard</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Tableau de Bord</h1>
              <p className={themeClasses.textMuted}>
                Bienvenue dans votre espace de gestion de stocks intelligent
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="primary" icon={Plus}>
                Ajouter un Stock
              </Button>
              <Button variant="secondary" icon={BarChart3}>
                Rapport Détaillé
              </Button>
              <Button variant="secondary" icon={Search}>
                Recherche Avancée
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Métriques principales avec couleurs ton HTML */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${getIconBackground("success")}`}>
                <Package className={`w-6 h-6 ${getIconColor("success")}`} />
              </div>
              <span
                className={`text-sm flex items-center gap-1 ${getIconColor(
                  "success"
                )}`}
              >
                <TrendingUp className="w-3 h-3" />
                +8
              </span>
            </div>
            <div className="text-3xl font-bold mb-1">248</div>
            <div className={`text-sm ${themeClasses.textSubtle}`}>
              Total Produits
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${getIconBackground("warning")}`}>
                <AlertTriangle
                  className={`w-6 h-6 ${getIconColor("warning")}`}
                />
              </div>
              <span
                className={`text-sm flex items-center gap-1 ${
                  theme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
                <TrendingUp className="w-3 h-3 rotate-180" />
                -3
              </span>
            </div>
            <div className="text-3xl font-bold mb-1">12</div>
            <div className={`text-sm ${themeClasses.textSubtle}`}>
              Stock Faible
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${getIconBackground("info")}`}>
                <TrendingUp className={`w-6 h-6 ${getIconColor("info")}`} />
              </div>
              <span
                className={`text-sm flex items-center gap-1 ${getIconColor(
                  "success"
                )}`}
              >
                <TrendingUp className="w-3 h-3" />
                +2%
              </span>
            </div>
            <div className="text-3xl font-bold mb-1">+15%</div>
            <div className={`text-sm ${themeClasses.textSubtle}`}>Ce mois</div>
          </Card>
        </section>

        {/* Recherche */}
        <section className="mb-8">
          <div className="relative max-w-md">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${themeClasses.textSubtle}`}
            />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 ${themeClasses.input} rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
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
          {stockData.map((item, index) => (
            <div
              key={item.id}
              className={`transform transition-all duration-500 ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <Card className="">
                {/* Indicateur de statut - barre simple */}
                <div
                  className={`absolute top-0 left-6 w-12 h-1 rounded-b-full ${
                    item.status === "optimal"
                      ? "bg-emerald-400"
                      : item.status === "low"
                      ? "bg-amber-400"
                      : "bg-red-400"
                  }`}
                ></div>

                {/* Header avec nom et statut */}
                <div className="flex items-start justify-between mb-4 pt-2">
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className={`text-sm ${themeClasses.textSubtle}`}>
                      Mis à jour il y a {item.lastUpdate}
                    </p>
                  </div>
                  {(["optimal", "low", "critical"].includes(item.status) ? getStatusBadge(item.status as StockStatus) : null)}
                </div>

                {/* Métriques */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{item.quantity}</div>
                    <div
                      className={`text-xs uppercase tracking-wide ${themeClasses.textSubtle}`}
                    >
                      Quantité
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      €{item.value.toLocaleString()}
                    </div>
                    <div
                      className={`text-xs uppercase tracking-wide ${themeClasses.textSubtle}`}
                    >
                      Valeur
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    icon={Eye}
                    aria-label={`Voir les détails de ${item.name}`}
                  >
                    Détails
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Edit3}
                    aria-label={`Modifier ${item.name}`}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className={
                      theme === "dark"
                        ? "text-red-400 hover:text-red-300 hover:bg-red-500/20"
                        : "text-red-600 hover:text-red-700 hover:bg-red-100"
                    }
                    icon={Trash2}
                    aria-label={`Supprimer ${item.name}`}
                  />
                </div>
              </Card>
            </div>
          ))}
        </section>
      </main>


      {/* Footer accessible */}
      <footer className={`mt-16 border-t py-8 ${themeClasses.footer}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <p className={`text-sm mb-4 ${themeClasses.textSubtle}`}>
              STOCK HUB - ALL RIGHTS RESERVED ©
            </p>
            <nav className="flex flex-wrap justify-center gap-6 text-sm">
              <a
                  href="#"
                  className={`${themeClasses.textSubtle} hover:text-purple-500 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 rounded`}
              >
                Mentions Légales
              </a>
              <a
                  href="#"
                  className={`${themeClasses.textSubtle} hover:text-purple-500 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 rounded`}
              >
                Politique de Confidentialité
              </a>
              <a
                  href="#"
                  className={`${themeClasses.textSubtle} hover:text-purple-500 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 rounded`}
              >
                CGU
              </a>
              <a
                  href="#"
                  className={`${themeClasses.textSubtle} hover:text-purple-500 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 rounded`}
              >
                Politique de Cookies
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>

  )};
