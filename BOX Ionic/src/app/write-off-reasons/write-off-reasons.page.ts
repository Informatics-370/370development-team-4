import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-write-off-reasons',
  templateUrl: './write-off-reasons.page.html',
  styleUrls: ['./write-off-reasons.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class WriteOffReasonsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
