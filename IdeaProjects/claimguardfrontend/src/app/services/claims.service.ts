// src/app/services/claims.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

// --- Types (match your Spring DTO response) ---
export type ClaimStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ClaimUser {
  id?: number;
  email?: string;
  fullName?: string;
}

export interface ClaimResponse {
  id: number;
  title: string;
  description: string;
  status: ClaimStatus;
  type: string;

  // requested amount
  amount: number;

  // agent decision fields (if you added them in backend)
  approvedAmount?: number | null;
  decisionComment?: string | null;

  // AI fields (optional)
  riskScore?: number | null;
  fraudSuspected?: boolean | null;

  // owner
  user?: ClaimUser | null;

  // dates (optional depending on backend)
  createdAt?: string;
  updatedAt?: string | null;
}

export interface ClaimCreateRequest {
  title: string;
  description: string;
  amount: number;
  type: string; // 'AUTO' | 'HEALTH' | 'HOME' | 'OTHER' ... (keep string)
}

export interface ClaimUpdateRequest {
  title?: string | null;
  description?: string | null;
  amount?: number | null;
  type?: string | null;
}

// Your backend uses status in decision request (APPROVED/REJECTED)
// plus approvedAmount/comment if you implemented them
export interface ClaimDecisionRequest {
  status: 'APPROVED' | 'REJECTED';
  approvedAmount?: number; // required if APPROVED
  comment?: string;        // required if REJECTED
}

@Injectable({ providedIn: 'root' })
export class ClaimsService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // -------------------------
  // Helpers
  // -------------------------
  private getCurrentUserEmailFromStorage(): string {
    const raw = localStorage.getItem('user');
    if (!raw) return '';
    try {
      const u = JSON.parse(raw);
      return (u?.email || '').toLowerCase();
    } catch {
      return '';
    }
  }

  // -------------------------
  // Client / Common
  // -------------------------
  createClaim(body: ClaimCreateRequest): Observable<ClaimResponse> {
    return this.http.post<ClaimResponse>(`${this.base}/api/claims`, body);
  }

  getAllClaims(): Observable<ClaimResponse[]> {
    return this.http.get<ClaimResponse[]>(`${this.base}/api/claims`);
  }

  getClaimById(id: number): Observable<ClaimResponse> {
    return this.http.get<ClaimResponse>(`${this.base}/api/claims/${id}`);
  }

  updateClaim(id: number, body: ClaimUpdateRequest): Observable<ClaimResponse> {
    return this.http.put<ClaimResponse>(`${this.base}/api/claims/${id}`, body);
  }

  deleteClaim(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/api/claims/${id}`);
  }

  // -------------------------
  // Client: "My claims"
  // -------------------------
  // ✅ Use this if you add backend endpoint GET /api/claims/my
  getMyClaims(): Observable<ClaimResponse[]> {
    return this.http.get<ClaimResponse[]>(`${this.base}/api/claims/my`);
  }

  // ✅ Temporary fallback if /my does not exist
  getMyClaimsFallback(): Observable<ClaimResponse[]> {
    const email = this.getCurrentUserEmailFromStorage();

    return this.getAllClaims().pipe(
      map((list: ClaimResponse[]) =>
        list.filter((c) => (c.user?.email || '').toLowerCase() === email)
      )
    );
  }

  // -------------------------
  // Agent: Pending claims
  // -------------------------
  getPendingClaims(): Observable<ClaimResponse[]> {
    return this.getAllClaims().pipe(
      map((list: ClaimResponse[]) => list.filter((c) => c.status === 'PENDING'))
    );
  }

  // (Optional) filter by status locally
  getClaimsByStatus(status: ClaimStatus): Observable<ClaimResponse[]> {
    return this.getAllClaims().pipe(
      map((list: ClaimResponse[]) => list.filter((c) => c.status === status))
    );
  }

  // -------------------------
  // Agent: Review (approve/reject)
  // -------------------------
  reviewClaim(id: number, body: ClaimDecisionRequest): Observable<ClaimResponse> {
    return this.http.put<ClaimResponse>(`${this.base}/api/claims/${id}/review`, body);
  }
}
