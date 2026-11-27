import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../../../../core/models';
import { AuthService } from '../../../../core/services/auth.service';
import { CartService } from '../../../../core/services/cart.service';
import { CatalogService } from '../../../../core/services/catalog.service';
import { AiProductAssistantComponent } from '../../../../shared/components/ai-product-assistant/ai-product-assistant';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card';
import { RatingStarsComponent } from '../../../../shared/components/rating-stars/rating-stars';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    RouterLink,
    DecimalPipe,
    RatingStarsComponent,
    ProductCardComponent,
    EmptyStateComponent,
    AiProductAssistantComponent,
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catalog = inject(CatalogService);
  private readonly cart = inject(CartService);
  private readonly auth = inject(AuthService);

  protected readonly productId = signal<string>('');
  protected readonly selectedImage = signal<string>('');
  protected readonly quantity = signal<number>(1);
  protected readonly cartFeedback = signal<string>('');

  protected readonly product = computed(() =>
    this.catalog.getProductById(this.productId()),
  );

  protected readonly galleryImages = computed(() => {
    const p = this.product();
    if (!p) return [];
    return p.gallery.length > 0 ? p.gallery : [p.imageUrl];
  });

  protected readonly specEntries = computed(() => {
    const p = this.product();
    return p ? Object.entries(p.specs) : [];
  });

  protected readonly availableBranches = computed(() => {
    const p = this.product();
    if (!p) return [];
    return this.cart.branches().filter((b) => p.pickupBranches.includes(b.id));
  });

  protected readonly reviews = computed(() => {
    const p = this.product();
    return p ? this.catalog.getReviewsForProduct(p.id) : [];
  });

  protected readonly relatedProducts = computed(() => {
    const p = this.product();
    if (!p) return [];
    return this.catalog
      .activeProducts()
      .filter((item) => item.categoryId === p.categoryId && item.id !== p.id)
      .slice(0, 4);
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id') ?? '';
      this.productId.set(id);
      const found = this.catalog.getProductById(id);
      this.selectedImage.set(found?.imageUrl ?? '');
      this.quantity.set(1);
    });
  }

  protected selectImage(url: string): void {
    this.selectedImage.set(url);
  }

  protected decrementQty(): void {
    this.quantity.update((q) => Math.max(1, q - 1));
  }

  protected incrementQty(): void {
    const max = this.product()?.stock ?? 1;
    this.quantity.update((q) => Math.min(max, q + 1));
  }

  protected handleAddToCart(product: Product, qty = this.quantity()): void {
    if (!this.auth.isBuyerSignedIn()) {
      this.auth.openGoogleSignIn(() => {
        this.cart.addItem(product, qty);
        this.showFeedback(`Added ${qty} × ${product.name} to your cart.`);
      });
      return;
    }
    this.cart.addItem(product, qty);
    this.showFeedback(`Added ${qty} × ${product.name} to your cart.`);
  }

  protected backToShop(): void {
    void this.router.navigate(['/products']);
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

