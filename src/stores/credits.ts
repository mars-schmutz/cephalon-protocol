import { ref, computed, onMounted } from "vue";
import { defineStore } from "pinia";

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  costMultiplier: number;
  level: number;
  effect: number; // Credits per click or credits per second
  type: "click" | "idle";
}

export const useCreditsStore = defineStore("credits", () => {
  // State
  const credits = ref(0);
  const totalCreditsEarned = ref(0);
  const lifetimeClicks = ref(0);

  // Upgrades
  const upgrades = ref<Upgrade[]>([
    {
      id: "nav-data",
      name: "Nav Data Fragments",
      description: "Sell navigation data for credits",
      baseCost: 15,
      costMultiplier: 1.15,
      level: 0,
      effect: 1,
      type: "click",
    },
    {
      id: "ordis-subroutine",
      name: "Ordis Subroutine",
      description: "Your ship's Cephalon generates passive credits",
      baseCost: 100,
      costMultiplier: 1.2,
      level: 0,
      effect: 1,
      type: "idle",
    },
    {
      id: "cephalon-fragment",
      name: "Cephalon Fragment",
      description: "Ancient data caches generate steady income",
      baseCost: 500,
      costMultiplier: 1.25,
      level: 0,
      effect: 5,
      type: "idle",
    },
    {
      id: "simaris-standing",
      name: "Simaris Standing",
      description: "Sanctuary data farming provides substantial credits",
      baseCost: 2500,
      costMultiplier: 1.3,
      level: 0,
      effect: 25,
      type: "idle",
    },
    {
      id: "index-broker",
      name: "Index Broker",
      description: "Automated Index betting generates massive returns",
      baseCost: 15000,
      costMultiplier: 1.35,
      level: 0,
      effect: 100,
      type: "idle",
    },
  ]);

  // Computed
  const creditsPerClick = computed(() => {
    let total = 1; // Base click value
    upgrades.value
      .filter((u) => u.type === "click")
      .forEach((u) => {
        total += u.level * u.effect;
      });
    return total;
  });

  const creditsPerSecond = computed(() => {
    let total = 0;
    upgrades.value
      .filter((u) => u.type === "idle")
      .forEach((u) => {
        total += u.level * u.effect;
      });
    return total;
  });

  // Functions
  const getUpgradeCost = (upgrade: Upgrade): number => {
    return Math.floor(
      upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level)
    );
  };

  const canAffordUpgrade = (upgrade: Upgrade): boolean => {
    return credits.value >= getUpgradeCost(upgrade);
  };

  const click = () => {
    const earned = creditsPerClick.value;
    credits.value += earned;
    totalCreditsEarned.value += earned;
    lifetimeClicks.value += 1;
    saveToLocalStorage();
    return earned;
  };

  const buyUpgrade = (upgradeId: string): boolean => {
    const upgrade = upgrades.value.find((u) => u.id === upgradeId);
    if (!upgrade) return false;

    const cost = getUpgradeCost(upgrade);
    if (credits.value >= cost) {
      credits.value -= cost;
      upgrade.level += 1;
      saveToLocalStorage();
      return true;
    }
    return false;
  };

  // Idle generation tick (call this every second)
  const tick = () => {
    const earned = creditsPerSecond.value;
    if (earned > 0) {
      credits.value += earned;
      totalCreditsEarned.value += earned;
      saveToLocalStorage();
    }
  };

  // Persistence
  const saveToLocalStorage = () => {
    const saveData = {
      credits: credits.value,
      totalCreditsEarned: totalCreditsEarned.value,
      lifetimeClicks: lifetimeClicks.value,
      upgrades: upgrades.value.map((u) => ({ id: u.id, level: u.level })),
      lastSave: Date.now(),
    };
    localStorage.setItem("cephalon-save", JSON.stringify(saveData));
  };

  const loadFromLocalStorage = () => {
    const saveDataStr = localStorage.getItem("cephalon-save");
    if (!saveDataStr) return;

    try {
      const saveData = JSON.parse(saveDataStr);
      credits.value = saveData.credits || 0;
      totalCreditsEarned.value = saveData.totalCreditsEarned || 0;
      lifetimeClicks.value = saveData.lifetimeClicks || 0;

      // Restore upgrade levels
      saveData.upgrades?.forEach((saved: { id: string; level: number }) => {
        const upgrade = upgrades.value.find((u) => u.id === saved.id);
        if (upgrade) {
          upgrade.level = saved.level;
        }
      });

      // Calculate offline earnings (1 hour max)
      if (saveData.lastSave) {
        const offlineTime = Math.min(
          (Date.now() - saveData.lastSave) / 1000,
          3600
        ); // Max 1 hour
        const offlineEarnings = Math.floor(
          creditsPerSecond.value * offlineTime
        );
        if (offlineEarnings > 0) {
          credits.value += offlineEarnings;
          totalCreditsEarned.value += offlineEarnings;
          console.log(`Earned ${offlineEarnings} credits while offline!`);
        }
      }
    } catch (e) {
      console.error("Failed to load save data:", e);
    }
  };

  const resetGame = () => {
    credits.value = 0;
    totalCreditsEarned.value = 0;
    lifetimeClicks.value = 0;
    upgrades.value.forEach((u) => (u.level = 0));
    localStorage.removeItem("cephalon-save");
  };

  const formatNumber = (num: number): string => {
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(2) + "B";
    }
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(2) + "M";
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(2) + "K";
    }
    return Math.floor(num).toString();
  };

  // Initialize
  loadFromLocalStorage();

  // Start idle tick
  setInterval(tick, 1000);

  return {
    // State
    credits,
    totalCreditsEarned,
    lifetimeClicks,
    upgrades,
    // Computed
    creditsPerClick,
    creditsPerSecond,
    // Functions
    click,
    buyUpgrade,
    getUpgradeCost,
    canAffordUpgrade,
    tick,
    resetGame,
    formatNumber,
    saveToLocalStorage,
  };
});
