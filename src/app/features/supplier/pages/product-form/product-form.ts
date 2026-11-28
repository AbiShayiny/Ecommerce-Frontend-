import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CatalogService } from '../../../../core/services/catalog.service';

const BLOCKED_KEYWORDS = ['clothing', 'saree', 'sarees', 'cosmetic', 'cosmetics', 'makeup', 'dress', 'shirt', 'shoes', 'apparel'];

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductFormComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  protected readonly catalog = inject(CatalogService);

  protected readonly editId = signal<string | null>(null);
  protected readonly name = signal('');
  protected readonly categoryId = signal('cat-laptops');
  protected readonly brand = signal('');
  protected readonly modelNumber = signal('');
  protected readonly sku = signal('');
  protected readonly shortDescription = signal('');
  protected readonly specifications = signal('');
  protected readonly price = signal<number>(0);
  protected readonly discountPrice = signal<number | null>(null);
  protected readonly stock = signal<number>(1);
  protected readonly imageUrl = signal('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80');
  protected readonly warranty = signal('1 Year Official Warranty');

  protected readonly error = signal('');
  protected readonly success = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const existing = this.catalog.getProductById(id);
      if (existing) {
        this.editId.set(id);
        this.name.set(existing.name);
        this.categoryId.set(existing.categoryId);
        this.brand.set(existing.brand);
        this.modelNumber.set(existing.modelNumber ?? existing.sku);
        this.sku.set(existing.sku);
        this.shortDescription.set(existing.shortDescription);
        this.specifications.set(
          Object.entries(existing.specs)
            .map(([k, v]) => `${k}: ${v}`)
            .join('\n'),
        );
        this.price.set(existing.price);
        this.discountPrice.set(existing.discountPrice ?? null);
        this.stock.set(existing.stock);
        this.imageUrl.set(existing.imageUrl);
        this.warranty.set(existing.warranty ?? '1 Year Official Warranty');
      }
    }
  }

  protected save(): void {
    const prodName = this.name().trim();
    const desc = this.shortDescription().trim();
    const combinedText = `${prodName} ${desc}`.toLowerCase();

    if (BLOCKED_KEYWORDS.some((kw) => combinedText.includes(kw))) {
      this.error.set('Only electronics products are allowed. Unrelated categories (clothing, sarees, cosmetics, makeup) are rejected.');
      return;
    }

    if (!prodName || !this.brand().trim() || !this.sku().trim() || !desc || this.price() <= 0 || this.stock() < 0) {
      this.error.set('Please complete all required electronics fields with a valid price (> 0) and non-negative stock.');
      return;
    }

    const category = this.catalog.categories().find((c) => c.id === this.categoryId());
    if (!category) {
      this.error.set('Please select a valid electronics category.');
      return;
    }

    const specs: Record<string, string> = {};
    this.specifications()
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .forEach((line) => {
        const [k, ...rest] = line.split(':');
        if (k && rest.length) specs[k.trim()] = rest.join(':').trim();
      });
    if (this.warranty().trim()) {
      specs['Warranty'] = this.warranty().trim();
    }

    this.error.set('');
    const id = this.editId();
    if (id) {
      this.catalog.updateProduct(id, {
        name: prodName,
        categoryId: category.id,
        categoryName: category.name,
        categorySlug: category.slug,
        brand: this.brand().trim(),
        modelNumber: this.modelNumber().trim(),
        sku: this.sku().trim(),
        shortDescription: desc,
        specs,
        price: Number(this.price()),
        discountPrice: this.discountPrice() ? Number(this.discountPrice()) : undefined,
        stock: Number(this.stock()),
        imageUrl: this.imageUrl().trim(),
        gallery: [this.imageUrl().trim()],
        warranty: this.warranty().trim(),
      });
      this.success.set('Product updated successfully.');
    } else {
      const sup = this.auth.currentSupplier();
      this.catalog.addProduct({
        name: prodName,
        categoryId: category.id,
        categoryName: category.name,
        categorySlug: category.slug,
        brand: this.brand().trim(),
        modelNumber: this.modelNumber().trim(),
        sku: this.sku().trim(),
        supplierId: sup?.id ?? 'sup-01',
        supplierName: sup?.businessName ?? 'Supplier',
        shortDescription: desc,
        specs,
        price: Number(this.price()),
        discountPrice: this.discountPrice() ? Number(this.discountPrice()) : undefined,
        stock: Number(this.stock()),
        imageUrl: this.imageUrl().trim(),
        gallery: [this.imageUrl().trim()],
        warranty: this.warranty().trim(),
        pickupBranches: ['branch-colombo-01'],
        featured: false,
        active: false,
        approvalStatus: 'Pending',
      });
      this.success.set('Product submitted with Pending Approval status.');
    }

    setTimeout(() => void this.router.navigate(['/supplier/products']), 700);
  }
}

