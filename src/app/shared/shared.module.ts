import { NgModule } from '@angular/core';
import { MatIconModule, MatExpansionModule, MatFormFieldModule, MatInputModule,
         MatButtonModule, MatCardModule, MatDividerModule, MatSelectModule,
         MatSidenavModule, MatListModule, MatSnackBarModule, MatChipsModule,
         MatDialogModule, MatDatepickerModule, MatNativeDateModule, MatTableModule, MatBadgeModule,
         MatTabsModule, MatProgressSpinnerModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DialogPopupComponent } from './dialog-popup/dialog-popup.component';

@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        MatExpansionModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatDividerModule,
        MatSelectModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatListModule,
        MatSnackBarModule,
        HttpClientModule,
        MatDialogModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTableModule,
        MatBadgeModule,
        MatTabsModule,
        MatProgressSpinnerModule
    ],
    exports: [
        CommonModule,
        MatIconModule,
        MatExpansionModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatDividerModule,
        MatSelectModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatListModule,
        MatSnackBarModule,
        HttpClientModule,
        MatChipsModule,
        MatDialogModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTableModule,
        MatBadgeModule,
        MatTabsModule,
        MatProgressSpinnerModule
    ],
    declarations: [DialogPopupComponent],
    entryComponents : [DialogPopupComponent]

})
export class SharedModule { }
