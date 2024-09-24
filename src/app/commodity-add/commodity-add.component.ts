import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ApiService } from '../../services/api.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../../base/components/snackbar/snackbar/snackbar.component';
@Component({
  selector: 'app-commodity-add',
  templateUrl: './commodity-add.component.html',
  styleUrl: './commodity-add.component.scss'
})
export class CommodityAddComponent {
  isVisible = true;
  addProduct: FormGroup;
  isFormFilled: boolean = false;
  isSubmitted = false;
  isCancelClicked = false;
  constructor(private snackBar: MatSnackBar,private fb: FormBuilder,private apiService: ApiService) {
    this.addProduct = this.fb.group({
      isForAllBranches: [true, Validators.required],
      serviceStuffId: ['', Validators.required],
      taxPayerInternalServiceStuffId: ['', Validators.required],
      taxPayerInternalTitle: ['', Validators.required],
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
  showSnackbar(message: string, icon?: string, customClass?: string, config?: MatSnackBarConfig) {
    const customConfig: MatSnackBarConfig = {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 2000,
      panelClass: customClass,
      data: {
        message: message,
        icon: icon
      }
    };
    this.snackBar.openFromComponent(SnackbarComponent, customConfig);
  }
  resetForm() {
    this.isCancelClicked = true;
    this.addProduct.reset();

    const defaultTaxAndDutiesRateElement = document.querySelector('[placeholder="نرخ مالیات ارزش افزوده را وارد کنید"]') as HTMLInputElement;
    const defaultTaxAndDutiesSubjectElement = document.querySelector('[placeholder="شرح تجاری کالا/خدمت را وارد کنید"]') as HTMLTextAreaElement;

    if (defaultTaxAndDutiesRateElement) {
        defaultTaxAndDutiesRateElement.value = '';
    }
    if (defaultTaxAndDutiesSubjectElement) {
        defaultTaxAndDutiesSubjectElement.value = ''; 
    }

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
      this.apiService.post('taxpayer/AddItem?userid=4Ow5Fn',formData).subscribe(response => {
        if (response.isSuccess) {
          this.showSnackbar('ثبت کالا خدمت با موفقیت انجام شد.', 'check_circle', 'snackbar-success');
          this.resetForm();
        } else {
          this.showSnackbar('ثبت کالا خدمت با خطا مواجه شد!', 'error_circle', 'snackbar-error');
        }
      }, error => {
        this.showSnackbar('ثبت کالا خدمت با خطا مواجه شد!', 'error_circle', 'snackbar-error');
      });
    } else {
      this.addProduct.markAllAsTouched();
    }
  }

  updateFormStatus() {
    this.isFormFilled = this.addProduct.valid;
  }

  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }
}
