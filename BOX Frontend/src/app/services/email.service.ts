import { Injectable } from '@angular/core';
import { DataService } from './data.services';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private dataService: DataService) { }

  sendEmail(targetEmailAddress: string, subject: string, body: string) {
    let email: EmailVM = {
      targetEmailAddress: targetEmailAddress,
      subject: subject,
      body: body
    }

    this.dataService.SendEmail(email).subscribe((result) => {
      console.log('Did email send?', result);
    });
  }
}

interface EmailVM {
  targetEmailAddress: string;
  subject: string;
  body: string; //in HTML format. But no external stylesheets please! Just use a style tag
}
