import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorised',
  templateUrl: './unauthorised.page.html',
  styleUrls: ['./unauthorised.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class UnauthorisedPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  redirectToLogin() {
    this.router.navigateByUrl('/login');
    localStorage.clear();
  }


}
