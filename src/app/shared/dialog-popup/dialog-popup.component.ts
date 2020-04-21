import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-popup',
  templateUrl: './dialog-popup.component.html',
  styleUrls: ['./dialog-popup.component.scss']
})
export class DialogPopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
  }
  close(action) {
    this.dialogRef.close(action);
  }

}
