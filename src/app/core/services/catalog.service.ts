import { Injectable, computed, signal } from '@angular/core';
import { MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_REVIEWS } from '../data/mock-data';
import { Category, Product, ProductReview } from '../models';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  readonly categories = signal<Category[]>([...MOCK_CATEGORIES]);
  readonly products = signal<Product[]>([...MOCK_PRODUCTS]);
  readonly reviews = signal<ProductReview[]>([...MOCK_REVIEWS]);
  readonly searchQuery = signal<string>('');

  readonly activeCategories = computed(() =>
    this.categories().filter((c) => c.active),
  );

  readonly activeProducts = computed(() =>
    this.products().filter(
      (p) => p.active && p.approvalStatus !== 'Pending' && p.approvalStatus !== 'Rejected',
    ),
  );

  readonly featuredProducts = computed(() =>
    this.activeProducts().filter((p) => p.featured),
  );

  getProductById(id: string): Product | undefined {
    return this.products().find((p) => p.id === id);
  }

  getReviewsForProduct(productId: string): ProductReview[] {
    return this.reviews().filter(
      (r) => r.productId === productId && r.status === 'Approved',
    );
  }

  addProduct(product: Omit<Product, 'id' | 'rating' | 'reviewCount' | 'createdAt'>): Product {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    this.products.update((list) => [newProduct, ...list]);
    return newProduct;
  }

  updateProduct(id: string, patch: Partial<Product>): void {
    this.products.update((list) =>
      list.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    );
  }

  toggleProductActive(id: string): void {
    this.products.update((list) =>
      list.map((p) => (p.id === id ? { ...p, active: !p.active } : p)),
    );
  }

  deleteProduct(id: string): void {
    this.products.update((list) => list.filter((p) => p.id !== id));
  }

  updateStock(id: string, stock: number): void {
    const safeStock = Math.max(0, Math.floor(stock));
    this.products.update((list) =>
      list.map((p) => (p.id === id ? { ...p, stock: safeStock } : p)),
    );
  }

  addCategory(category: Omit<Category, 'id' | 'productCount'>): void {
    const created: Category = {
      ...category,
      id: `cat-${Date.now()}`,
      productCount: 0,
    };
    this.categories.update((list) => [...list, created]);
  }

  toggleCategoryActive(id: string): void {
    this.categories.update((list) =>
      list.map((c) => (c.id === id ? { ...c, active: !c.active } : c)),
    );
  }

  updateCategory(id: string, patch: Partial<Category>): void {
    this.categories.update((list) =>
      list.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    );
  }

  deleteCategory(id: string): boolean {
    const hasProducts = this.products().some((p) => p.categoryId === id);
    if (hasProducts) return false;
    this.categories.update((list) => list.filter((c) => c.id !== id));
    return true;
  }

  approveProduct(id: string): void {
    this.products.update((list) =>
      list.map((p) =>
        p.id === id
          ? { ...p, approvalStatus: 'Active', active: true, rejectionReason: undefined }
          : p,
      ),
    );
  }

  rejectProduct(id: string, reason: string): void {
    this.products.update((list) =>
      list.map((p) =>
        p.id === id
          ? { ...p, approvalStatus: 'Rejected', active: false, rejectionReason: reason }
          : p,
      ),
    );
  }

  removeReview(id: string): void {
    this.reviews.update((list) => list.filter((r) => r.id !== id));
  }

  addReview(review: Omit<ProductReview, 'id' | 'status' | 'createdAt'>): void {
    const created: ProductReview = {
      ...review,
      id: `rev-${Date.now()}`,
      status: 'Approved',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    this.reviews.update((list) => [created, ...list]);
  }

  setReviewStatus(id: string, status: 'Approved' | 'Hidden'): void {
    this.reviews.update((list) =>
      list.map((r) => (r.id === id ? { ...r, status } : r)),
    );
  }
}

