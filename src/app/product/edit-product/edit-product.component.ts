import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { SuccessDialogComponent } from '../../modal/success-dialog/success-dialog.component';
import { MatDialog } from '@angular/material/dialog';

import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatInputModule, MatFormFieldModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  productForm: FormGroup;
  productId: string = '';
  errorMessage: string | null = null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public router: Router,
    private dialog: MatDialog
  ) {
    this.productForm = this.fb.group({
      id: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      logo: [''],
      date_release: ['', Validators.required],
      date_revision: ['', Validators.required]
    });

    this.productForm.get('date_release')?.valueChanges.subscribe(() => {
      this.validateReleaseDate();
    });

    this.productForm.get('date_revision')?.valueChanges.subscribe(() => {
      this.validateRevisionDate();
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.loadProduct();
  }

  loadProduct(): void {
    this.productService.getProductById(this.productId).subscribe(product => {
      this.productForm.patchValue(product);
    });
  }


  openSuccessDialog(message: string): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: '600px',
      data: { message }
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
  redirectToProductList(): void {
    this.router.navigate(['/products']);
  }
  
  editProduct(): void {
    this.productForm.markAllAsTouched();
  
    if (this.productForm.valid) {
      this.productService.updateProduct(this.productId, this.productForm.value).subscribe(() => {
        console.log('Producto editado');
        this.openSuccessDialog('El producto ha sido editado exitosamente');
      }, error => {
        this.errorMessage = error.message;
        console.error('Error al editar producto', error);
      });
    } else {
      this.errorMessage = 'Por favor, completa todos los campos requeridos correctamente.';
      console.error('Formulario inválido', this.productForm.errors);
    }
  }
}
