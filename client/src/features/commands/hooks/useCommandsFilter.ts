import { useState, useMemo } from "react";
import { Command } from "@/types";
import { commandsData } from "@/lib/commands-data";

export function useCommandsFilter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const filteredCommands = useMemo(() => {
    return commandsData.filter((cmd) => {
      const matchesSearch =
        searchQuery === "" ||
        cmd.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cmd.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cmd.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesVendor =
        selectedVendors.length === 0 || selectedVendors.includes(cmd.vendor);

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(cmd.category);

      return matchesSearch && matchesVendor && matchesCategory;
    });
  }, [searchQuery, selectedVendors, selectedCategories]);

  const toggleVendor = (vendor: string) => {
    setSelectedVendors((prev) =>
      prev.includes(vendor)
        ? prev.filter((v) => v !== vendor)
        : [...prev, vendor]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedVendors([]);
    setSelectedCategories([]);
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedVendors.length > 0 ||
    selectedCategories.length > 0;

  return {
    searchQuery,
    setSearchQuery,
    selectedVendors,
    toggleVendor,
    selectedCategories,
    toggleCategory,
    filteredCommands,
    clearFilters,
    hasActiveFilters,
    totalCommands: commandsData.length,
  };
}
