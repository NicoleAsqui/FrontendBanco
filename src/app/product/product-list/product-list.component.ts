import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../modal/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  pageSizes: number[] = [5, 10, 20];
  pageSize: number = 5;
  searchQuery: string = '';
  dropdownOpen: { [key: string]: boolean } = {}; 

  constructor(private productService: ProductService, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(
      response => {
        if (response && Array.isArray(response.data)) {
          this.products = response.data;
        } else {
          this.products = [];
        }
      },
      error => {
        console.error('Error al cargar los productos:', error);
        this.products = [];
      }
    );
  }

  get filteredProducts() {
    return this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  closeDropdowns(): void {
    this.dropdownOpen = {};
  }

  toggleDropdown(productId: string): void {
    if (this.dropdownOpen[productId]) {
      this.closeDropdowns(); 
    } else {
      this.closeDropdowns();
      this.dropdownOpen[productId] = true; 
    }
  }

  confirmDelete(productId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { id: productId }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.deleteProduct(productId);
      }
    });
  }

  deleteProduct(productId: string): void {
    this.productService.deleteProduct(productId).subscribe(
      () => {
        this.loadProducts();
      },
      error => {
        console.error('Error deleting product:', error);
        alert('Error en la operación. Inténtalo de nuevo más tarde.');
      }
    );
  }

  editProduct(productId: string): void {
    this.router.navigate(['/edit-product', productId]);
    this.closeDropdowns(); 
  }

  addProduct(): void {
    this.router.navigate(['/add-product']);
  }
}
