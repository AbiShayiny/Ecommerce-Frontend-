import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../../core/models';
import { AuthService } from '../../../../core/services/auth.service';
import { CartService } from '../../../../core/services/cart.service';
import { CatalogService } from '../../../../core/services/catalog.service';
import { AiRecommendationsComponent } from '../../../../shared/components/ai-recommendations/ai-recommendations';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ProductCardComponent, AiRecommendationsComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  protected readonly catalog = inject(CatalogService);
  protected readonly cart = inject(CartService);
  protected readonly auth = inject(AuthService);

  protected readonly cartFeedback = signal<string>('');

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

