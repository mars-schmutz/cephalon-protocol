<script setup lang="ts">
import { computed } from "vue";

interface Props {
  label: string;
  value: string | number;
  perSecond?: string | number;
  borderColor?: "cyan" | "orange" | "emerald" | "blue" | "purple" | "gray";
  layout?: "horizontal" | "vertical";
  animationDelay?: string;
  showDot?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  borderColor: "cyan",
  layout: "horizontal",
  animationDelay: "0s",
  showDot: true,
});

const borderClasses = computed(() => {
  const colorMap = {
    cyan: "border-cyan-500/50",
    orange: "border-orange-500/50",
    emerald: "border-emerald-500",
    blue: "border-blue-500",
    purple: "border-purple-500",
    gray: "border-gray-500",
  };
  return colorMap[props.borderColor];
});

const textClasses = computed(() => {
  const colorMap = {
    cyan: "text-cyan-300",
    orange: "text-orange-300",
    emerald: "text-emerald-400",
    blue: "text-blue-400",
    purple: "text-purple-400",
    gray: "text-gray-400",
  };
  return colorMap[props.borderColor];
});

const dotClasses = computed(() => {
  const colorMap = {
    cyan: "bg-cyan-400",
    orange: "bg-orange-400",
    emerald: "bg-emerald-400",
    blue: "bg-blue-400",
    purple: "bg-purple-400",
    gray: "bg-gray-400",
  };
  return colorMap[props.borderColor];
});

const rateClasses = computed(() => {
  const colorMap = {
    cyan: "text-cyan-500/70",
    orange: "text-orange-500/70",
    emerald: "text-emerald-500/70",
    blue: "text-blue-500/70",
    purple: "text-purple-500/70",
    gray: "text-gray-500/70",
  };
  return colorMap[props.borderColor];
});
</script>

<template>
  <!-- Horizontal Layout -->
  <div
    v-if="layout === 'horizontal'"
    class="flex items-center gap-2 px-4 py-2 bg-black/60 border"
    :class="borderClasses"
  >
    <div
      v-if="showDot"
      class="w-2 h-2 animate-pulse"
      :class="dotClasses"
      :style="{ animationDelay: animationDelay }"
    ></div>
    <span class="tracking-wider" :class="textClasses">{{ label }}</span>
    <span class="text-white font-bold tabular-nums">
      {{ value }}
    </span>
  </div>

  <!-- Vertical Layout -->
  <div
    v-else
    class="flex flex-col items-center gap-2 px-4 py-3 bg-black/60 border-2 clip-bevel-md"
    :class="borderClasses"
  >
    <div class="text-xs tracking-widest uppercase" :class="textClasses">
      [ {{ label }} ]
    </div>
    <div class="text-3xl font-bold tabular-nums" :class="textClasses.replace('-400', '-300')">
      {{ value }}
    </div>
    <div v-if="perSecond !== undefined" class="flex items-center gap-2 text-xs" :class="rateClasses">
      <div class="w-1.5 h-1.5 animate-pulse" :class="dotClasses" :style="{ animationDelay: animationDelay }"></div>
      <span>{{ perSecond }}/s</span>
    </div>
  </div>
</template>
