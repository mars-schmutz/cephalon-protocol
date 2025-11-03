<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useFoundryStore } from "@/stores/foundry";
import { useResourcesStore } from "@/stores/resources";
import type { FoundryItem } from "@/stores/foundry";
import gsap from "gsap";

const foundryStore = useFoundryStore();
const resourcesStore = useResourcesStore();

const itemRefs = ref<(HTMLElement | null)[]>([]);

// Update build progress display every 100ms
const buildProgressTick = ref(0);
setInterval(() => {
  buildProgressTick.value++;
}, 100);

const currentBuildProgress = computed(() => {
  buildProgressTick.value; // Force reactivity
  if (!foundryStore.currentBuild) return 0;
  return foundryStore.getBuildProgress(foundryStore.currentBuild);
});

const currentBuildTimeRemaining = computed(() => {
  buildProgressTick.value; // Force reactivity
  if (!foundryStore.currentBuild) return 0;
  return foundryStore.getBuildTimeRemaining(foundryStore.currentBuild);
});

const handleItemClick = (item: FoundryItem, index: number) => {
  if (!foundryStore.canBuildItem(item)) return;

  // Start the build
  const success = foundryStore.startBuild(item.id);
  if (!success) return;

  // Animate the item card
  const element = itemRefs.value[index];
  if (element) {
    gsap.to(element, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
    });
  }
};


const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "common":
      return "emerald";
    case "uncommon":
      return "blue";
    case "rare":
      return "purple";
    case "legendary":
      return "orange";
    default:
      return "gray";
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "warframe":
      return "◆";
    case "weapon":
      return "⚔";
    default:
      return "●";
  }
};

onMounted(() => {
  // Gentle pulse animation for item cards
  itemRefs.value.forEach((ref, index) => {
    if (ref) {
      gsap.to(ref, {
        scale: 1.01,
        duration: 2 + index * 0.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  });
});
</script>

<template>
  <div class="flex flex-col w-full gap-6 p-6 max-w-[1600px] mx-auto">
    <!-- Header HUD -->
    <div class="relative">
      <!-- Corner decorations -->
      <div class="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-purple-500"></div>
      <div class="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-purple-500"></div>
      <div class="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400"></div>
      <div class="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400"></div>

      <div class="flex flex-col gap-4 py-8 px-4 bg-black/40 backdrop-blur-sm border border-purple-500/30">
        <!-- Title -->
        <div class="relative text-center">
          <h1 class="text-5xl font-bold tracking-wider text-purple-500 uppercase text-glow-purple">
            // FOUNDRY TERMINAL
          </h1>
          <div class="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent pointer-events-none"></div>
        </div>

        <!-- Resource Display Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <!-- Ferrite -->
          <div class="flex flex-col items-center gap-2 px-4 py-3 bg-black/60 border-2 border-emerald-500 clip-bevel-md">
            <div class="text-xs text-emerald-400 tracking-widest uppercase">[ FERRITE ]</div>
            <div class="text-2xl font-bold text-emerald-300 tabular-nums">
              {{ resourcesStore.formatNumber(resourcesStore.ferrite) }}
            </div>
          </div>

          <!-- Alloy Plate -->
          <div class="flex flex-col items-center gap-2 px-4 py-3 bg-black/60 border-2 border-emerald-500 clip-bevel-md">
            <div class="text-xs text-emerald-400 tracking-widest uppercase">[ ALLOY PLATE ]</div>
            <div class="text-2xl font-bold text-emerald-300 tabular-nums">
              {{ resourcesStore.formatNumber(resourcesStore.alloyPlate) }}
            </div>
          </div>

          <!-- Plastids -->
          <div class="flex flex-col items-center gap-2 px-4 py-3 bg-black/60 border-2 border-blue-500 clip-bevel-md">
            <div class="text-xs text-blue-400 tracking-widest uppercase">[ PLASTIDS ]</div>
            <div class="text-2xl font-bold text-blue-300 tabular-nums">
              {{ resourcesStore.formatNumber(resourcesStore.plastids) }}
            </div>
          </div>

          <!-- Neurodes -->
          <div class="flex flex-col items-center gap-2 px-4 py-3 bg-black/60 border-2 border-purple-500 clip-bevel-md">
            <div class="text-xs text-purple-400 tracking-widest uppercase">[ NEURODES ]</div>
            <div class="text-2xl font-bold text-purple-300 tabular-nums">
              {{ resourcesStore.formatNumber(resourcesStore.neurodes) }}
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="flex gap-6 justify-center mt-2 text-sm">
          <div class="flex items-center gap-2 px-4 py-2 bg-black/60 border border-purple-500/50">
            <div class="w-2 h-2 bg-purple-400 animate-pulse"></div>
            <span class="text-purple-300 tracking-wider">FRAMES BUILT:</span>
            <span class="text-white font-bold tabular-nums">
              {{ foundryStore.totalFramesBuilt }}
            </span>
          </div>
          <div class="flex items-center gap-2 px-4 py-2 bg-black/60 border border-cyan-500/50">
            <div class="w-2 h-2 bg-cyan-400 animate-pulse [animation-delay:0.5s]"></div>
            <span class="text-cyan-300 tracking-wider">QUEUE:</span>
            <span class="text-white font-bold tabular-nums">
              {{ foundryStore.buildQueue.length }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Build Queue Section -->
    <div v-if="foundryStore.currentBuild" class="relative">
      <div
        class="relative bg-black/40 backdrop-blur-sm border-2 border-cyan-500/50 p-6 clip-bevel-lg"
      >
        <!-- Corner decorations -->
        <div class="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400"></div>
        <div class="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400"></div>

        <div class="flex items-center justify-between mb-4 pb-3 border-b border-cyan-500/30">
          <h2 class="text-xl font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <div class="w-3 h-3 bg-cyan-400 animate-pulse"></div>
            // FABRICATION IN PROGRESS
          </h2>
          <div class="text-xs text-cyan-500/60 tracking-wider">[ ACTIVE BUILD ]</div>
        </div>

        <div class="flex flex-col gap-4">
          <!-- Build info -->
          <div class="flex items-center gap-4">
            <div class="text-4xl text-cyan-400">◆</div>
            <div>
              <div class="text-2xl font-bold text-white uppercase tracking-wide">
                {{ foundryStore.currentBuild.itemName }}
              </div>
              <div class="text-sm text-cyan-400">
                Time Remaining: {{ foundryStore.formatTimeRemaining(currentBuildTimeRemaining) }}
              </div>
            </div>
          </div>

          <!-- Progress bar -->
          <div class="relative w-full h-6 bg-black/60 border-2 border-cyan-500/50 overflow-hidden">
            <div
              class="absolute inset-0 bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-300"
              :style="{ width: currentBuildProgress + '%' }"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            </div>
            <div class="absolute inset-0 flex items-center justify-center text-white font-bold text-sm tracking-wider drop-shadow-lg">
              {{ currentBuildProgress.toFixed(1) }}%
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Blueprints Grid -->
    <div class="relative bg-black/40 backdrop-blur-sm border border-purple-500/30 p-6">
      <div class="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-purple-400"></div>
      <div class="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-purple-400"></div>

      <div class="flex items-center justify-between mb-6 pb-3 border-b border-purple-500/30">
        <h2 class="text-xl font-bold text-purple-400 uppercase tracking-wider">
          // AVAILABLE BLUEPRINTS
        </h2>
        <div class="text-xs text-purple-500/60 tracking-wider">[ CATALOG ]</div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          v-for="(item, index) in foundryStore.availableItems"
          :key="item.id"
          class="relative group cursor-pointer"
          @click="handleItemClick(item, index)"
        >
          <div
            :ref="(el: unknown) => (itemRefs[index] = el as HTMLElement)"
            class="relative bg-black/60 border-2 p-5 transition-all duration-200 clip-bevel-lg"
            :class="[
              foundryStore.canBuildItem(item)
                ? item.type === 'warframe'
                  ? 'border-purple-500/50 hover:border-purple-400 hover:bg-black/80'
                  : `border-${getRarityColor(item.rarity)}-500/50 hover:border-${getRarityColor(item.rarity)}-400 hover:bg-black/80`
                : 'border-gray-700/50 cursor-not-allowed opacity-60'
            ]"
          >
            <!-- Corner decorations -->
            <div
              class="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2"
              :class="item.type === 'warframe' ? 'border-purple-400' : `border-${getRarityColor(item.rarity)}-400`"
            ></div>
            <div
              class="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2"
              :class="item.type === 'warframe' ? 'border-purple-400' : `border-${getRarityColor(item.rarity)}-400`"
            ></div>

            <!-- Side accent bar -->
            <div
              class="absolute left-0 top-0 bottom-0 w-1"
              :class="item.type === 'warframe' ? 'bg-purple-500' : `bg-${getRarityColor(item.rarity)}-500`"
            ></div>

            <!-- Header -->
            <div class="flex justify-between items-start mb-3">
              <div class="flex items-center gap-3 flex-1">
                <div
                  class="w-12 h-12 flex items-center justify-center border-2 text-3xl"
                  :class="item.type === 'warframe' ? 'border-purple-500 text-purple-400' : `border-${getRarityColor(item.rarity)}-500 text-${getRarityColor(item.rarity)}-400`"
                >
                  {{ getTypeIcon(item.type) }}
                </div>
                <div class="flex-1">
                  <div class="font-bold text-white uppercase tracking-wide text-lg">
                    {{ item.name }}
                  </div>
                  <div
                    v-if="item.type !== 'warframe'"
                    class="text-xs uppercase tracking-wider"
                    :class="`text-${getRarityColor(item.rarity)}-400`"
                  >
                    {{ item.rarity }} {{ item.type }}
                  </div>
                  <div
                    v-else
                    class="text-xs uppercase tracking-wider text-purple-400"
                  >
                    WARFRAME
                  </div>
                </div>
              </div>
              <div
                v-if="item.owned > 0 && item.type === 'warframe'"
                class="px-3 py-1 text-sm font-bold border-2 bg-gray-900/80 border-gray-500 text-gray-300"
              >
                ✓ BUILT
              </div>
              <div
                v-else-if="item.owned > 0"
                class="px-3 py-1 text-sm font-bold border-2"
                :class="`bg-${getRarityColor(item.rarity)}-900/30 border-${getRarityColor(item.rarity)}-500/50 text-${getRarityColor(item.rarity)}-400`"
              >
                OWNED: {{ item.owned }}
              </div>
            </div>

            <!-- Description -->
            <div class="text-sm text-gray-400 mb-4 ml-15">{{ item.description }}</div>

            <!-- Resources Required -->
            <div
              class="flex flex-col gap-2 mb-4 pt-3 border-t"
              :class="item.type === 'warframe' ? 'border-purple-500/30' : `border-${getRarityColor(item.rarity)}-500/30`"
            >
              <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">Resources Required:</div>
              <div class="grid grid-cols-2 gap-2">
                <div v-if="item.cost.ferrite" class="flex items-center justify-between px-3 py-1.5 bg-black/40 border border-emerald-500/30">
                  <span class="text-xs text-emerald-400 tracking-wider">FERRITE</span>
                  <span
                    class="text-sm font-bold tabular-nums"
                    :class="resourcesStore.ferrite >= item.cost.ferrite ? 'text-emerald-300' : 'text-red-400'"
                  >
                    {{ foundryStore.formatNumber(item.cost.ferrite) }}
                  </span>
                </div>
                <div v-if="item.cost.alloyPlate" class="flex items-center justify-between px-3 py-1.5 bg-black/40 border border-emerald-500/30">
                  <span class="text-xs text-emerald-400 tracking-wider">ALLOY</span>
                  <span
                    class="text-sm font-bold tabular-nums"
                    :class="resourcesStore.alloyPlate >= item.cost.alloyPlate ? 'text-emerald-300' : 'text-red-400'"
                  >
                    {{ foundryStore.formatNumber(item.cost.alloyPlate) }}
                  </span>
                </div>
                <div v-if="item.cost.plastids" class="flex items-center justify-between px-3 py-1.5 bg-black/40 border border-blue-500/30">
                  <span class="text-xs text-blue-400 tracking-wider">PLASTIDS</span>
                  <span
                    class="text-sm font-bold tabular-nums"
                    :class="resourcesStore.plastids >= item.cost.plastids ? 'text-blue-300' : 'text-red-400'"
                  >
                    {{ foundryStore.formatNumber(item.cost.plastids) }}
                  </span>
                </div>
                <div v-if="item.cost.neurodes" class="flex items-center justify-between px-3 py-1.5 bg-black/40 border border-purple-500/30">
                  <span class="text-xs text-purple-400 tracking-wider">NEURODES</span>
                  <span
                    class="text-sm font-bold tabular-nums"
                    :class="resourcesStore.neurodes >= item.cost.neurodes ? 'text-purple-300' : 'text-red-400'"
                  >
                    {{ foundryStore.formatNumber(item.cost.neurodes) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Build Time -->
            <div class="flex justify-between items-center text-sm">
              <div class="text-xs text-gray-500 uppercase tracking-wider">Build Time:</div>
              <div class="text-cyan-400 font-bold tracking-wider">
                {{ foundryStore.formatTimeRemaining(item.buildTime) }}
              </div>
            </div>

            <!-- Hover glow effect -->
            <div
              v-if="foundryStore.canBuildItem(item)"
              class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              :class="item.type === 'warframe' ? 'bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0' : `bg-gradient-to-r from-${getRarityColor(item.rarity)}-500/0 via-${getRarityColor(item.rarity)}-500/5 to-${getRarityColor(item.rarity)}-500/0`"
            ></div>
          </div>

          <!-- Corner highlight on hover -->
          <div
            v-if="foundryStore.canBuildItem(item)"
            class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 opacity-0 group-hover:opacity-100 transition-opacity"
            :class="item.type === 'warframe' ? 'border-purple-400' : `border-${getRarityColor(item.rarity)}-400`"
          ></div>
        </div>
      </div>
    </div>

    <!-- Debug Reset Button -->
    <div class="flex justify-center mt-4">
      <button
        @click="foundryStore.resetFoundry"
        class="relative px-6 py-2 bg-black/60 border border-red-700/50 text-red-400 hover:border-red-500 hover:bg-red-900/20 text-xs tracking-widest uppercase transition-all clip-bevel-md"
      >
        [ RESET FOUNDRY ]
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Text glow for purple */
.text-glow-purple {
  text-shadow: 0 0 20px rgba(168, 85, 247, 0.5), 0 0 40px rgba(168, 85, 247, 0.3);
}
</style>
