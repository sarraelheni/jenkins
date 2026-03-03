import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClaimsService, ClaimResponse } from '../../../services/claims.service';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css'],
})
export class ClientDashboardComponent implements OnInit {
  loading = true;
  error: string | null = null;
  claims: ClaimResponse[] = [];

  constructor(
    private claimsService: ClaimsService,
    private cdr: ChangeDetectorRef  // ← add this
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = null;

    this.claimsService.getMyClaims().subscribe({
      next: (data) => {
        this.claims = data;
        this.loading = false;
        this.cdr.detectChanges();  // ← add this
      },
      error: () => {
        this.claimsService.getMyClaimsFallback().subscribe({
          next: (data) => {
            this.claims = data;
            this.loading = false;
            this.cdr.detectChanges();  // ← add this
          },
          error: (err2) => {
            this.error = err2?.error?.message || 'Failed to load claims';
            this.loading = false;
            this.cdr.detectChanges();  // ← add this
          }
        });
      }
    });
  }

  count(status: 'PENDING' | 'APPROVED' | 'REJECTED') {
    return this.claims.filter(c => c.status === status).length;
  }
}
