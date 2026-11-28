import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class AdminLoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly email = signal('admin@bidlify.lk');
  protected readonly password = signal('Admin@2026');
  protected readonly error = signal('');

  protected login(): void {
    if (!this.email().trim() || !this.password().trim()) {
      this.error.set('Please enter both Admin email and password.');
      return;
    }

    const res = this.auth.loginAdmin(this.email(), this.password());
    if (!res.ok) {
      this.error.set(res.message);
      return;
    }

    this.error.set('');
    void this.router.navigate(['/admin/dashboard']);
  }
}

