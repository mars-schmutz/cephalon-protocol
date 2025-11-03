<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useCreditsStore } from "@/stores/credits";
import StatCard from "@/components/StatCard.vue";
import gsap from "gsap";

const creditsStore = useCreditsStore();
const clickerButton = ref<HTMLElement | null>(null);
const creditsDisplay = ref<HTMLElement | null>(null);
const floatingTexts = ref<{ id: number; x: number; y: number; value: number }[]>(
  []
);
let floatingTextId = 0;

const handleClick = (event: MouseEvent) => {
  const earned = creditsStore.click();

  // Button animation
  if (clickerButton.value) {
    gsap.to(clickerButton.value, {
      scale: 0.92,
      duration: 0.08,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
    });
  }

  // Credits display pulse
  if (creditsDisplay.value) {
    gsap.fromTo(
      creditsDisplay.value,
      { scale: 1, filter: "brightness(1)" },
      {
        scale: 1.08,
        filter: "brightness(1.3)",
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
      }
    );
  }

  // Floating text animation
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const textId = floatingTextId++;
  floatingTexts.value.push({ id: textId, x, y, value: earned });

  // Remove after animation
  setTimeout(() => {
    floatingTexts.value = floatingTexts.value.filter((t) => t.id !== textId);
  }, 1200);
};

onMounted(() => {
  // Gentle pulse animation for the clicker button
  if (clickerButton.value) {
    gsap.to(clickerButton.value, {
      scale: 1.03,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }
});
</script>

<template>
  <div class="flex flex-col w-full gap-6 p-6 max-w-[1600px] mx-auto">
    <!-- Header HUD -->
    <div class="relative">
      <!-- Corner decorations -->
      <div class="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-orange-500"></div>
      <div class="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-orange-500"></div>
      <div class="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400"></div>
      <div class="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400"></div>

      <div class="flex flex-col items-center gap-3 py-8 px-4 bg-black/40 backdrop-blur-sm border border-orange-500/30">
        <!-- Title with scanlines -->
        <div class="relative">
          <h1 class="text-5xl font-bold tracking-wider text-orange-500 uppercase text-glow-orange">
            // CEPHALON PROTOCOL
          </h1>
          <div class="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/5 to-transparent pointer-events-none"></div>
        </div>

        <!-- Credits Display -->
        <div class="flex flex-col items-center gap-2 mt-2">
          <div class="text-xs text-cyan-400 tracking-widest uppercase">[ CREDIT BALANCE ]</div>
          <div
            ref="creditsDisplay"
            class="relative px-8 py-3 bg-black/60 border-2 border-orange-500 clip-bevel-lg"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-orange-500/10"></div>
            <div class="relative text-6xl font-bold text-orange-400 tabular-nums text-glow-orange-sm">
              {{ creditsStore.formatNumber(creditsStore.credits) }}
              <span class="text-2xl text-orange-300/60 ml-2">CR</span>
            </div>
          </div>
        </div>

        <!-- Stats Bar -->
        <div class="flex gap-8 mt-2 text-sm">
          <StatCard
            label="CPC:"
            :value="creditsStore.formatNumber(creditsStore.creditsPerClick)"
            border-color="cyan"
            layout="horizontal"
          />
          <StatCard
            label="CPS:"
            :value="creditsStore.formatNumber(creditsStore.creditsPerSecond)"
            border-color="orange"
            layout="horizontal"
            animation-delay="0.5s"
          />
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Clicker Section -->
      <div class="flex flex-col gap-4">
        <!-- Clicker Container -->
        <div class="relative bg-black/40 backdrop-blur-sm border border-cyan-500/30 p-8 hex-pattern">
          <div class="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400"></div>
          <div class="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400"></div>

          <div class="flex flex-col items-center justify-center gap-6">
            <div class="text-xs text-cyan-400 tracking-widest uppercase">[ NEURAL INTERFACE ]</div>

            <div class="relative">
              <button
                ref="clickerButton"
                @click="handleClick"
                class="relative w-72 h-72 bg-black border-4 border-cyan-500 cursor-pointer overflow-hidden group clip-octagon"
              >
                <!-- Animated background -->
                <div class="absolute inset-0 bg-gradient-to-br from-cyan-600/20 via-blue-900/30 to-cyan-800/20 group-hover:from-cyan-500/30 group-hover:to-cyan-700/30 transition-all duration-300"></div>

                <!-- Rotating hexagon border effect -->
                <div class="absolute inset-4 border-2 border-cyan-400/30 animate-spin [animation-duration:20s] clip-octagon"></div>

                <!-- Inner glow -->
                <div class="absolute inset-8 bg-gradient-to-br from-cyan-500/10 to-transparent animate-pulse"></div>

                <!-- Content -->
                <div class="relative z-10 flex flex-col items-center justify-center h-full">
                  <div class="text-8xl mb-4 filter drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]">◆</div>
                  <div class="text-cyan-300 font-bold text-2xl tracking-wider uppercase text-glow-cyan">
                    CEPHALON
                  </div>
                  <div class="text-cyan-500 text-sm mt-2 tracking-wider">[ EXECUTE ]</div>
                </div>

                <!-- Corner accents -->
                <div class="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-orange-400"></div>
                <div class="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-orange-400"></div>
                <div class="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-orange-400"></div>
                <div class="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-orange-400"></div>
              </button>

              <!-- Floating text animations -->
              <div
                v-for="text in floatingTexts"
                :key="text.id"
                class="absolute pointer-events-none text-3xl font-bold text-orange-400 animate-float-up text-glow-orange-bright"
                :style="{
                  left: text.x + 'px',
                  top: text.y + 'px',
                }"
              >
                +{{ text.value }}
              </div>
            </div>

            <!-- Stats -->
            <div class="flex flex-col gap-2 text-center text-xs text-gray-400 tracking-wider">
              <div class="flex items-center gap-2 justify-center">
                <div class="w-1 h-1 bg-orange-500"></div>
                <span>TOTAL EARNED:</span>
                <span class="text-orange-400 font-bold">
                  {{ creditsStore.formatNumber(creditsStore.totalCreditsEarned) }} CR
                </span>
              </div>
              <div class="flex items-center gap-2 justify-center">
                <div class="w-1 h-1 bg-cyan-500"></div>
                <span>EXECUTIONS:</span>
                <span class="text-cyan-400 font-bold">
                  {{ creditsStore.formatNumber(creditsStore.lifetimeClicks) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Upgrades Section -->
      <div class="flex flex-col gap-4">
        <div class="relative bg-black/40 backdrop-blur-sm border border-orange-500/30 p-6">
          <div class="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-orange-400"></div>
          <div class="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-orange-400"></div>

          <div class="flex items-center justify-between mb-4 pb-3 border-b border-orange-500/30">
            <h2 class="text-xl font-bold text-orange-400 uppercase tracking-wider">
              // SYSTEM UPGRADES
            </h2>
            <div class="text-xs text-orange-500/60 tracking-wider">[ MARKET ]</div>
          </div>

          <div class="flex flex-col gap-3 max-h-[660px] overflow-y-auto pr-2">
            <div
              v-for="upgrade in creditsStore.upgrades"
              :key="upgrade.id"
              class="relative group cursor-pointer"
              @click="
                creditsStore.canAffordUpgrade(upgrade) &&
                  creditsStore.buyUpgrade(upgrade.id)
              "
            >
              <!-- Background with clip-path -->
              <div
                class="relative bg-black/60 border-2 transition-all duration-200 p-4 clip-bevel-md"
                :class="
                  creditsStore.canAffordUpgrade(upgrade)
                    ? 'border-orange-500/50 hover:border-orange-400 hover:bg-black/80'
                    : 'border-gray-700/50 cursor-not-allowed opacity-50'
                "
              >
                <!-- Side accent bar -->
                <div
                  class="absolute left-0 top-0 bottom-0 w-1"
                  :class="upgrade.type === 'click' ? 'bg-cyan-500' : 'bg-orange-500'"
                ></div>

                <!-- Header -->
                <div class="flex justify-between items-start mb-3">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <div
                        class="w-6 h-6 flex items-center justify-center border text-xs"
                        :class="
                          upgrade.type === 'click'
                            ? 'border-cyan-500 text-cyan-400'
                            : 'border-orange-500 text-orange-400'
                        "
                      >
                        {{ upgrade.type === "click" ? "⬆" : "⚡" }}
                      </div>
                      <div class="font-bold text-white uppercase tracking-wide text-sm">
                        {{ upgrade.name }}
                      </div>
                    </div>
                    <div class="text-xs text-gray-400 ml-8">{{ upgrade.description }}</div>
                  </div>
                  <div
                    class="px-2 py-1 text-xs font-bold border"
                    :class="
                      upgrade.type === 'click'
                        ? 'bg-cyan-900/30 border-cyan-500/50 text-cyan-400'
                        : 'bg-orange-900/30 border-orange-500/50 text-orange-400'
                    "
                  >
                    LVL {{ upgrade.level }}
                  </div>
                </div>

                <!-- Stats and Cost -->
                <div class="flex justify-between items-center text-sm">
                  <div>
                    <span
                      v-if="upgrade.type === 'click'"
                      class="text-cyan-400 font-bold tracking-wider"
                    >
                      +{{ upgrade.effect }} CR/CLICK
                    </span>
                    <span v-else class="text-orange-400 font-bold tracking-wider">
                      +{{ upgrade.effect }} CR/SEC
                    </span>
                  </div>
                  <div
                    class="px-3 py-1 border-2 font-bold text-xs tracking-wider clip-bevel-sm"
                    :class="
                      creditsStore.canAffordUpgrade(upgrade)
                        ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                        : 'bg-gray-800 border-gray-700 text-gray-500'
                    "
                  >
                    {{ creditsStore.formatNumber(creditsStore.getUpgradeCost(upgrade)) }} CR
                  </div>
                </div>

                <!-- Hover glow effect -->
                <div
                  v-if="creditsStore.canAffordUpgrade(upgrade)"
                  class="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                ></div>
              </div>

              <!-- Corner decorations for affordable upgrades -->
              <div
                v-if="creditsStore.canAffordUpgrade(upgrade)"
                class="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-orange-400 opacity-0 group-hover:opacity-100 transition-opacity"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Debug Reset Button -->
    <div class="flex justify-center mt-4">
      <button
        @click="creditsStore.resetGame"
        class="relative px-6 py-2 bg-black/60 border border-red-700/50 text-red-400 hover:border-red-500 hover:bg-red-900/20 text-xs tracking-widest uppercase transition-all clip-bevel-md"
      >
        [ RESET PROTOCOL ]
      </button>
    </div>
  </div>
</template>

<style scoped>
@keyframes float-up {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-120px) scale(1.3);
    opacity: 0;
  }
}

.animate-float-up {
  animation: float-up 1.2s ease-out forwards;
}
</style>
