// Represents a single menu item with all its properties
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  isSpicy?: boolean;
  isVegetarian?: boolean;
  allergens?: string[];
  imageUrl?: string;
  isPopular?: boolean;
  customizations?: string[];
}

// Enum for menu categories - this ensures we only use valid category names
export enum MenuCategory {
  ENTREES = 'entrees',
  SANDWICHES = 'sandwiches',
  BURGERS = 'burgers',
  SIDES = 'sides',
  DRINKS = 'drinks'
}

// Configuration for how each category should be displayed
export interface CategoryConfig {
  category: MenuCategory;
  displayName: string;          // Human-readable category name
  description?: string;         // Optional description shown under category name
  icon?: string;               // Optional Material icon name
  color?: string;              // Optional color for category theming
}

// Interface for organizing menu data by categories
export interface MenuData {
  [key: string]: MenuItem[];    // Key is category name, value is array of items
}

// Interface for special offers or meal deals
// This allows for future expansion with combo meals or daily specials
export interface MenuDeal {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  dealPrice: number;
  itemIds: string[];
  validUntil?: Date;
  isActive: boolean;
}
