import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClaimsService, ClaimResponse } from '../../../services/claims.service';

@Component({
  selector: 'app-agent-claim-review',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './agent-claim-review.component.html',
  styleUrls: ['./agent-claim-review.component.css'],
})
export class AgentClaimReviewComponent implements OnInit {
  id!: number;
  loading = true;
  saving = false;
  error: string | null = null;

  claim: ClaimResponse | null = null;

  decision: 'APPROVED' | 'REJECTED' = 'APPROVED';
  approvedAmount: number | null = null;
  comment = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private claimsService: ClaimsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.claimsService.getClaimById(this.id).subscribe({
      next: (c) => {
        this.claim = c;
        this.approvedAmount = c.amount;
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

  submit() {
    this.error = null;

    if (this.decision === 'APPROVED') {
      if (this.approvedAmount == null || this.approvedAmount <= 0) {
        this.error = 'Approved amount must be > 0';
        return;
      }
    } else {
      if (!this.comment.trim()) {
        this.error = 'Rejection reason is required';
        return;
      }
    }

    this.saving = true;

    const payload: any = { status: this.decision };
    if (this.decision === 'APPROVED') {
      payload.approvedAmount = this.approvedAmount;
      if (this.comment.trim()) payload.comment = this.comment.trim();
    } else {
      payload.comment = this.comment.trim();
    }

    this.claimsService.reviewClaim(this.id, payload).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/agent']);
      },
      error: (err) => {
        this.saving = false;
        this.error = err?.error?.message || 'Failed to submit decision';
        this.cdr.detectChanges();
      }
    });
  }
}
