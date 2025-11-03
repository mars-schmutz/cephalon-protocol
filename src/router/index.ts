import { createRouter, createWebHistory } from 'vue-router'

import CephalonView from "../pages/CephalonView.vue";
import ExtractorView from "../pages/ExtractorView.vue";
import FoundryView from "../pages/FoundryView.vue";

const routes = [
  { path: "/", component: CephalonView },
  { path: "/extractors", component: ExtractorView },
  { path: "/foundry", component: FoundryView },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
