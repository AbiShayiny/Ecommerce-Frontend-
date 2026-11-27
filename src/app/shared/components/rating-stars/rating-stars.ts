import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-rating-stars',
  standalone: true,
  templateUrl: './rating-stars.html',
  styleUrl: './rating-stars.scss',
})
export class RatingStarsComponent {
  readonly rating = input<number>(0);
  readonly reviewCount = input<number | null>(null);
  readonly interactive = input<boolean>(false);
  readonly ratingChange = output<number>();

  protected readonly stars = [1, 2, 3, 4, 5];

  protected selectStar(star: number): void {
    if (this.interactive()) {
      this.ratingChange.emit(star);
    }
  }
}

