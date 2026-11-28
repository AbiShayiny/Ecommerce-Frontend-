import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
})
export class EmptyStateComponent {
  readonly title = input<string>('Nothing to display');
  readonly description = input<string>('No matching records were found.');
  readonly actionLabel = input<string>('');
  readonly actionClick = output<void>();
}

