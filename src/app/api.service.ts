import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface ProductData {

  isForAllBranches: boolean;
  serviceStuffId: string;
  taxPayerInternalServiceStuffId: string;
  taxPayerInternalTitle: string;
  
  serviceStuffTitle: string;
  defaultValueOfTaxAndDuties: number;
  defaultTaxAndDutiesSubject: string;
  defaultTaxAndDutiesRate: number;
  defaultValueOfLegalFunds: number;
  defaultLegalFundsSubject: string;
  defaultLegalFundsRate: number;
  defaultFee: number;
  defaultMeasurementUnit: string;
  defaultCurrency: string;
}

@Injectable({
  providedIn: 'root'
})


export class ApiService {

  private apiUrl = 'http://172.18.70.15:20946/api/v1/taxpayer/AddItem'; 

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  
  addProduct(data: ProductData): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const url = `http://172.18.70.15:20946/api/v1/taxpayer/AddItem?userid=4Ow5Fn`;

    return this.http.post<any>(url, data, { headers }).pipe(
      catchError(error => {
        this.showNotification('خطایی در ارسال داده رخ داد', 'error');
        return of(null); 
      })
    );
  }

  public showNotification(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 3000, 
    });
  }
}
