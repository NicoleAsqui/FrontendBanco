import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Importa el módulo de animaciones
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { EditProductComponent } from './edit-product.component';
import { ProductService } from '../../services/product.service';

describe('EditProductComponent', () => {
  let component: EditProductComponent;
  let fixture: ComponentFixture<EditProductComponent>;
  let productServiceMock: any;
  let activatedRouteMock: any;

  beforeEach(() => {
    // Mock ProductService
    productServiceMock = {
      getProductById: jasmine.createSpy('getProductById').and.returnValue(of({ id: '1', name: 'Test Product', description: 'Test Description', date_release: new Date(), date_revision: new Date() })),
      updateProduct: jasmine.createSpy('updateProduct').and.returnValue(of({}))
    };

    // Mock ActivatedRoute
    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: () => '1'
        }
      }
    };

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        EditProductComponent
      ],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and initialize the form', () => {
    expect(component).toBeTruthy();
    expect(component.productForm).toBeDefined(); 
    expect(component.productForm.controls['name']).toBeDefined(); 
    expect(component.productForm.controls['description']).toBeDefined();
  });

  it('should load product on initialization', () => {
    component.ngOnInit();
    expect(productServiceMock.getProductById).toHaveBeenCalledWith('1'); 
    expect(component.productForm.value.name).toBe('Test Product');
  });
});
