import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClaimsService, ClaimResponse } from '../../../services/claims.service';
import { UserService, UserResponse, UserCreateRequest, AdminUserUpdateRequest, UserRole } from '../../../services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  // claims
  loading = true;
  error: string | null = null;
  claims: ClaimResponse[] = [];

  // users
  usersLoading = true;
  usersError: string | null = null;
  users: UserResponse[] = [];

  // create user form
  showCreateForm = false;
  createForm: UserCreateRequest = { name: '', email: '', password: '', role: 'CLIENT' };
  createError: string | null = null;
  createLoading = false;

  // edit user
  editingUser: UserResponse | null = null;
  editForm: AdminUserUpdateRequest = {};
  editError: string | null = null;
  editLoading = false;

  constructor(
    private claimsService: ClaimsService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadClaims();
    this.loadUsers();
  }

  loadClaims() {
    this.claimsService.getAllClaims().subscribe({
      next: (data) => { this.claims = data; this.loading = false; this.cdr.detectChanges(); },
      error: (err) => { this.error = err?.error?.message || 'Failed to load'; this.loading = false; this.cdr.detectChanges(); }
    });
  }

  loadUsers() {
    this.usersLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => { this.users = data; this.usersLoading = false; this.cdr.detectChanges(); },
      error: (err) => { this.usersError = err?.error?.message || 'Failed to load users'; this.usersLoading = false; this.cdr.detectChanges(); }
    });
  }

  count(s: 'PENDING' | 'APPROVED' | 'REJECTED') {
    return this.claims.filter(c => c.status === s).length;
  }

  // --- Create User ---
  openCreateForm() {
    this.showCreateForm = true;
    this.createForm = { name: '', email: '', password: '', role: 'CLIENT' };
    this.createError = null;
  }

  submitCreate() {
    this.createLoading = true;
    this.createError = null;
    this.userService.createUser(this.createForm).subscribe({
      next: () => {
        this.createLoading = false;
        this.showCreateForm = false;
        this.loadUsers();
      },
      error: (err) => {
        this.createError = err?.error?.message || 'Failed to create user';
        this.createLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // --- Edit User ---
  openEdit(user: UserResponse) {
    this.editingUser = user;
    this.editForm = { name: user.name, email: user.email, role: user.role };
    this.editError = null;
  }

  submitEdit() {
    if (!this.editingUser) return;
    this.editLoading = true;
    this.editError = null;
    this.userService.updateUser(this.editingUser.id, this.editForm).subscribe({
      next: () => {
        this.editLoading = false;
        this.editingUser = null;
        this.loadUsers();
      },
      error: (err) => {
        this.editError = err?.error?.message || 'Failed to update user';
        this.editLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  cancelEdit() { this.editingUser = null; }

  // --- Delete User ---
  deleteUser(id: number) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    this.userService.deleteUser(id).subscribe({
      next: () => this.loadUsers(),
      error: (err) => { alert(err?.error?.message || 'Failed to delete user'); }
    });
  }
}
