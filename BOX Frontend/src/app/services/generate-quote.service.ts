import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenerateQuoteService {
  private selectedQrID = new BehaviorSubject<number>(0);
  public quoteRequestID: Observable<number> = this.selectedQrID.asObservable();
  private modalResult = new BehaviorSubject<boolean>(false);
  public result: Observable<boolean> = this.modalResult.asObservable();

  constructor() { }

  setQuoteRequestID(id: number) {
    this.selectedQrID.next(id);
  }

  setResult(result: boolean) {
    this.modalResult.next(result);
  }
}
