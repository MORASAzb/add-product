import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, Validators , ReactiveFormsModule} from '@angular/forms'
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule, MatLabel } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatToolbar } from '@angular/material/toolbar';
import { MatDivider } from '@angular/material/divider';
import { MatCheckbox } from '@angular/material/checkbox';


@Component({
  selector: 'app-commodity-add',
  templateUrl: './commodity-add.component.html',
standalone:true,
imports:[
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatLabel,
  ReactiveFormsModule,
  CommonModule,
  MatSnackBarModule,
  MatCard,
  MatToolbar,
  MatDivider,
  MatCardContent,
  MatCheckbox

],
  styleUrl: './commodity-add.component.scss'
})
export class CommodityAddComponent {
  isVisible = true;
  addProduct: FormGroup;
  isFormFilled: boolean = false;
  isSubmitted = false;
  isCancelClicked = false;



  constructor(private fb: FormBuilder, private apiService: ApiService) {

    this.addProduct = this.fb.group({

      isForAllBranches: [true, Validators.required],
      serviceStuffId: ['', Validators.required],
      taxPayerInternalServiceStuffId: ['', Validators.required],
      taxPayerInternalTitle: ['', Validators.required],

      serviceStuffTitle: [''],
      defaultValueOfTaxAndDuties: [0],
      defaultTaxAndDutiesSubject: [''],
      defaultTaxAndDutiesRate: [0],
      defaultValueOfLegalFunds: [0],
      defaultLegalFundsSubject: [''],
      defaultLegalFundsRate: [0],
      defaultFee: [0],
      defaultMeasurementUnit: [''],
      defaultCurrency: ['']
    });

    this.addProduct.valueChanges.subscribe(() => {
      this.isFormFilled = this.addProduct.dirty && !this.addProduct.invalid;
    });
  }

  resetForm() {
    this.isCancelClicked = true;
    this.addProduct.reset();
    this.addProduct.markAsPristine();
    this.addProduct.markAsUntouched();
    this.isFormFilled = false;
    this.isSubmitted = false;
    setTimeout(() => this.isCancelClicked = false, 0);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.addProduct.get(fieldName);
    return (field?.invalid && this.isSubmitted) || false;
  }


  onSubmit() {
    if (this.isCancelClicked) return;
    this.isSubmitted = true;
    if (this.addProduct.valid) {
      const formData = this.addProduct.value;
      this.apiService.addProduct(formData).subscribe(response => {
        if (response) {
          this.apiService.showNotification('داده‌ها با موفقیت ارسال شدند', 'success');
          this.resetForm();
        } else {
          this.apiService.showNotification('داده‌ها ارسال نشدند', 'error');
        }
      }, error => {
        this.apiService.showNotification('خطا در ارسال داده‌ها', 'error');
      });
    } else {
      this.addProduct.markAllAsTouched();
      this.apiService.showNotification('لطفاً همه فیلدها را کامل کنید', 'error');
    }
  }


  updateFormStatus() {
    this.isFormFilled = this.addProduct.valid;
  }

  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }

}
