import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.scss',
})
export class StatusBadgeComponent {
  readonly status = input.required<string>();

  protected readonly tone = computed(() => {
    const val = this.status().toLowerCase();
    if (
      val.includes('approved') ||
      val.includes('verified') ||
      val.includes('collected') ||
      val.includes('confirmed') ||
      val === 'active'
    ) {
      return 'success';
    }
    if (
      val.includes('pending') ||
      val.includes('submitted') ||
      val.includes('ready')
    ) {
      return 'warning';
    }
    if (
      val.includes('rejected') ||
      val.includes('flagged') ||
      val.includes('cancelled') ||
      val.includes('suspended') ||
      val.includes('hidden')
    ) {
      return 'danger';
    }
    return 'info';
  });
}

