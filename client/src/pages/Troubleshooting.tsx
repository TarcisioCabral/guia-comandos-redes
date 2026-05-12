import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { troubleshootingCategories } from "@/lib/troubleshooting-guides";
import TroubleshootingCard from "@/features/troubleshooting/components/TroubleshootingCard";
import TroubleshootingDetail from "@/features/troubleshooting/components/TroubleshootingDetail";
import { useTroubleshootingFilter } from "@/features/troubleshooting/hooks/useTroubleshootingFilter";
import { Search, X } from "lucide-react";
import MainLayout from "@/layouts/MainLayout";

export default function Troubleshooting() {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategories,
    toggleCategory,
    selectedSeverities,
    toggleSeverity,
    filteredGuides,
    clearFilters,
    hasActiveFilters,
    setSelectedGuideId,
    currentGuide,
    totalGuides,
  } = useTroubleshootingFilter();

  if (currentGuide) {
    return (
      <MainLayout>
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <TroubleshootingDetail
            guide={currentGuide}
            onBack={() => setSelectedGuideId(null)}
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Header Section */}
      <div className="bg-secondary border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Solução de Problemas por Tarcisio Cabral
          </h1>
          <p className="text-lg text-muted-foreground">
            Guias passo a passo para resolver os problemas mais frequentes em
            redes.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por problema, sintoma ou solução..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-3 text-base shadow-sm"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-6">
          {/* Category Filters */}
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
              Categorias
            </h2>
            <div className="flex flex-wrap gap-2">
              {troubleshootingCategories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategories.includes(category)
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => toggleCategory(category)}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Severity Filters */}
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
              Severidade
            </h2>
            <div className="flex flex-wrap gap-2">
              {["low", "medium", "high"].map((severity) => (
                <Button
                  key={severity}
                  variant={
                    selectedSeverities.includes(severity)
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => toggleSeverity(severity)}
                  className="rounded-full"
                >
                  {severity === "low"
                    ? "Baixa"
                    : severity === "medium"
                      ? "Média"
                      : "Alta"}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mb-8 p-4 bg-secondary rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-foreground">
                Filtros ativos:
              </span>
              {searchQuery && (
                <Badge variant="secondary">Busca: "{searchQuery}"</Badge>
              )}
              {selectedCategories.map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
              {selectedSeverities.map((severity) => (
                <Badge key={severity} variant="secondary">
                  {severity === "low"
                    ? "Baixa"
                    : severity === "medium"
                      ? "Média"
                      : "Alta"}
                </Badge>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="flex-shrink-0"
            >
              <X className="w-4 h-4 mr-1" />
              Limpar
            </Button>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Mostrando{" "}
            <span className="font-semibold">{filteredGuides.length}</span> de{" "}
            <span className="font-semibold">{totalGuides}</span>{" "}
            guias
          </p>
        </div>

        {/* Guides Grid */}
        {filteredGuides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGuides.map((guide) => (
              <TroubleshootingCard
                key={guide.id}
                guide={guide}
                onClick={() => setSelectedGuideId(guide.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Nenhum guia encontrado. Tente outra busca ou filtro.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
