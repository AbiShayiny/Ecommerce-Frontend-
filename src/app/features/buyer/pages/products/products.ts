import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../../core/models';
import { AuthService } from '../../../../core/services/auth.service';
import { CartService } from '../../../../core/services/cart.service';
import { CatalogService } from '../../../../core/services/catalog.service';
import { AiRecommendationsComponent } from '../../../../shared/components/ai-recommendations/ai-recommendations';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating';
type PriceRangeOption = 'all' | 'under-100k' | '100k-300k' | 'above-300k';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule, ProductCardComponent, EmptyStateComponent, AiRecommendationsComponent],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class ProductsComponent implements OnInit {
  protected readonly catalog = inject(CatalogService);
  private readonly cart = inject(CartService);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  protected readonly selectedCategory = signal<string>('all');
  protected readonly selectedBrand = signal<string>('all');
  protected readonly selectedPriceRange = signal<PriceRangeOption>('all');
  protected readonly minRating = signal<number>(0);
  protected readonly sortBy = signal<SortOption>('featured');
  protected readonly cartFeedback = signal<string>('');

  protected readonly brands = computed(() => {
    const unique = new Set(this.catalog.activeProducts().map((p) => p.brand));
    return Array.from(unique).sort();
  });

  protected readonly filteredProducts = computed(() => {
    const query = this.catalog.searchQuery().trim().toLowerCase();
    const category = this.selectedCategory();
    const brand = this.selectedBrand();
    const priceRange = this.selectedPriceRange();
    const rating = this.minRating();
    const sort = this.sortBy();

    const matches = this.catalog.activeProducts().filter((p) => {
      if (category !== 'all' && p.categorySlug !== category) return false;
      if (brand !== 'all' && p.brand !== brand) return false;
      if (p.rating < rating) return false;

      if (priceRange === 'under-100k' && p.price >= 100000) return false;
      if (priceRange === '100k-300k' && (p.price < 100000 || p.price > 300000)) return false;
      if (priceRange === 'above-300k' && p.price <= 300000) return false;

      if (query) {
        const haystack = `${p.name} ${p.brand} ${p.sku} ${p.categoryName}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });

    return [...matches].sort((a, b) => {
      switch (sort) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return Number(b.featured) - Number(a.featured);
      }
    });
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      this.selectedCategory.set(slug ?? 'all');
    });
  }

  protected clearFilters(): void {
    this.catalog.searchQuery.set('');
    this.selectedCategory.set('all');
    this.selectedBrand.set('all');
    this.selectedPriceRange.set('all');
    this.minRating.set(0);
    this.sortBy.set('featured');
  }

  protected handleAddToCart(product: Product): void {
    if (!this.auth.isBuyerSignedIn()) {
      this.auth.openGoogleSignIn(() => {
        this.cart.addItem(product, 1);
        this.showFeedback(`Added ${product.name} to your cart.`);
      });
      return;
    }
    this.cart.addItem(product, 1);
    this.showFeedback(`Added ${product.name} to your cart.`);
  }

  private showFeedback(message: string): void {
    this.cartFeedback.set(message);
    setTimeout(() => {
      if (this.cartFeedback() === message) {
        this.cartFeedback.set('');
      }
    }, 3000);
  }
}

