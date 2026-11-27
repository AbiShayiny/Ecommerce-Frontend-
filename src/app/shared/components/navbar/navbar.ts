import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { CatalogService } from '../../../core/services/catalog.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent {
  protected readonly auth = inject(AuthService);
  protected readonly cart = inject(CartService);
  protected readonly catalog = inject(CatalogService);
  private readonly router = inject(Router);

  protected readonly mobileMenuOpen = signal(false);
  protected readonly searchTerm = signal('');

  protected onSearch(): void {
    this.catalog.searchQuery.set(this.searchTerm().trim());
    this.mobileMenuOpen.set(false);
    void this.router.navigate(['/products']);
  }

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}

