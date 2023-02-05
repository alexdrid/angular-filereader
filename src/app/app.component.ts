import { ChangeDetectorRef, Component, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-filereader'
  fileReady: boolean;
  fileUploading: boolean;

  onUploadPending(pending: boolean): void {
    this.fileUploading = pending;
  }

  onFileUploaded(uploaded: boolean): void {
    this.fileReady = uploaded;
  }
}
