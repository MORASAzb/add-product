import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from './api.service';
import {provideHttpClient, withFetch, withJsonpSupport } from '@angular/common/http';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    CommonModule,
    MatSnackBarModule,
  ],
  providers: [
    ApiService // اضافه کردن سرویس به providers
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }



  isVisible = true;
  addProduct: FormGroup;
  isFormFilled: boolean = false;
  isSubmitted = false;
  isCancelClicked = false;



  constructor(private fb: FormBuilder, private apiService: ApiService) {

    this.addProduct = this.fb.group({
      domestic: ['', Validators.required],
      public: ['', Validators.required],
      tax: ['', Validators.required],
      business: ['', Validators.required]
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


  // onSubmit() {
  //   if (this.isCancelClicked) return;
  //   this.isSubmitted = true;
  //   if (this.addProduct.valid) {
  //     const formData = this.addProduct.value;
  //     console.log('Form Data:', formData);
  //     this.resetForm();
  //     this.addProduct.valid;
  //   } else {
  //     this.addProduct.markAllAsTouched();
  //     console.log('empty');
  //   }
  // }
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

