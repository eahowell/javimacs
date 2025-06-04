// src/app/services/menu.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MenuItem, MenuCategory, CategoryConfig, MenuData } from '../interfaces/menu-data.interface';


//  Service to manage menu data and provide it to components
@Injectable({
  providedIn: 'root'
})
export class MenuService {

  // BehaviorSubject allows components to subscribe to menu data changes
  private menuItemsSubject = new BehaviorSubject<MenuItem[]>([]);
  public menuItems$ = this.menuItemsSubject.asObservable();

  // Configuration for how categories should be displayed
  // This separation makes it easy to change presentation without touching data
  private categoryConfigs: CategoryConfig[] = [
    {
      category: MenuCategory.ENTREES,
      displayName: 'Entrées',
      description: 'All entrées include choice of drink',
      icon: 'restaurant',
      color: 'primary'
    },
    {
      category: MenuCategory.SANDWICHES,
      displayName: 'Sandwiches',
      description: 'All sandwiches include choice of side and drink',
      icon: 'breakfast_dining',
      color: 'accent'
    },
    {
      category: MenuCategory.BURGERS,
      displayName: 'Burgers',
      description: 'All burgers include choice of side and drink',
      icon: 'lunch_dining',
      color: 'warn'
    },
    {
      category: MenuCategory.SIDES,
      displayName: 'Sides',
      description: 'Perfect additions to any meal',
      icon: 'rice_bowl',
      color: 'primary'
    },
    {
      category: MenuCategory.DRINKS,
      displayName: 'Drinks',
      description: 'Refreshing beverages',
      icon: 'local_cafe',
      color: 'accent'
    }
  ];

  // Static menu data - in a real application, this might come from an API
  // For now, we'll store it in the service to keep things simple
  private menuData: MenuItem[] = [
    // ENTRÉES
    {
      id: 'cuban-cup',
      name: 'Cuban in a Cup',
      description: 'Rice and black beans topped with roasted pork',
      price: 10,
      category: MenuCategory.ENTREES,
      isPopular: true
    },
    {
      id: 'cuban-plate',
      name: 'Cuban Plate',
      description: 'Roasted pork, white rice, black beans, and sweet plantains',
      price: 15,
      category: MenuCategory.ENTREES
    },
    {
      id: 'chicken-plate',
      name: 'Chicken Plate',
      description: 'Grilled breast, white rice, black beans, and sweet plantains',
      price: 15,
      category: MenuCategory.ENTREES
    },

    // SANDWICHES
    {
      id: 'cuban-sandwich',
      name: 'Cuban Sandwich',
      description: 'Roasted pork, sliced sweet ham, Swiss cheese, and pickles on a pressed Cuban roll',
      price: 15,
      category: MenuCategory.SANDWICHES,
      isPopular: true
    },
    {
      id: 'midnight-sandwich',
      name: 'Midnight Sandwich (Medianoche)',
      description: 'Roasted pork, sliced sweet ham, Swiss cheese, mayo/mustard, pickles, on toasted sweet bread',
      price: 15,
      category: MenuCategory.SANDWICHES
    },
    {
      id: 'cuban-pork-sandwich',
      name: 'Cuban Pork Sandwich',
      description: 'Roasted pork topped with grilled onions on a toasted bun',
      price: 12,
      category: MenuCategory.SANDWICHES
    },
    {
      id: 'chicken-sandwich',
      name: 'Chicken Sandwich',
      description: 'Lettuce, tomato, Swiss cheese, and salad dressing on a toasted bun',
      price: 12,
      category: MenuCategory.SANDWICHES
    },

    // BURGERS
    {
      id: 'gringo-double',
      name: 'Gringo Double Burger',
      description: 'Two beef patties, American cheese, lettuce, tomato, and pickles on a toasted bun',
      price: 13,
      category: MenuCategory.BURGERS
    },
    {
      id: 'javi-macs-burger',
      name: 'Javi Mac\'s Burger',
      description: 'Smashed beef patty, roasted pork, American cheese, pickles, and BBQ sauce on a toasted bun',
      price: 13,
      category: MenuCategory.BURGERS,
      isPopular: true
    },
    {
      id: 'frita-cubana',
      name: 'Frita Cubana',
      description: 'Double patty of ground beef, pork, and Chorizo sausage smashed with Swiss cheese, lettuce, grilled onion, and salad dressing on a toasted bun topped with potato sticks',
      price: 14,
      category: MenuCategory.BURGERS,
      isSpicy: true
    },

    // SIDES
    {
      id: 'premium-sides',
      name: 'Premium Sides',
      description: 'Black Beans & Rice or Sweet Plantains',
      price: 4,
      category: MenuCategory.SIDES
    },
    {
      id: 'standard-sides',
      name: 'Standard Sides',
      description: 'Plain Cup of Rice or Coleslaw',
      price: 2,
      category: MenuCategory.SIDES
    },
    {
      id: 'chips',
      name: 'Chips',
      description: 'Assortment of chips to choose from',
      price: 1,
      category: MenuCategory.SIDES
    },

    // DRINKS
    {
      id: 'drinks',
      name: 'Beverages',
      description: 'Can Soda or Water',
      price: 2,
      category: MenuCategory.DRINKS
    }
  ];

  constructor() {
    this.loadMenuData();
  }

  // Load menu data and emit it to subscribers
  // This method simulates what would happen with an HTTP request
  private loadMenuData(): void {
    console.log('🍽️ MenuService: Loading menu data');
    this.menuItemsSubject.next(this.menuData);
  }

  getMenuItems(): Observable<MenuItem[]> {
    return this.menuItems$;
  }

  // Get menu items organized by category
  getMenuByCategory(): Observable<MenuData> {
    return new Observable(subscriber => {
      this.menuItems$.subscribe(items => {
        const organized: MenuData = {};

        // Group items by category
        items.forEach(item => {
          const categoryKey = item.category;
          if (!organized[categoryKey]) {
            organized[categoryKey] = [];
          }
          organized[categoryKey].push(item);
        });

        subscriber.next(organized);
      });
    });
  }

  // Get items for a specific category
  getItemsByCategory(category: MenuCategory): Observable<MenuItem[]> {
    return new Observable(subscriber => {
      this.menuItems$.subscribe(items => {
        const filtered = items.filter(item => item.category === category);
        subscriber.next(filtered);
      });
    });
  }

  // Get popular items across all categories
  // This could be used for a "favorites" or "popular" section
  getPopularItems(): Observable<MenuItem[]> {
    return new Observable(subscriber => {
      this.menuItems$.subscribe(items => {
        const popular = items.filter(item => item.isPopular);
        subscriber.next(popular);
      });
    });
  }

  // Get category configuration
   getCategoryConfigs(): CategoryConfig[] {
    return this.categoryConfigs;
  }

  // Get configuration for a specific category
  getCategoryConfig(category: MenuCategory): CategoryConfig | undefined {
    return this.categoryConfigs.find(config => config.category === category);
  }

  // Format price for display
  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  // Search menu items by name or description
  searchItems(query: string): Observable<MenuItem[]> {
    return new Observable(subscriber => {
      this.menuItems$.subscribe(items => {
        const lowercaseQuery = query.toLowerCase();
        const results = items.filter(item =>
          item.name.toLowerCase().includes(lowercaseQuery) ||
          item.description.toLowerCase().includes(lowercaseQuery)
        );
        subscriber.next(results);
      });
    });
  }
}
