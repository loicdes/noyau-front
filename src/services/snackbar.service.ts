import { MatSnackBar } from '@angular/material';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
  })
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) { }
  public open(message: string, panelClass: string, pduration = 3000, action = 'X', top = true) {
    this.snackBar.open(message, action, {
        duration: pduration,
        panelClass: [panelClass],
        verticalPosition: top ? 'top' : 'bottom'
    });
  }
}
