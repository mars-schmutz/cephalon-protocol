import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useCreditsStore } from "./credits";
import { formatNumber } from "@/utils/format";

export interface ResourceExtractor {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  costMultiplier: number;
  level: number;
  baseProduction: number; // Resources per second at level 1
  rarity: "common" | "uncommon" | "rare";
}

export const useResourcesStore = defineStore("resources", () => {
  // State - Resource amounts
  const ferrite = ref(0);
  const alloyPlate = ref(0);
  const plastids = ref(0);
  const neurodes = ref(0);

  // Total resources generated (for stats)
  const totalFerriteEarned = ref(0);
  const totalAlloyPlateEarned = ref(0);
  const totalPlastidsEarned = ref(0);
  const totalNeurodesEarned = ref(0);

  // Extractors (upgradeable generators)
  const extractors = ref<ResourceExtractor[]>([
    {
      id: "ferrite-extractor",
      name: "Ferrite Extractor",
      description: "Extracts Ferrite from planetary deposits",
      baseCost: 500,
      costMultiplier: 1.25,
      level: 0,
      baseProduction: 1,
      rarity: "common",
    },
    {
      id: "alloy-extractor",
      name: "Alloy Plate Extractor",
      description: "Processes raw ore into Alloy Plates",
      baseCost: 2000,
      costMultiplier: 1.3,
      level: 0,
      baseProduction: 0.5,
      rarity: "common",
    },
    {
      id: "plastids-extractor",
      name: "Plastids Extractor",
      description: "Harvests organic Plastids compounds",
      baseCost: 10000,
      costMultiplier: 1.35,
      level: 0,
      baseProduction: 0.2,
      rarity: "uncommon",
    },
    {
      id: "neurodes-extractor",
      name: "Neurodes Extractor",
      description: "Recovers rare Neurodes from neural clusters",
      baseCost: 50000,
      costMultiplier: 1.4,
      level: 0,
      baseProduction: 0.05,
      rarity: "rare",
    },
  ]);

  // Computed - Resources per second
  const ferritePerSecond = computed(() => {
    const extractor = extractors.value.find((e) => e.id === "ferrite-extractor");
    return extractor && extractor.level > 0
      ? extractor.level * extractor.baseProduction
      : 0;
  });

  const alloyPlatePerSecond = computed(() => {
    const extractor = extractors.value.find((e) => e.id === "alloy-extractor");
    return extractor && extractor.level > 0
      ? extractor.level * extractor.baseProduction
      : 0;
  });

  const plastidsPerSecond = computed(() => {
    const extractor = extractors.value.find((e) => e.id === "plastids-extractor");
    return extractor && extractor.level > 0
      ? extractor.level * extractor.baseProduction
      : 0;
  });

  const neurodesPerSecond = computed(() => {
    const extractor = extractors.value.find((e) => e.id === "neurodes-extractor");
    return extractor && extractor.level > 0
      ? extractor.level * extractor.baseProduction
      : 0;
  });

  // Functions
  const getExtractorCost = (extractor: ResourceExtractor): number => {
    return Math.floor(
      extractor.baseCost * Math.pow(extractor.costMultiplier, extractor.level)
    );
  };

  const canAffordExtractor = (extractor: ResourceExtractor): boolean => {
    const creditsStore = useCreditsStore();
    return creditsStore.credits >= getExtractorCost(extractor);
  };

  const buyExtractor = (extractorId: string): boolean => {
    const extractor = extractors.value.find((e) => e.id === extractorId);
    if (!extractor) return false;

    const creditsStore = useCreditsStore();
    const cost = getExtractorCost(extractor);

    if (creditsStore.credits >= cost) {
      creditsStore.credits -= cost;
      creditsStore.saveToLocalStorage();
      extractor.level += 1;
      saveToLocalStorage();
      return true;
    }
    return false;
  };

  // Idle generation tick (call this every second)
  const tick = () => {
    const ferriteEarned = ferritePerSecond.value;
    const alloyEarned = alloyPlatePerSecond.value;
    const plastidsEarned = plastidsPerSecond.value;
    const neurodesEarned = neurodesPerSecond.value;

    if (ferriteEarned > 0) {
      ferrite.value += ferriteEarned;
      totalFerriteEarned.value += ferriteEarned;
    }
    if (alloyEarned > 0) {
      alloyPlate.value += alloyEarned;
      totalAlloyPlateEarned.value += alloyEarned;
    }
    if (plastidsEarned > 0) {
      plastids.value += plastidsEarned;
      totalPlastidsEarned.value += plastidsEarned;
    }
    if (neurodesEarned > 0) {
      neurodes.value += neurodesEarned;
      totalNeurodesEarned.value += neurodesEarned;
    }

    if (ferriteEarned > 0 || alloyEarned > 0 || plastidsEarned > 0 || neurodesEarned > 0) {
      saveToLocalStorage();
    }
  };

  // Persistence
  const saveToLocalStorage = () => {
    const saveData = {
      ferrite: ferrite.value,
      alloyPlate: alloyPlate.value,
      plastids: plastids.value,
      neurodes: neurodes.value,
      totalFerriteEarned: totalFerriteEarned.value,
      totalAlloyPlateEarned: totalAlloyPlateEarned.value,
      totalPlastidsEarned: totalPlastidsEarned.value,
      totalNeurodesEarned: totalNeurodesEarned.value,
      extractors: extractors.value.map((e) => ({ id: e.id, level: e.level })),
      lastSave: Date.now(),
    };
    localStorage.setItem("cephalon-resources", JSON.stringify(saveData));
  };

  const loadFromLocalStorage = () => {
    const saveDataStr = localStorage.getItem("cephalon-resources");
    if (!saveDataStr) return;

    try {
      const saveData = JSON.parse(saveDataStr);
      ferrite.value = saveData.ferrite || 0;
      alloyPlate.value = saveData.alloyPlate || 0;
      plastids.value = saveData.plastids || 0;
      neurodes.value = saveData.neurodes || 0;

      totalFerriteEarned.value = saveData.totalFerriteEarned || 0;
      totalAlloyPlateEarned.value = saveData.totalAlloyPlateEarned || 0;
      totalPlastidsEarned.value = saveData.totalPlastidsEarned || 0;
      totalNeurodesEarned.value = saveData.totalNeurodesEarned || 0;

      // Restore extractor levels
      saveData.extractors?.forEach((saved: { id: string; level: number }) => {
        const extractor = extractors.value.find((e) => e.id === saved.id);
        if (extractor) {
          extractor.level = saved.level;
        }
      });

      // Calculate offline earnings (1 hour max)
      if (saveData.lastSave) {
        const offlineTime = Math.min(
          (Date.now() - saveData.lastSave) / 1000,
          3600
        ); // Max 1 hour

        const offlineFerriteEarned = Math.floor(ferritePerSecond.value * offlineTime);
        const offlineAlloyEarned = Math.floor(alloyPlatePerSecond.value * offlineTime);
        const offlinePlastidsEarned = Math.floor(plastidsPerSecond.value * offlineTime);
        const offlineNeurodesEarned = Math.floor(neurodesPerSecond.value * offlineTime);

        if (offlineFerriteEarned > 0) {
          ferrite.value += offlineFerriteEarned;
          totalFerriteEarned.value += offlineFerriteEarned;
        }
        if (offlineAlloyEarned > 0) {
          alloyPlate.value += offlineAlloyEarned;
          totalAlloyPlateEarned.value += offlineAlloyEarned;
        }
        if (offlinePlastidsEarned > 0) {
          plastids.value += offlinePlastidsEarned;
          totalPlastidsEarned.value += offlinePlastidsEarned;
        }
        if (offlineNeurodesEarned > 0) {
          neurodes.value += offlineNeurodesEarned;
          totalNeurodesEarned.value += offlineNeurodesEarned;
        }

        console.log("Offline resource earnings:", {
          ferrite: offlineFerriteEarned,
          alloyPlate: offlineAlloyEarned,
          plastids: offlinePlastidsEarned,
          neurodes: offlineNeurodesEarned,
        });
      }
    } catch (e) {
      console.error("Failed to load resources save data:", e);
    }
  };

  const resetResources = () => {
    ferrite.value = 0;
    alloyPlate.value = 0;
    plastids.value = 0;
    neurodes.value = 0;
    totalFerriteEarned.value = 0;
    totalAlloyPlateEarned.value = 0;
    totalPlastidsEarned.value = 0;
    totalNeurodesEarned.value = 0;
    extractors.value.forEach((e) => (e.level = 0));
    localStorage.removeItem("cephalon-resources");
  };

  // Initialize
  loadFromLocalStorage();

  // Start idle tick
  setInterval(tick, 1000);

  return {
    // State
    ferrite,
    alloyPlate,
    plastids,
    neurodes,
    totalFerriteEarned,
    totalAlloyPlateEarned,
    totalPlastidsEarned,
    totalNeurodesEarned,
    extractors,
    // Computed
    ferritePerSecond,
    alloyPlatePerSecond,
    plastidsPerSecond,
    neurodesPerSecond,
    // Functions
    buyExtractor,
    getExtractorCost,
    canAffordExtractor,
    tick,
    resetResources,
    formatNumber,
    saveToLocalStorage,
  };
});
