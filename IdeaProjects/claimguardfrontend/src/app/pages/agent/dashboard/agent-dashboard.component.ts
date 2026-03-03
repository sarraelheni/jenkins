import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClaimsService, ClaimResponse } from '../../../services/claims.service';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.css'],
})
export class AgentDashboardComponent implements OnInit {
  loading = true;
  error: string | null = null;
  pending: ClaimResponse[] = [];

  constructor(
    private claimsService: ClaimsService,
    private cdr: ChangeDetectorRef   // ← add this
  ) {}

  ngOnInit(): void {
    this.claimsService.getAllClaims().subscribe({
      next: (data) => {
        this.pending = data;
        this.loading = false;
        this.cdr.detectChanges();   // ← add this
      },
      error: (err) => {
        this.error = 'Error: ' + JSON.stringify(err);
        this.loading = false;
        this.cdr.detectChanges();   // ← add this
      }
    });
  }
}
