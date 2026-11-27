import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PortalService } from '../../../../core/services/portal.service';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-admin-notifications',
  standalone: true,
  imports: [FormsModule, StatusBadgeComponent],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
})
export class AdminNotificationsComponent {
  protected readonly portal = inject(PortalService);

  protected readonly title = signal('');
  protected readonly message = signal('');
  protected readonly audience = signal<'supplier' | 'buyer' | 'all'>('supplier');
  protected readonly feedback = signal('');

  protected sendNotification(): void {
    if (!this.title().trim() || !this.message().trim()) {
      this.feedback.set('Title and message are required.');
      return;
    }

    this.portal.addNotification({
      recipientRole: this.audience(),
      title: this.title().trim(),
      message: this.message().trim(),
      type: 'info',
    });
    this.title.set('');
    this.message.set('');
    this.feedback.set('Mock notification recorded in notification history.');
  }
}

