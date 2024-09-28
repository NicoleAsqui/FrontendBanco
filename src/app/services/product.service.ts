import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Product } from '../models/product.model';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3002/bp/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<{ data: Product[] }> {
    return this.http.get<{ data: Product[] }>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  addProduct(product: Product): Observable<{ message: string; data: Product }> {
    return this.http.post<{ message: string; data: Product }>(this.apiUrl, product).pipe(
      catchError(this.handleError)
    );
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateProduct(id: string, product: Product): Observable<{ message: string; data: Product }> {
    return this.http.put<{ message: string; data: Product }>(`${this.apiUrl}/${id}`, product).pipe(
      catchError(this.handleError)
    );
  }

  deleteProduct(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  verifyProductId(id: string): Observable<boolean> {
  return this.http.get<boolean>(`${this.apiUrl}/verification/${id}`).pipe(
    catchError(this.handleError)
  );
}

  
  private handleError(error: any) {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Error en la operación. Inténtalo de nuevo más tarde.'));
  }
}
