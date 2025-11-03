<template>
  <div class="flex flex-col gap-2 p-4 bg-black/60 backdrop-blur-sm border border-orange-500/30 min-w-[200px]">
    <!-- Header -->
    <div class="mb-2 pb-2 border-b border-orange-500/30">
      <div class="text-xs text-orange-500/60 tracking-widest uppercase">[ NAVIGATION ]</div>
    </div>

    <!-- Nav Links -->
    <RouterLink
      to="/"
      class="relative px-4 py-3 text-sm tracking-wider uppercase transition-all border border-transparent hover:border-cyan-500 hover:bg-cyan-500/10 group clip-bevel-sm text-gray-300 hover:text-cyan-300"
      active-class="!border-orange-500 !bg-orange-500/10 !text-orange-400"
    >
      <div class="flex items-center gap-2">
        <div class="w-1 h-1 bg-cyan-400 group-hover:bg-cyan-300"></div>
        <span>Cephalon</span>
      </div>
    </RouterLink>

    <RouterLink
      to="/extractors"
      class="relative px-4 py-3 text-sm tracking-wider uppercase transition-all border border-transparent hover:border-cyan-500 hover:bg-cyan-500/10 group clip-bevel-sm text-gray-300 hover:text-cyan-300"
      active-class="!border-orange-500 !bg-orange-500/10 !text-orange-400"
    >
      <div class="flex items-center gap-2">
        <div class="w-1 h-1 bg-cyan-400 group-hover:bg-cyan-300"></div>
        <span>Extractors</span>
      </div>
    </RouterLink>

    <RouterLink
      to="/foundry"
      class="relative px-4 py-3 text-sm tracking-wider uppercase transition-all border border-transparent hover:border-cyan-500 hover:bg-cyan-500/10 group clip-bevel-sm text-gray-300 hover:text-cyan-300"
      active-class="!border-orange-500 !bg-orange-500/10 !text-orange-400"
    >
      <div class="flex items-center gap-2">
        <div class="w-1 h-1 bg-cyan-400 group-hover:bg-cyan-300"></div>
        <span>Foundry</span>
      </div>
    </RouterLink>

    <!-- Bottom decoration -->
    <div class="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400/30"></div>
    <div class="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-orange-400/30"></div>
  </div>
</template>
