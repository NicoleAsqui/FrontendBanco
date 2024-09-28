import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddProductComponent } from './add-product.component';
import { ProductService } from '../../services/product.service';
import { of } from 'rxjs';

describe('AddProductComponent', () => {
  let component: AddProductComponent;
  let fixture: ComponentFixture<AddProductComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  beforeEach(async () => {
    productServiceSpy = jasmine.createSpyObj('ProductService', ['addProduct']);
    
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, BrowserAnimationsModule, AddProductComponent],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the form with 6 controls', () => {
    expect(component.productForm).toBeDefined();
    expect(component.productForm.controls['id']).toBeDefined();
    expect(component.productForm.controls['name']).toBeDefined();
    expect(component.productForm.controls['description']).toBeDefined();
    expect(component.productForm.controls['logo']).toBeDefined();
    expect(component.productForm.controls['date_release']).toBeDefined();
    expect(component.productForm.controls['date_revision']).toBeDefined();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});

