import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-google-signin-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './google-signin-modal.html',
  styleUrl: './google-signin-modal.scss',
})
export class GoogleSignInModalComponent {
  protected readonly auth = inject(AuthService);
  protected readonly customEmail = signal('kasun.perera@gmail.com');
  protected readonly customName = signal('Kasun Perera');

  protected signInWithDefault(): void {
    this.auth.signInBuyerWithGoogle(this.customEmail(), this.customName());
  }

  protected close(): void {
    this.auth.closeGoogleSignIn();
  }
}

