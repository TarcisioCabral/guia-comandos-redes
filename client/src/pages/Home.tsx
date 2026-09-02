import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { vendors, categories } from "@/lib/commands-data";
import CommandsTable from "@/features/commands/components/CommandsTable";
import { useCommandsFilter } from "@/features/commands/hooks/useCommandsFilter";
import { Search, X } from "lucide-react";
import MainLayout from "@/layouts/MainLayout";

export default function Home() {
  const heroBackgroundUrl = `${import.meta.env.BASE_URL}images/hero-background.jpg`;

  const {
    searchQuery,
    setSearchQuery,
    selectedVendors,
    toggleVendor,
    selectedCategories,
    toggleCategory,
    filteredCommands,
    clearFilters,
    hasActiveFilters,
    totalCommands,
  } = useCommandsFilter();

  return (
    <MainLayout>
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center py-16 md:py-24"
        style={{
          backgroundImage: `url(${heroBackgroundUrl})`,
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-white/90 dark:bg-black/80"></div>
        <div className="relative container max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Guia de Redes
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Seu manual de bolso técnico com comandos essenciais para Cisco,
            Huawei, Juniper, Datacom, ZTE e Nokia.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar comando, descrição ou categoria..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-3 text-base shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Vendor Filters */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
            Fabricantes
          </h2>
          <div className="flex flex-wrap gap-2">
            {vendors.map((vendor) => (
              <Button
                key={vendor}
                variant={
                  selectedVendors.includes(vendor) ? "default" : "outline"
                }
                size="sm"
                onClick={() => toggleVendor(vendor)}
                className="rounded-full"
              >
                {vendor}
              </Button>
            ))}
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
            Categorias
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={
                  selectedCategories.includes(category) ? "default" : "outline"
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
              {selectedVendors.map((vendor) => (
                <Badge key={vendor} variant="secondary">
                  {vendor}
                </Badge>
              ))}
              {selectedCategories.map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
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
            Mostrando <span className="font-semibold">{filteredCommands.length}</span> de{" "}
            <span className="font-semibold">{totalCommands}</span> comandos
          </p>
        </div>

        {/* Commands Table */}
        <CommandsTable
          commands={filteredCommands}
          onCopyCommand={(cmd) => {
            console.log("Comando copiado:", cmd);
          }}
        />
      </div>
    </MainLayout>
  );
}
