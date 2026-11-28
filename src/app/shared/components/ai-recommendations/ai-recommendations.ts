import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AiAssistantService } from '../../../core/services/ai-assistant.service';
import { RatingStarsComponent } from '../rating-stars/rating-stars';

@Component({
  selector: 'app-ai-recommendations',
  standalone: true,
  imports: [RouterLink, DecimalPipe, RatingStarsComponent],
  templateUrl: './ai-recommendations.html',
  styleUrl: './ai-recommendations.scss',
})
export class AiRecommendationsComponent {
  private readonly ai = inject(AiAssistantService);

  readonly categorySlug = input<string>('all');
  readonly excludeProductId = input<string>('');
  readonly heading = input<string>('AI Recommended Electronics');

  protected readonly recommendations = computed(() =>
    this.ai.getRecommendations(this.categorySlug(), this.excludeProductId()),
  );
}

