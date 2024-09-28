
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProductService } from '../../services/product.service';
import { SuccessDialogComponent } from '../../modal/success-dialog/success-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatInputModule, MatFormFieldModule],
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent {
  productForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private productService: ProductService, 
    private dialog: MatDialog) {
    this.productForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      logo: ['', Validators.required],
      date_release: ['', Validators.required],
      date_revision: ['', Validators.required],
    });

    this.productForm.get('date_release')?.valueChanges.subscribe(() => {
      this.validateReleaseDate();
    });

    this.productForm.get('date_revision')?.valueChanges.subscribe(() => {
      this.validateRevisionDate();
    });
  }

  validateReleaseDate() {
    const releaseDate = this.productForm.get('date_release')?.value;
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    if (releaseDate && new Date(releaseDate) < today) {
      this.productForm.get('date_release')?.setErrors({ releaseDateInvalid: true });
    } else {
      this.productForm.get('date_release')?.setErrors(null);
    }
  }

  validateRevisionDate() {
    const releaseDate = this.productForm.get('date_release')?.value;
    const revisionDate = this.productForm.get('date_revision')?.value;

    if (releaseDate && revisionDate) {
      const releaseDateObj = new Date(releaseDate);
      const expectedRevisionDate = new Date(releaseDateObj);
      expectedRevisionDate.setFullYear(releaseDateObj.getFullYear() + 1);

      if (new Date(revisionDate).getTime() !== expectedRevisionDate.getTime()) {
        this.productForm.get('date_revision')?.setErrors({ revisionDateInvalid: true });
      } else {
        this.productForm.get('date_revision')?.setErrors(null);
      }
    }
  }
  openSuccessDialog(message: string): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: '600px',
      data: { message }
    });
  }
  
  addProduct(): void {
    this.productForm.markAllAsTouched(); 

    if (this.productForm.valid) {
      this.productService.addProduct(this.productForm.value).subscribe({
        next: (response) => {
          console.log('Producto agregado', response);
          this.errorMessage = null;
          this.openSuccessDialog('El producto ha sido agregado exitosamente');
          this.resetForm(); 
        },
        error: (error) => {
          this.errorMessage = error.message;
          console.error('Error al agregar producto', error);
        },
      });
    } else {
      console.error('Formulario inválido', this.productForm.errors);
      this.errorMessage = 'Por favor, completa todos los campos requeridos correctamente.'; 
    }
  }

  resetForm() {
    this.productForm.reset();
    this.errorMessage = null;
  }

  isFormValid() {
    return this.productForm.valid;
  }
}
