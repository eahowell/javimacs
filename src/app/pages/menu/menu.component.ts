import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

// Angular Material Components
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';

// Services and Interfaces
import { MenuService } from '../../services/menu.service';
import {
  MenuItem,
  MenuCategory,
  CategoryConfig,
} from '../../interfaces/menu-data.interface';

//? ==============================================================================
//? COMPONENT DEFINITION
//? ==============================================================================

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatExpansionModule,
    MatTabsModule,
    MatBadgeModule,
    MatTooltipModule,
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  // ===============================================================================
  // DEPENDENCY INJECTION
  // ===============================================================================
  private menuService = inject(MenuService);

  // ===============================================================================
  // DATA PROPERTIES
  // ===============================================================================
  menuItems = toSignal(this.menuService.getMenuItems(), { initialValue: [] });
  menuByCategory = toSignal(this.menuService.getMenuByCategory(), {
    initialValue: {},
  });
  categoryConfigs: CategoryConfig[] = [];

  // ===============================================================================
  // STATE MANAGEMENT
  // ===============================================================================
  selectedCategory = signal<MenuCategory | null>(null);
  showOnlyPopular = signal<boolean>(false);
  layoutMode = signal<'cards' | 'list' | 'accordion'>('cards');
  searchQuery = signal<string>('');

  // ===============================================================================
  // COMPUTED PROPERTIES
  // ===============================================================================
  filteredItems = computed(() => {
    const items = this.menuItems();
    const category = this.selectedCategory();
    const onlyPopular = this.showOnlyPopular();
    const query = this.searchQuery().toLowerCase();

    let filtered = items;

    // Apply category filter
    if (category) {
      filtered = filtered.filter((item) => item.category === category);
    }

    // Apply popularity filter
    if (onlyPopular) {
      filtered = filtered.filter((item) => item.isPopular);
    }

    // Apply search filter
    if (query) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  });

  filteredItemCount = computed(() => this.filteredItems().length);
  hasActiveFilters = computed(
    () =>
      this.selectedCategory() !== null ||
      this.showOnlyPopular() ||
      this.searchQuery().length > 0
  );

  // ===============================================================================
  // LIFECYCLE METHODS
  // ===============================================================================
  ngOnInit(): void {
    console.log('🍽️ MenuComponent: Initializing with organized structure');

    // Load static configuration data
    this.categoryConfigs = this.menuService.getCategoryConfigs();

    // Log initial state for debugging
    console.log(
      '📊 Initial category configs loaded:',
      this.categoryConfigs.length
    );
  }

  // ===============================================================================
  // LAYOUT-SPECIFIC HELPER METHODS
  // ===============================================================================

  // --------------- CARD LAYOUT HELPERS ---------------

  /**
   * Get menu items for a specific category (used by card layout)
   * @param category - The category to filter by
   * @returns Array of menu items in that category
   */
  getItemsForCategory(category: MenuCategory): MenuItem[] {
    const categoryData = this.menuByCategory();
    return categoryData[category as keyof typeof categoryData] || [];
  }

  /**
   * Check if a category has any popular items (for badge display)
   * @param category - The category to check
   * @returns true if category contains popular items
   */
  categoryHasPopularItems(category: MenuCategory): boolean {
    return this.getItemsForCategory(category).some((item) => item.isPopular);
  }

  /**
   * Get configuration object for a specific category
   * @param category - The category to get config for
   * @returns CategoryConfig object or undefined
   */
  getCategoryConfig(category: MenuCategory): CategoryConfig | undefined {
    return this.categoryConfigs.find((config) => config.category === category);
  }

  // --------------- LIST LAYOUT HELPERS ---------------

  /**
   * Check if an item matches the current filter criteria
   * Used by list layout for conditional styling
   * @param item - The menu item to check
   * @returns true if item matches current filters
   */
  itemMatchesFilters(item: MenuItem): boolean {
    const category = this.selectedCategory();
    const onlyPopular = this.showOnlyPopular();

    if (category && item.category !== category) return false;
    if (onlyPopular && !item.isPopular) return false;

    return true;
  }

  // --------------- ACCORDION LAYOUT HELPERS ---------------

  /**
   * Get the count of items in a specific category
   * Used by accordion headers to show item counts
   * @param category - The category to count
   * @returns Number of items in the category
   */
  getCategoryItemCount(category: MenuCategory): number {
    return this.getItemsForCategory(category).length;
  }

  /**
   * Get the count of popular items in a category
   * Used for showing popular item indicators in accordion headers
   * @param category - The category to check
   * @returns Number of popular items in the category
   */
  getPopularItemCountForCategory(category: MenuCategory): number {
    return this.getItemsForCategory(category).filter((item) => item.isPopular)
      .length;
  }

  // ===============================================================================
  // EVENT HANDLERS
  // ===============================================================================
  selectCategory(category: MenuCategory | null): void {
    console.log('🏷️ Category selected:', category || 'All Categories');
    this.selectedCategory.set(category);
  }

  togglePopularOnly(): void {
    this.showOnlyPopular.update((current) => {
      const newValue = !current;
      console.log('⭐ Popular filter toggled:', newValue ? 'ON' : 'OFF');
      return newValue;
    });
  }

  setLayoutMode(mode: 'cards' | 'list' | 'accordion'): void {
    console.log('🎨 Layout mode changed:', mode);
    this.layoutMode.set(mode);
  }

  clearAllFilters(): void {
    console.log('🧹 Clearing all filters');
    this.selectedCategory.set(null);
    this.showOnlyPopular.set(false);
    this.searchQuery.set('');
  }

  updateSearchQuery(query: string): void {
    console.log('🔍 Search query updated:', query);
    this.searchQuery.set(query);
  }

  onItemSelected(item: MenuItem): void {
    console.log('📱 Menu item selected:', item.name);

    // Future enhancement: Navigate to item detail page
    // this.router.navigate(['/menu', item.id]);

    // Or show item details in a modal
    // this.dialog.open(MenuItemDetailComponent, { data: item });
  }

  // ===============================================================================
  // UTILITY METHODS
  // ===============================================================================
  /**
   * Format a price value for consistent display
   * @param price - The numeric price value
   * @returns Formatted price string (e.g., "$12.99")
   */
  formatPrice(price: number): string {
    return this.menuService.formatPrice(price);
  }

  getFilterDescription(): string {
    const parts: string[] = [];

    const category = this.selectedCategory();
    if (category) {
      const config = this.getCategoryConfig(category);
      parts.push(`Category: ${config?.displayName || category}`);
    }

    if (this.showOnlyPopular()) {
      parts.push('Popular items only');
    }

    const query = this.searchQuery();
    if (query) {
      parts.push(`Search: "${query}"`);
    }

    return parts.length > 0
      ? `Filters active: ${parts.join(', ')}`
      : 'No filters active';
  }

  getTotalItemCount(): number {
    return this.menuItems().length;
  }

  layoutSupportsFeature(feature: 'images' | 'categories' | 'badges'): boolean {
    const mode = this.layoutMode();

    switch (feature) {
      case 'images':
        return mode === 'cards'; // Only card layout shows images
      case 'categories':
        return mode === 'cards' || mode === 'accordion'; // List doesn't show categories
      case 'badges':
        return true; // All layouts support badges
      default:
        return false;
    }
  }

  /**
   * Generate a CSS class string based on current component state
   * Useful for conditional styling based on filters and layout
   * @returns Space-separated CSS class string
   */
  getContainerClasses(): string {
    const classes = ['menu-container'];

    classes.push(`layout-${this.layoutMode()}`);

    if (this.hasActiveFilters()) {
      classes.push('has-filters');
    }

    if (this.filteredItems().length === 0) {
      classes.push('no-results');
    }

    return classes.join(' ');
  }

  // ================================================================================
  // FUTURE ENHANCEMENT PLACEHOLDERS
  // ================================================================================

  /**
   * Export current menu data for sharing or printing
   * Future enhancement for data export functionality
   */
  exportMenuData(): void {
    // Implementation placeholder
    console.log('Export functionality not yet implemented');
  }

  /**
   * Handle keyboard navigation for accessibility
   * Future enhancement for better accessibility support
   */
  onKeyboardNavigation(event: KeyboardEvent): void {
    // Implementation placeholder for keyboard shortcuts
    console.log('Keyboard navigation not yet implemented', event);
  }
}
