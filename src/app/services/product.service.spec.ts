import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';

interface GetProductsResponse {
  data: Product[];
}

interface AddProductResponse {
  message: string;
  data: Product;
}

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:3002/bp/products';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should retrieve products via GET', () => {
    const mockProducts: Product[] = [
      { id: '1', name: 'Product 1', description: 'Description 1', logo: 'logo1.png', date_release: new Date(), date_revision: new Date() },
      { id: '2', name: 'Product 2', description: 'Description 2', logo: 'logo2.png', date_release: new Date(), date_revision: new Date() }
    ];

    service.getProducts().subscribe((response: GetProductsResponse) => {
      expect(response.data.length).toBe(2);
      expect(response.data).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockProducts });
  });

  it('should add a product via POST', () => {
    const newProduct: Product = { id: '3', name: 'Product 3', description: 'Description 3', logo: 'logo3.png', date_release: new Date(), date_revision: new Date() };
    const responseMessage: AddProductResponse = { message: 'Producto agregado', data: newProduct };

    service.addProduct(newProduct).subscribe((response: AddProductResponse) => {
      expect(response.message).toBe('Producto agregado');
      expect(response.data).toEqual(newProduct);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);
    req.flush(responseMessage);
  });
});
