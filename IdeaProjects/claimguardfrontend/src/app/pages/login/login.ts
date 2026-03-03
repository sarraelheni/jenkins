import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    this.loading = true;
    this.error = null;

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        const role = this.auth.currentUser?.role;

        this.loading = false;

        if (role === 'CLIENT') this.router.navigateByUrl('/client');
        else if (role === 'AGENT') this.router.navigateByUrl('/agent');
        else if (role === 'ADMIN') this.router.navigateByUrl('/admin');
        else {
          this.error = `Unknown role: ${role}`;
          this.router.navigateByUrl('/login');
        }
      },
      error: (err: any) => {
        console.log('LOGIN ERROR (full):', err);
        this.loading = false;
        this.error = err?.error?.message || err?.message || 'Login failed';
      },
    });
  }
}
