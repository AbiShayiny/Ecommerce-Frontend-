import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../core/models';
import { AiAssistantService } from '../../../core/services/ai-assistant.service';
import { CatalogService } from '../../../core/services/catalog.service';

@Component({
  selector: 'app-ai-product-assistant',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './ai-product-assistant.html',
  styleUrl: './ai-product-assistant.scss',
})
export class AiProductAssistantComponent {
  private readonly ai = inject(AiAssistantService);
  private readonly catalog = inject(CatalogService);

  readonly product = input.required<Product>();

  protected readonly question = signal('');
  protected readonly answer = signal('');
  protected readonly compareId = signal('');

  protected readonly otherProducts = computed(() =>
    this.catalog.activeProducts().filter((p) => p.id !== this.product().id),
  );

  protected readonly comparison = computed(() => {
    const target = this.otherProducts().find((p) => p.id === this.compareId());
    return target ? this.ai.compareProducts(this.product(), target) : null;
  });

  protected ask(q = this.question()): void {
    const text = q.trim();
    if (!text) return;
    this.answer.set(this.ai.answerProductQuestion(this.product(), text));
    if (q === this.question()) {
      this.question.set('');
    }
  }
}

