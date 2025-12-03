import type { FontAwesome6SolidIconName } from '@react-native-vector-icons/fontawesome6';

export interface CategoryMarkerConfig {
  color: string;
  backgroundColor: string;
  icon: FontAwesome6SolidIconName;
  label: string;
}

// Default marker configuration for unknown categories
export const DEFAULT_MARKER_CONFIG: CategoryMarkerConfig = {
  color: '#FFFFFF',
  backgroundColor: '#6B7280', // Gray
  icon: 'location-dot',
  label: 'Outro',
};

// Category marker configurations
// Keys should match the category slug from the backend
export const CATEGORY_MARKERS: Record<string, CategoryMarkerConfig> = {
  // Infrastructure & Urban Issues
  'buraco-na-rua': {
    color: '#FFFFFF',
    backgroundColor: '#EF4444', // Red
    icon: 'road-circle-exclamation',
    label: 'Buraco na Rua',
  },
  'poca-dagua': {
    color: '#FFFFFF',
    backgroundColor: '#3B82F6', // Blue
    icon: 'water',
    label: "Poça d'Água",
  },
  'arvore-caida': {
    color: '#FFFFFF',
    backgroundColor: '#22C55E', // Green
    icon: 'tree',
    label: 'Árvore Caída',
  },
  'lixo-acumulado': {
    color: '#FFFFFF',
    backgroundColor: '#78716C', // Stone
    icon: 'trash',
    label: 'Lixo Acumulado',
  },
  'semaforo-quebrado': {
    color: '#FFFFFF',
    backgroundColor: '#84CC16', // Lime
    icon: 'traffic-light',
    label: 'Semáforo Quebrado',
  },
  'placa-faltando': {
    color: '#FFFFFF',
    backgroundColor: '#14B8A6', // Teal
    icon: 'signs-post',
    label: 'Placa Faltando',
  },
  'calcada-danificada': {
    color: '#FFFFFF',
    backgroundColor: '#64748B', // Slate
    icon: 'triangle-exclamation',
    label: 'Calçada Danificada',
  },
  'poste-caido': {
    color: '#FFFFFF',
    backgroundColor: '#F97316', // Orange
    icon: 'tower-cell',
    label: 'Poste Caído',
  },
  'fiacao-pendurada': {
    color: '#FFFFFF',
    backgroundColor: '#FBBF24', // Amber
    icon: 'bolt',
    label: 'Fiação Pendurada',
  },
  'bueiro-aberto': {
    color: '#FFFFFF',
    backgroundColor: '#6B7280', // Gray
    icon: 'circle-down',
    label: 'Bueiro Aberto',
  },
  pichacao: {
    color: '#FFFFFF',
    backgroundColor: '#7C3AED', // Violet
    icon: 'spray-can',
    label: 'Pichação',
  },
  'iluminacao-publica-queimada': {
    color: '#FFFFFF',
    backgroundColor: '#F59E0B', // Amber
    icon: 'lightbulb',
    label: 'Iluminação Pública Queimada',
  },
  congestionamento: {
    color: '#FFFFFF',
    backgroundColor: '#DC2626', // Red-600
    icon: 'car',
    label: 'Congestionamento',
  },
  'acidente-de-transito': {
    color: '#FFFFFF',
    backgroundColor: '#B91C1C', // Red-700
    icon: 'car-burst',
    label: 'Acidente de Trânsito',
  },
  'abandono-de-veiculo': {
    color: '#FFFFFF',
    backgroundColor: '#6366F1', // Indigo
    icon: 'ban',
    label: 'Abandono de Veículo',
  },
  'vazamento-de-agua': {
    color: '#FFFFFF',
    backgroundColor: '#0891B2', // Cyan
    icon: 'droplet',
    label: 'Vazamento de Água',
  },
  'escoamento-ruim': {
    color: '#FFFFFF',
    backgroundColor: '#0EA5E9', // Sky
    icon: 'water-ladder',
    label: 'Escoamento Ruim',
  },
  'barreira-quebrada': {
    color: '#FFFFFF',
    backgroundColor: '#A16207', // Yellow-800
    icon: 'shield',
    label: 'Barreira Quebrada',
  },
  'lixeira-transbordando': {
    color: '#FFFFFF',
    backgroundColor: '#57534E', // Stone-600
    icon: 'dumpster',
    label: 'Lixeira Transbordando',
  },
  'som-excessivo': {
    color: '#FFFFFF',
    backgroundColor: '#EC4899', // Pink
    icon: 'volume-high',
    label: 'Som Excessivo',
  },

  // Legacy/fallback keys for backwards compatibility
  buraco: {
    color: '#FFFFFF',
    backgroundColor: '#EF4444',
    icon: 'road-circle-exclamation',
    label: 'Buraco',
  },
  outro: {
    color: '#FFFFFF',
    backgroundColor: '#6B7280',
    icon: 'circle-question',
    label: 'Outro',
  },
};

/**
 * Get marker configuration for a category
 * @param categorySlugOrName - The category slug or name
 * @returns CategoryMarkerConfig
 */
export function getCategoryMarkerConfig(
  categorySlugOrName?: string
): CategoryMarkerConfig {
  if (!categorySlugOrName) {
    return DEFAULT_MARKER_CONFIG;
  }

  // Normalize the category name to match keys:
  // 1. Remove accents (normalize to NFD and remove diacritics)
  // 2. Lowercase
  // 3. Replace spaces and special chars with hyphens
  // 4. Remove apostrophes and other punctuation
  const normalizedKey = categorySlugOrName
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '') // Remove diacritics (accents)
    .toLowerCase()
    .replaceAll(/['`]/g, '') // Remove apostrophes
    .replaceAll(/\s+/g, '-') // Replace spaces with hyphens
    .replaceAll(/[^a-z0-9-]/g, ''); // Remove any remaining special chars

  return CATEGORY_MARKERS[normalizedKey] || DEFAULT_MARKER_CONFIG;
}

/**
 * Get all available category marker configurations
 * @returns Array of category slugs and their configurations
 */
export function getAllCategoryMarkers(): {
  slug: string;
  config: CategoryMarkerConfig;
}[] {
  return Object.entries(CATEGORY_MARKERS).map(([slug, config]) => ({
    slug,
    config,
  }));
}
