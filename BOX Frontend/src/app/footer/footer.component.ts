import { Component, OnInit } from '@angular/core';

declare const google: any;

@Component({
  selector: '.app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})

 
export class FooterComponent implements OnInit {
  ngOnInit(): void {
    // Replace with your company's latitude and longitude
    const companyLatLng = { lat: -25.83431833828154, lng: 28.101372737768447 };

    const map = new google.maps.Map(document.getElementById('map'), {
      center: companyLatLng,
      zoom: 15,
    });

    const marker = new google.maps.Marker({
      position: companyLatLng,
      map: map,
      title: 'Company Location',
    });
  }
}
