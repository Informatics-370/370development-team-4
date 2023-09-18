import { Injectable } from '@angular/core';
import { DataService } from './data.services';
import { EmailAttachmentVM } from '../shared/email-attachment-vm';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private dataService: DataService) { }

  /*body should contain text in paragraph tags. DON'T add "Kind regards", "Mega Pack", or any other closing greeting. DO NOT
  add "Hi", "Good day user", or any other opening greeting. It will be added by the controller.*/

  /*targetName is the name of the email receiver; will be displayed as "Hi targetName,"
  If name is not known, just say something generic like 'Customer'*/

  /*ALL LINKS (<a> tags) should have the following INLINE STYLES: 
  font-weight: 600; text-decoration: underline; cursor: pointer; color: black; 
  FOR EXAMPLE (you can copy and modify the code below): 
  <a style='font-weight: 600; text-decoration: underline; cursor: pointer; color: black;' href=''>Quotes page</a>
  */

  //View the quote requests page for an example of how to use this email service
  sendEmail(targetEmailAddress: string, subject: string, targetName: string, body: string, attachments?: EmailAttachmentVM[]) {
    try {
      attachments?.forEach(attach => {
        let ext = attach.fileName.slice((attach.fileName.lastIndexOf(".") - 1 >>> 0) + 2); //get extension from filename
  
        if (ext.length < 1) throw 'File name does not contain extension';
      });
  
      let email: EmailVM = {
        targetEmailAddress: targetEmailAddress,
        subject: subject,
        targetName: targetName,
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
  targetName: string;
  body: string; //in HTML format. But no external stylesheets please! Just use a style tag
  attachments: EmailAttachmentVM[]
}
