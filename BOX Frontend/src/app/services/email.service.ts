import { Injectable } from '@angular/core';
import { DataService } from './data.services';
import { EmailAttachmentVM } from '../shared/email-attachment-vm';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private dataService: DataService) { }

  sendEmail(targetEmailAddress: string, subject: string, body: string, attachments?: EmailAttachmentVM[]) {
    try {
      attachments?.forEach(attach => {
        let ext = attach.fileName.slice((attach.fileName.lastIndexOf(".") - 1 >>> 0) + 2); //get extension from filename
  
        if (ext.length < 1) throw 'File name does not contain extension';
      });
  
      let email: EmailVM = {
        targetEmailAddress: targetEmailAddress,
        subject: subject,
        body: body,
        attachments: attachments ? attachments : []
      }
  
      this.dataService.SendEmail(email).subscribe((result) => {
        console.log('Did email send?', result);
      });
    } catch (error) {
      console.error(error);
    }
  }
}

interface EmailVM {
  targetEmailAddress: string;
  subject: string;
  body: string; //in HTML format. But no external stylesheets please! Just use a style tag
  attachments: EmailAttachmentVM[]
}
