import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.services';
import { Size } from '../shared/Size';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-screen',
  templateUrl: './view-screen.component.html',
  styleUrls: ['./view-screen.component.scss']
})
export class ViewScreenComponent implements OnInit {
sizes: Size[]=[]
constructor(private dataService: DataService, private router: Router) {}
ngOnInit(): void {
  this.getSizes();
  console.log(this.sizes);
}
getSizes() {
  this.dataService.GetSizes().subscribe((result: any[]) => {
    console.log(result);
    let sizeList: any[] = result;
    sizeList.forEach((element) => {
      this.sizes.push(element);
    });
  });
}
deleteSize(size: Size) {
  console.log(size);
  this.dataService.DeleteSize(size.sizeID).subscribe((x: any) => {
    this.sizes = this.sizes.filter(y => y.sizeID !== size.sizeID);
    console.log("Button clicked")
  });
}
}
