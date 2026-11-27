import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../../../core/services/catalog.service';
import { RatingStarsComponent } from '../../../../shared/components/rating-stars/rating-stars';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [FormsModule, RatingStarsComponent, StatusBadgeComponent],
  templateUrl: './reviews.html',
  styleUrl: './reviews.scss',
})
export class AdminReviewsComponent {
  protected readonly catalog = inject(CatalogService);

  protected readonly search = signal('');
  protected readonly statusFilter = signal('all');

  protected readonly filteredReviews = computed(() => {
    const q = this.search().trim().toLowerCase();
    const st = this.statusFilter();
    return this.catalog.reviews().filter((r) => {
      if (st !== 'all' && r.status !== st) return false;
      if (q && !`${r.buyerName} ${r.comment} ${this.productName(r.productId)}`.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  });

  protected productName(productId: string): string {
    return this.catalog.getProductById(productId)?.name ?? productId;
  }
}

