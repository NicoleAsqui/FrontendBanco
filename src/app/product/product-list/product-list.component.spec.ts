import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let router: jasmine.SpyObj<Router>;
  let dialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProducts', 'deleteProduct']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ProductListComponent], 
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA] 
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  beforeEach(() => {
    productService.getProducts.and.returnValue(of({
      data: [
        {
          id: '1',
          name: 'Test Product',
          logo: '',
          description: 'Test Description',
          date_release: new Date('2023-01-01'), 
          date_revision: new Date('2023-12-01') 
        }
      ]
    }));
    fixture.detectChanges(); 
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on initialization', () => {
    component.ngOnInit();
    expect(productService.getProducts).toHaveBeenCalled();
    expect(component.products.length).toBe(1);
    expect(component.products[0].name).toBe('Test Product');
  });

  it('should filter products by search query', () => {
    component.searchQuery = 'Test';
    expect(component.filteredProducts.length).toBe(1);
    component.searchQuery = 'Non-existent';
    expect(component.filteredProducts.length).toBe(0);
  });

  it('should navigate to add product page', () => {
    component.addProduct();
    expect(router.navigate).toHaveBeenCalledWith(['/add-product']);
  });
});
