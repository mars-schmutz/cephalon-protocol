import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useResourcesStore } from "./resources";
import { formatNumber, formatTime } from "@/utils/format";

export interface ResourceCost {
  ferrite?: number;
  alloyPlate?: number;
  plastids?: number;
  neurodes?: number;
}

export interface FoundryItem {
  id: string;
  name: string;
  description: string;
  type: "warframe" | "weapon";
  rarity: "common" | "uncommon" | "rare" | "legendary";
  cost: ResourceCost;
  buildTime: number; // in seconds
  owned: number; // how many times built
  unlocked: boolean; // whether player has unlocked this blueprint
}

export interface BuildQueueItem {
  id: string;
  itemId: string;
  itemName: string;
  startTime: number;
  endTime: number;
}

export const useFoundryStore = defineStore("foundry", () => {
  // State
  const items = ref<FoundryItem[]>([
    // Warframes - All require similar total resources but with different distributions
    {
      id: "excalibur",
      name: "EXCALIBUR",
      description: "Balanced offensive Warframe with powerful exalted blade abilities",
      type: "warframe",
      rarity: "common", // Kept for potential future weapons, but not displayed for warframes
      cost: {
        ferrite: 180,
        alloyPlate: 80,
        plastids: 35,
        neurodes: 3,
      },
      buildTime: 60,
      owned: 0,
      unlocked: true,
    },
    {
      id: "mag",
      name: "MAG",
      description: "Magnetic force manipulator excelling at shield disruption",
      type: "warframe",
      rarity: "common",
      cost: {
        ferrite: 120,
        alloyPlate: 120,
        plastids: 40,
        neurodes: 3,
      },
      buildTime: 60,
      owned: 0,
      unlocked: true,
    },
    {
      id: "rhino",
      name: "RHINO",
      description: "Heavy assault Warframe with incredible durability and crowd control",
      type: "warframe",
      rarity: "common",
      cost: {
        ferrite: 80,
        alloyPlate: 180,
        plastids: 35,
        neurodes: 3,
      },
      buildTime: 60,
      owned: 0,
      unlocked: true,
    },
    {
      id: "trinity",
      name: "TRINITY",
      description: "Support Warframe specialized in healing and energy restoration",
      type: "warframe",
      rarity: "common",
      cost: {
        ferrite: 120,
        alloyPlate: 100,
        plastids: 50,
        neurodes: 3,
      },
      buildTime: 60,
      owned: 0,
      unlocked: true,
    },
    {
      id: "nova",
      name: "NOVA",
      description: "Antimatter specialist capable of devastating molecular manipulation",
      type: "warframe",
      rarity: "common",
      cost: {
        ferrite: 140,
        alloyPlate: 120,
        plastids: 30,
        neurodes: 4,
      },
      buildTime: 60,
      owned: 0,
      unlocked: true,
    },
    {
      id: "ash",
      name: "ASH",
      description: "Deadly ninja Warframe with lethal stealth capabilities",
      type: "warframe",
      rarity: "common",
      cost: {
        ferrite: 150,
        alloyPlate: 110,
        plastids: 40,
        neurodes: 3,
      },
      buildTime: 60,
      owned: 0,
      unlocked: false, // Locked initially
    },
  ]);

  const buildQueue = ref<BuildQueueItem[]>([]);
  let buildQueueIdCounter = 0;

  // Computed
  const totalFramesBuilt = computed(() => {
    return items.value
      .filter((item) => item.type === "warframe")
      .reduce((sum, item) => sum + item.owned, 0);
  });

  const availableItems = computed(() => {
    return items.value.filter((item) => item.unlocked);
  });

  const currentBuild = computed(() => {
    return buildQueue.value.length > 0 ? buildQueue.value[0] : null;
  });

  // Functions
  const canAffordItem = (item: FoundryItem): boolean => {
    const resourcesStore = useResourcesStore();

    if (item.cost.ferrite && resourcesStore.ferrite < item.cost.ferrite) return false;
    if (item.cost.alloyPlate && resourcesStore.alloyPlate < item.cost.alloyPlate) return false;
    if (item.cost.plastids && resourcesStore.plastids < item.cost.plastids) return false;
    if (item.cost.neurodes && resourcesStore.neurodes < item.cost.neurodes) return false;

    return true;
  };

  const canBuildItem = (item: FoundryItem): boolean => {
    // Can't build if already owned (warframes can only be built once)
    if (item.type === "warframe" && item.owned > 0) {
      return false;
    }

    // Can't build if can't afford
    if (!canAffordItem(item)) {
      return false;
    }

    // Can't build if already in build queue
    if (buildQueue.value.some((b) => b.itemId === item.id)) {
      return false;
    }

    return true;
  };

  const startBuild = (itemId: string): boolean => {
    const item = items.value.find((i) => i.id === itemId);
    if (!item || !canAffordItem(item)) return false;

    // Check if warframe is already owned (can only build once)
    if (item.type === "warframe" && item.owned > 0) {
      return false;
    }

    // Check if already building
    if (buildQueue.value.some((b) => b.itemId === itemId)) {
      return false;
    }

    const resourcesStore = useResourcesStore();

    // Deduct resources
    if (item.cost.ferrite) resourcesStore.ferrite -= item.cost.ferrite;
    if (item.cost.alloyPlate) resourcesStore.alloyPlate -= item.cost.alloyPlate;
    if (item.cost.plastids) resourcesStore.plastids -= item.cost.plastids;
    if (item.cost.neurodes) resourcesStore.neurodes -= item.cost.neurodes;

    resourcesStore.saveToLocalStorage();

    // Add to build queue
    const startTime = Date.now();
    const endTime = startTime + item.buildTime * 1000;

    buildQueue.value.push({
      id: `build-${buildQueueIdCounter++}`,
      itemId: item.id,
      itemName: item.name,
      startTime,
      endTime,
    });

    saveToLocalStorage();
    return true;
  };

  const rushBuild = (buildId: string): boolean => {
    const build = buildQueue.value.find((b) => b.id === buildId);
    if (!build) return false;

    // Complete the build immediately
    completeBuild(buildId);
    return true;
  };

  const completeBuild = (buildId: string) => {
    const build = buildQueue.value.find((b) => b.id === buildId);
    if (!build) return;

    const item = items.value.find((i) => i.id === build.itemId);
    if (item) {
      item.owned += 1;
    }

    // Remove from queue
    buildQueue.value = buildQueue.value.filter((b) => b.id !== buildId);
    saveToLocalStorage();
  };

  // Check build queue every second
  const checkBuildQueue = () => {
    const now = Date.now();
    const completedBuilds = buildQueue.value.filter((build) => build.endTime <= now);

    completedBuilds.forEach((build) => {
      completeBuild(build.id);
    });
  };

  const getBuildProgress = (build: BuildQueueItem): number => {
    const now = Date.now();
    const totalTime = build.endTime - build.startTime;
    const elapsed = now - build.startTime;
    return Math.min((elapsed / totalTime) * 100, 100);
  };

  const getBuildTimeRemaining = (build: BuildQueueItem): number => {
    const now = Date.now();
    const remaining = Math.max(build.endTime - now, 0);
    return Math.ceil(remaining / 1000); // Convert to seconds
  };

  // Persistence
  const saveToLocalStorage = () => {
    const saveData = {
      items: items.value.map((i) => ({ id: i.id, owned: i.owned, unlocked: i.unlocked })),
      buildQueue: buildQueue.value,
      lastSave: Date.now(),
    };
    localStorage.setItem("cephalon-foundry", JSON.stringify(saveData));
  };

  const loadFromLocalStorage = () => {
    const saveDataStr = localStorage.getItem("cephalon-foundry");
    if (!saveDataStr) return;

    try {
      const saveData = JSON.parse(saveDataStr);

      // Restore item owned counts and unlocked status
      saveData.items?.forEach((saved: { id: string; owned: number; unlocked: boolean }) => {
        const item = items.value.find((i) => i.id === saved.id);
        if (item) {
          item.owned = saved.owned;
          item.unlocked = saved.unlocked;
        }
      });

      // Restore build queue
      buildQueue.value = saveData.buildQueue || [];
    } catch (e) {
      console.error("Failed to load foundry save data:", e);
    }
  };

  const resetFoundry = () => {
    items.value.forEach((item) => {
      item.owned = 0;
      // Keep unlocked status as is or reset to initial state
    });
    buildQueue.value = [];
    localStorage.removeItem("cephalon-foundry");
  };

  // Initialize
  loadFromLocalStorage();

  // Start build queue checker
  setInterval(checkBuildQueue, 1000);

  return {
    // State
    items,
    buildQueue,
    // Computed
    totalFramesBuilt,
    availableItems,
    currentBuild,
    // Functions
    canAffordItem,
    canBuildItem,
    startBuild,
    rushBuild,
    completeBuild,
    getBuildProgress,
    getBuildTimeRemaining,
    formatTimeRemaining: formatTime,
    resetFoundry,
    formatNumber,
    saveToLocalStorage,
  };
});
