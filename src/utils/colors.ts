/**
 * Map rarity levels to Tailwind color names
 * @param rarity - Item rarity level
 * @returns Tailwind color name (without prefix like 'text-' or 'bg-')
 */
export function getRarityColor(
  rarity: "common" | "uncommon" | "rare" | "legendary"
): string {
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
}

/**
 * Get icon for item type
 * @param type - Item type
 * @returns Unicode character for icon
 */
export function getTypeIcon(type: "warframe" | "weapon"): string {
  switch (type) {
    case "warframe":
      return "◆";
    case "weapon":
      return "⚔";
    default:
      return "●";
  }
}
