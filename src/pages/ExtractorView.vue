<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useResourcesStore } from "@/stores/resources";
import { useCreditsStore } from "@/stores/credits";
import gsap from "gsap";

const resourcesStore = useResourcesStore();
const creditsStore = useCreditsStore();

const extractorRefs = ref<(HTMLElement | null)[]>([]);

const handleExtractorClick = (extractorId: string, index: number) => {
  const extractor = resourcesStore.extractors.find((e) => e.id === extractorId);
  if (!extractor || !resourcesStore.canAffordExtractor(extractor)) return;

  // Purchase the extractor upgrade
  const success = resourcesStore.buyExtractor(extractorId);
  if (!success) return;

  // Animate the extractor card
  const element = extractorRefs.value[index];
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
    default:
      return "gray";
  }
};

onMounted(() => {
  // Gentle pulse animation for extractor cards
  extractorRefs.value.forEach((ref, index) => {
    if (ref) {
      gsap.to(ref, {
        scale: 1.02,
        duration: 2 + index * 0.3,
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
      <div class="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-500"></div>
      <div class="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-500"></div>
      <div class="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-purple-400"></div>
      <div class="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-purple-400"></div>

      <div class="flex flex-col gap-4 py-8 px-4 bg-black/40 backdrop-blur-sm border border-emerald-500/30">
        <!-- Title -->
        <div class="relative text-center">
          <h1 class="text-5xl font-bold tracking-wider text-emerald-500 uppercase text-glow-green">
            // EXTRACTOR NETWORK
          </h1>
          <div class="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent pointer-events-none"></div>
        </div>

        <!-- Resource Display Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <!-- Ferrite -->
          <div class="flex flex-col items-center gap-2 px-4 py-3 bg-black/60 border-2 border-emerald-500 clip-bevel-md">
            <div class="text-xs text-emerald-400 tracking-widest uppercase">[ FERRITE ]</div>
            <div class="text-3xl font-bold text-emerald-300 tabular-nums">
              {{ resourcesStore.formatNumber(resourcesStore.ferrite) }}
            </div>
            <div class="flex items-center gap-2 text-xs text-emerald-500/70">
              <div class="w-1.5 h-1.5 bg-emerald-400 animate-pulse"></div>
              <span>{{ resourcesStore.formatNumber(resourcesStore.ferritePerSecond) }}/s</span>
            </div>
          </div>

          <!-- Alloy Plate -->
          <div class="flex flex-col items-center gap-2 px-4 py-3 bg-black/60 border-2 border-emerald-500 clip-bevel-md">
            <div class="text-xs text-emerald-400 tracking-widest uppercase">[ ALLOY PLATE ]</div>
            <div class="text-3xl font-bold text-emerald-300 tabular-nums">
              {{ resourcesStore.formatNumber(resourcesStore.alloyPlate) }}
            </div>
            <div class="flex items-center gap-2 text-xs text-emerald-500/70">
              <div class="w-1.5 h-1.5 bg-emerald-400 animate-pulse [animation-delay:0.3s]"></div>
              <span>{{ resourcesStore.formatNumber(resourcesStore.alloyPlatePerSecond) }}/s</span>
            </div>
          </div>

          <!-- Plastids -->
          <div class="flex flex-col items-center gap-2 px-4 py-3 bg-black/60 border-2 border-blue-500 clip-bevel-md">
            <div class="text-xs text-blue-400 tracking-widest uppercase">[ PLASTIDS ]</div>
            <div class="text-3xl font-bold text-blue-300 tabular-nums">
              {{ resourcesStore.formatNumber(resourcesStore.plastids) }}
            </div>
            <div class="flex items-center gap-2 text-xs text-blue-500/70">
              <div class="w-1.5 h-1.5 bg-blue-400 animate-pulse [animation-delay:0.6s]"></div>
              <span>{{ resourcesStore.formatNumber(resourcesStore.plastidsPerSecond) }}/s</span>
            </div>
          </div>

          <!-- Neurodes -->
          <div class="flex flex-col items-center gap-2 px-4 py-3 bg-black/60 border-2 border-purple-500 clip-bevel-md">
            <div class="text-xs text-purple-400 tracking-widest uppercase">[ NEURODES ]</div>
            <div class="text-3xl font-bold text-purple-300 tabular-nums">
              {{ resourcesStore.formatNumber(resourcesStore.neurodes) }}
            </div>
            <div class="flex items-center gap-2 text-xs text-purple-500/70">
              <div class="w-1.5 h-1.5 bg-purple-400 animate-pulse [animation-delay:0.9s]"></div>
              <span>{{ resourcesStore.formatNumber(resourcesStore.neurodesPerSecond) }}/s</span>
            </div>
          </div>
        </div>

        <!-- Credits Display -->
        <div class="flex justify-center items-center gap-2 mt-2 px-4 py-2 bg-black/60 border border-orange-500/50">
          <span class="text-xs text-orange-300 tracking-wider uppercase">Available Credits:</span>
          <span class="text-xl font-bold text-orange-400 tabular-nums">
            {{ creditsStore.formatNumber(creditsStore.credits) }} CR
          </span>
        </div>
      </div>
    </div>

    <!-- Extractors Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        v-for="(extractor, index) in resourcesStore.extractors"
        :key="extractor.id"
        class="relative group cursor-pointer"
        @click="handleExtractorClick(extractor.id, index)"
      >
        <div
          :ref="(el: unknown) => (extractorRefs[index] = el as HTMLElement)"
          class="relative bg-black/40 backdrop-blur-sm border-2 p-6 transition-all duration-200 clip-bevel-lg"
          :class="[
            resourcesStore.canAffordExtractor(extractor)
              ? `border-${getRarityColor(extractor.rarity)}-500/50 hover:border-${getRarityColor(extractor.rarity)}-400 hover:bg-black/60`
              : 'border-gray-700/50 cursor-not-allowed opacity-60'
          ]"
        >
          <!-- Corner decorations -->
          <div class="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2" :class="`border-${getRarityColor(extractor.rarity)}-400`"></div>
          <div class="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2" :class="`border-${getRarityColor(extractor.rarity)}-400`"></div>

          <!-- Header -->
          <div class="flex justify-between items-start mb-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <div
                  class="w-10 h-10 flex items-center justify-center border-2 text-2xl"
                  :class="`border-${getRarityColor(extractor.rarity)}-500 text-${getRarityColor(extractor.rarity)}-400`"
                >
                  ◆
                </div>
                <div>
                  <div class="font-bold text-white uppercase tracking-wide text-lg">
                    {{ extractor.name }}
                  </div>
                  <div class="text-xs uppercase tracking-wider" :class="`text-${getRarityColor(extractor.rarity)}-400`">
                    {{ extractor.rarity }}
                  </div>
                </div>
              </div>
              <div class="text-sm text-gray-400 ml-13">{{ extractor.description }}</div>
            </div>
          </div>

          <!-- Stats -->
          <div class="flex flex-col gap-3 mt-4 pt-4 border-t" :class="`border-${getRarityColor(extractor.rarity)}-500/30`">
            <!-- Level and Production -->
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <div class="px-3 py-1 text-sm font-bold border" :class="`bg-${getRarityColor(extractor.rarity)}-900/30 border-${getRarityColor(extractor.rarity)}-500/50 text-${getRarityColor(extractor.rarity)}-400`">
                  LVL {{ extractor.level }}
                </div>
                <div class="text-sm font-bold tracking-wider" :class="`text-${getRarityColor(extractor.rarity)}-400`">
                  <template v-if="extractor.level > 0">
                    +{{ (extractor.level * extractor.baseProduction).toFixed(2) }}/s
                  </template>
                  <template v-else>
                    OFFLINE
                  </template>
                </div>
              </div>
            </div>

            <!-- Cost -->
            <div class="flex justify-between items-center">
              <div class="text-xs text-gray-500 uppercase tracking-wider">
                {{ extractor.level === 0 ? "Deploy Cost" : "Upgrade Cost" }}
              </div>
              <div
                class="px-4 py-2 border-2 font-bold text-sm tracking-wider clip-bevel-sm"
                :class="
                  resourcesStore.canAffordExtractor(extractor)
                    ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                    : 'bg-gray-800 border-gray-700 text-gray-500'
                "
              >
                {{ creditsStore.formatNumber(resourcesStore.getExtractorCost(extractor)) }} CR
              </div>
            </div>
          </div>

          <!-- Hover glow effect -->
          <div
            v-if="resourcesStore.canAffordExtractor(extractor)"
            class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            :class="`bg-gradient-to-r from-${getRarityColor(extractor.rarity)}-500/0 via-${getRarityColor(extractor.rarity)}-500/5 to-${getRarityColor(extractor.rarity)}-500/0`"
          ></div>
        </div>

        <!-- Corner highlight on hover -->
        <div
          v-if="resourcesStore.canAffordExtractor(extractor)"
          class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 opacity-0 group-hover:opacity-100 transition-opacity"
          :class="`border-${getRarityColor(extractor.rarity)}-400`"
        ></div>
      </div>
    </div>

    <!-- Debug Reset Button -->
    <div class="flex justify-center mt-4">
      <button
        @click="resourcesStore.resetResources"
        class="relative px-6 py-2 bg-black/60 border border-red-700/50 text-red-400 hover:border-red-500 hover:bg-red-900/20 text-xs tracking-widest uppercase transition-all clip-bevel-md"
      >
        [ RESET EXTRACTORS ]
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Text glow for green */
.text-glow-green {
  text-shadow: 0 0 20px rgba(16, 185, 129, 0.5), 0 0 40px rgba(16, 185, 129, 0.3);
}
</style>
