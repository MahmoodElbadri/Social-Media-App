import {Component, inject, input, OnInit} from '@angular/core';
import {Member} from "../../_models/member";
import {DecimalPipe, NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {FileUploader, FileUploadModule} from "ng2-file-upload";
import {AccountService} from "../../_services/account.service";
import {environment} from "../../../environments/environment.development";

@Component({
  selector: 'app-photo-editor',
  standalone: true,
  imports: [
    NgClass,
    NgForOf,
    NgIf,
    NgStyle,
    DecimalPipe,
    FileUploadModule
  ],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.css'
})
export class PhotoEditorComponent implements OnInit {

  private accountService = inject(AccountService);
  uploader?: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  member = input<Member>();

  ngOnInit(): void {
    
  }
}
