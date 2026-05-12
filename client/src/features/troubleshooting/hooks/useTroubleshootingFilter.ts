import { useState, useMemo } from "react";
import { troubleshootingGuides } from "@/lib/troubleshooting-guides";

export function useTroubleshootingFilter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>([]);
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null);

  const filteredGuides = useMemo(() => {
    return troubleshootingGuides.filter((guide) => {
      const matchesSearch =
        searchQuery === "" ||
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.symptoms.some((s) =>
          s.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(guide.category);

      const matchesSeverity =
        selectedSeverities.length === 0 ||
        selectedSeverities.includes(guide.severity);

      return matchesSearch && matchesCategory && matchesSeverity;
    });
  }, [searchQuery, selectedCategories, selectedSeverities]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleSeverity = (severity: string) => {
    setSelectedSeverities((prev) =>
      prev.includes(severity)
        ? prev.filter((s) => s !== severity)
        : [...prev, severity]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedSeverities([]);
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCategories.length > 0 ||
    selectedSeverities.length > 0;

  const currentGuide = selectedGuideId
    ? troubleshootingGuides.find((g) => g.id === selectedGuideId)
    : null;

  return {
    searchQuery,
    setSearchQuery,
    selectedCategories,
    toggleCategory,
    selectedSeverities,
    toggleSeverity,
    filteredGuides,
    clearFilters,
    hasActiveFilters,
    selectedGuideId,
    setSelectedGuideId,
    currentGuide,
    totalGuides: troubleshootingGuides.length,
  };
}
