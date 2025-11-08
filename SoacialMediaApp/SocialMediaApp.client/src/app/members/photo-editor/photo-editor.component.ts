import {Component, inject, input, OnInit, output} from '@angular/core';
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
  memberChange = output<Member>();

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      authToken: 'Bearer ' + this.accountService.currentUser()?.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });


    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo = JSON.parse(response);
        const currentMember = this.member();
        if (!currentMember) return; // Add null check

        const updatedMember: Member = {
          ...currentMember,
          photos: [...(currentMember.photos || []), photo]
        };

        this.memberChange.emit(updatedMember);
      }
    };
  }
}
