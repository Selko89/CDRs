import { Component, OnInit, Inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { OrganizationService, Organization } from '../../core/services/organization.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-organization',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    FormsModule,
    HttpClientModule,
    NgIf
  ],
  template: `
    <div class="organization-container">
      <h2>Organizations</h2>
      <button mat-raised-button color="primary" class="create-button" *ngIf="authService.isLoggedIn && authService.hasAnyRole(['SuperAdmin'])" (click)="openCreateDialog()">Create New</button>
      <table mat-table [dataSource]="organizations" class="mat-elevation-z8">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let org">{{ org.name }}</td>
        </ng-container>
        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef>Email</th>
          <td mat-cell *matCellDef="let org">{{ org.email }}</td>
        </ng-container>
        <ng-container matColumnDef="phoneNumber">
          <th mat-header-cell *matHeaderCellDef>Phone Number</th>
          <td mat-cell *matCellDef="let org">{{ org.phoneNumber }}</td>
        </ng-container>
        <ng-container matColumnDef="adress">
          <th mat-header-cell *matHeaderCellDef>Address</th>
          <td mat-cell *matCellDef="let org">{{ org.adress }}</td>
        </ng-container>
        <ng-container matColumnDef="postCode">
          <th mat-header-cell *matHeaderCellDef>Post Code</th>
          <td mat-cell *matCellDef="let org">{{ org.postCode }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let org">
            <button mat-icon-button *ngIf="authService.isLoggedIn && authService.hasAnyRole(['SuperAdmin'])" (click)="openEditDialog(org)" title="Edit">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button *ngIf="authService.isLoggedIn && authService.hasAnyRole(['SuperAdmin'])" (click)="deleteOrganization(org.organizationId)" title="Delete">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styleUrls: ['./organization.scss']
})
export class OrganizationComponent implements OnInit {
  organizations: Organization[] = [];
  displayedColumns: string[] = ['name', 'email', 'phoneNumber', 'adress', 'postCode', 'actions'];

  constructor(
    private organizationService: OrganizationService,
    public authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('Sjekk her');
    console.log(this.authService.getUserRoles());
    console.log(this.authService.isLoggedIn);
    console.log(this.authService.hasAnyRole(['SuperAdmin']));
    this.loadOrganizations();
  }

  loadOrganizations(): void {
    this.organizationService.getAllOrganizations().subscribe({
      next: (orgs) => this.organizations = orgs,
      error: (err) => {
        console.error('Error loading organizations:', err);
        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else if (err.status === 403) {
          this.router.navigate(['/unauthorized']);
        }
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(OrganizationDialogComponent, {
      width: '400px',
      data: { organization: { organizationId: 0, name: '', email: '', phoneNumber: '', adress: '', postCode: '' } }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.organizationService.createOrganization(result).subscribe({
          next: () => this.loadOrganizations(),
          error: (err) => console.error('Error creating organization:', err)
        });
      }
    });
  }

  openEditDialog(org: Organization): void {
    const dialogRef = this.dialog.open(OrganizationDialogComponent, {
      width: '400px',
      data: { organization: { ...org } }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.organizationService.updateOrganization(result).subscribe({
          next: () => this.loadOrganizations(),
          error: (err) => console.error('Error updating organization:', err)
        });
      }
    });
  }

  deleteOrganization(id: number): void {
    if (confirm('Are you sure you want to delete this organization?')) {
      this.organizationService.deleteOrganization(id).subscribe({
        next: () => this.loadOrganizations(),
        error: (err) => console.error('Error deleting organization:', err)
      });
    }
  }
}

@Component({
  selector: 'app-organization-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.organization.organizationId ? 'Edit Organization' : 'Create Organization' }}</h2>
    <mat-dialog-content>
      <form #orgForm="ngForm">
        <mat-form-field appearance="fill">
          <mat-label>Name</mat-label>
          <input matInput [(ngModel)]="data.organization.name" name="name" required>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Email</mat-label>
          <input matInput [(ngModel)]="data.organization.email" name="email" type="email" required>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Phone Number</mat-label>
          <input matInput [(ngModel)]="data.organization.phoneNumber" name="phoneNumber">
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Address</mat-label>
          <input matInput [(ngModel)]="data.organization.adress" name="adress">
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Post Code</mat-label>
          <input matInput [(ngModel)]="data.organization.postCode" name="postCode">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-button [disabled]="!orgForm.valid" (click)="dialogRef.close(data.organization)">Save</button>
    </mat-dialog-actions>
  `
})
export class OrganizationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<OrganizationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { organization: Organization }
  ) {}
}