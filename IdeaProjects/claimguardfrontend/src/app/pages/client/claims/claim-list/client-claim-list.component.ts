import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClaimsService, ClaimResponse } from '../../../../services/claims.service';

@Component({
  selector: 'app-client-claim-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-claim-list.component.html',
  styleUrls: ['./client-claim-list.component.css'],
})
export class ClientClaimListComponent implements OnInit {
  loading = true;
  error: string | null = null;
  claims: ClaimResponse[] = [];

  constructor(private claimsService: ClaimsService) {}

  ngOnInit(): void { this.load(); }

  load() {
    this.loading = true;
    this.error = null;

    this.claimsService.getMyClaims().subscribe({
      next: (data) => { this.claims = data; this.loading = false; },
      error: () => {
        this.claimsService.getMyClaimsFallback().subscribe({
          next: (data) => { this.claims = data; this.loading = false; },
          error: (err2) => { this.error = err2?.error?.message || 'Failed to load'; this.loading = false; }
        });
      }
    });
  }
}
