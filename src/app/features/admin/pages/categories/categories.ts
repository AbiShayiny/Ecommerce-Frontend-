import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category } from '../../../../core/models';
import { CatalogService } from '../../../../core/services/catalog.service';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';

const NON_ELECTRONICS = ['clothing', 'saree', 'sarees', 'cosmetics', 'makeup', 'apparel', 'fashion', 'shoes'];

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [FormsModule, StatusBadgeComponent],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class AdminCategoriesComponent {
  protected readonly catalog = inject(CatalogService);

  protected readonly editingId = signal<string | null>(null);
  protected readonly name = signal('');
  protected readonly description = signal('');
  protected readonly message = signal('');
  protected readonly error = signal('');

  protected saveCategory(): void {
    const catName = this.name().trim();
    const catDesc = this.description().trim();
    const text = `${catName} ${catDesc}`.toLowerCase();

    if (NON_ELECTRONICS.some((kw) => text.includes(kw))) {
      this.error.set('Only electronics categories are allowed.');
      return;
    }
    if (!catName || !catDesc) {
      this.error.set('Category name and description are required.');
      return;
    }

    this.error.set('');
    const editId = this.editingId();
    if (editId) {
      this.catalog.updateCategory(editId, { name: catName, description: catDesc });
      this.message.set('Category updated.');
    } else {
      this.catalog.addCategory({
        name: catName,
        slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: catDesc,
        icon: 'cpu',
        active: true,
      });
      this.message.set('Electronics category added.');
    }
    this.resetForm();
  }

  protected edit(cat: Category): void {
    this.editingId.set(cat.id);
    this.name.set(cat.name);
    this.description.set(cat.description);
  }

  protected deleteCat(cat: Category): void {
    const ok = this.catalog.deleteCategory(cat.id);
    if (!ok) {
      this.error.set(`Cannot delete "${cat.name}" while products are assigned to it.`);
      return;
    }
    this.error.set('');
    this.message.set(`Category "${cat.name}" deleted.`);
  }

  protected resetForm(): void {
    this.editingId.set(null);
    this.name.set('');
    this.description.set('');
  }
}

