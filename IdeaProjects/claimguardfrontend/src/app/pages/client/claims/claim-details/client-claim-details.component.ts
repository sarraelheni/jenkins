import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ClaimsService, ClaimResponse } from '../../../../services/claims.service';

@Component({
  selector: 'app-client-claim-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-claim-details.component.html',
  styleUrls: ['./client-claim-details.component.css'],
})
export class ClientClaimDetailsComponent implements OnInit {
  loading = true;
  error: string | null = null;
  claim: ClaimResponse | null = null;

  constructor(
    private route: ActivatedRoute,
    private claimsService: ClaimsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.claimsService.getClaimById(id).subscribe({
      next: (c) => {
        this.claim = c;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to load';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
