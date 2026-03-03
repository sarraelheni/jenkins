import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type UserRole = 'CLIENT' | 'AGENT' | 'ADMIN';

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface UserCreateRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AdminUserUpdateRequest {
  name?: string;
  email?: string;
  role?: UserRole;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.base}/api/users`);
  }

  createUser(body: UserCreateRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.base}/api/users`, body);
  }

  updateUser(id: number, body: AdminUserUpdateRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.base}/api/users/${id}/admin`, body);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/api/users/${id}`);
  }
}
