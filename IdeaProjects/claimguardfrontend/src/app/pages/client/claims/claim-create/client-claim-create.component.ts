import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ClaimsService } from '../../../../services/claims.service';

@Component({
  selector: 'app-client-claim-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './client-claim-create.component.html',
  styleUrls: ['./client-claim-create.component.css'],
})
export class ClientClaimCreateComponent {
  title = '';
  description = '';
  amount: number | null = null;
  type = 'AUTO';

  loading = false;
  error: string | null = null;

  constructor(private claimsService: ClaimsService, private router: Router) {}

  submit() {
    this.loading = true;
    this.error = null;

    this.claimsService.createClaim({
      title: this.title,
      description: this.description,
      amount: Number(this.amount || 0),
      type: this.type,
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/client']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Failed to create claim';
      }
    });
  }
}
