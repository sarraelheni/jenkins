import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export type Role = 'CLIENT' | 'AGENT' | 'ADMIN';

export interface AuthUser {
  id: number;
  email: string;
  role: Role;
  fullName?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = environment.apiBaseUrl;

  private _user$ = new BehaviorSubject<AuthUser | null>(this.getUserFromStorage());
  user$ = this._user$.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post(
      `${this.base}/api/auth/login`,
      { email, password },
      { responseType: 'text' } // ✅ important
    ).pipe(
      tap((raw: string) => {
        // ✅ parse manually
        const res = raw ? JSON.parse(raw) : {};

        const token = (res as any)?.token || (res as any)?.accessToken || (res as any)?.jwt;
        if (token) localStorage.setItem('token', token);

        const rawUser = (res as any)?.user ?? res ?? {};

        const rawRole = String((rawUser as any)?.role ?? '');
        const normalized = rawRole.startsWith('ROLE_') ? rawRole.replace('ROLE_', '') : rawRole;

        const role: Role =
          normalized === 'CLIENT' || normalized === 'AGENT' || normalized === 'ADMIN'
            ? normalized
            : 'CLIENT';

        const user: AuthUser = {
          id: Number((rawUser as any)?.id ?? 0),
          email: String((rawUser as any)?.email ?? ''),
          role,
          fullName: (rawUser as any)?.fullName ?? (rawUser as any)?.name,
        };

        localStorage.setItem('user', JSON.stringify(user));
        this._user$.next(user);
      })
    );
  }
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this._user$.next(null);
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  get currentUser(): AuthUser | null {
    return this._user$.value;
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  hasRole(roles: Role[]): boolean {
    const u = this.currentUser;
    return !!u && roles.includes(u.role);
  }

  private getUserFromStorage(): AuthUser | null {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }
}
