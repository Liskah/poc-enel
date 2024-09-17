import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';

export type DialogData = { description: string };

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['../sample.css'],
  standalone: true,
  imports: [
    /*
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,*/
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent implements OnInit {
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  description = '';
  readonly dialogRef = inject(MatDialogRef<DialogComponent>);

  ngOnInit() {
    console.log(this.data);
    this.description = this.data.description;
  }

  closeModal() {
    this.dialogRef.close(this.description);
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
