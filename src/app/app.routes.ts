import { Routes } from '@angular/router';
import { AddProductComponent } from './product/add-product/add-product.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { EditProductComponent } from './product/edit-product/edit-product.component';

export const routes: Routes = [
  { path: 'products', component: ProductListComponent },
  { path: 'add-product', component: AddProductComponent },
  { path: 'edit-product/:id', component: EditProductComponent },
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: '**', redirectTo: '/products' }
];
