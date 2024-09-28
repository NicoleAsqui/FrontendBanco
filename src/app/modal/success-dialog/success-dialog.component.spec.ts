import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { SuccessDialogComponent } from './success-dialog.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SuccessDialogComponent', () => {
  let component: SuccessDialogComponent;
  let fixture: ComponentFixture<SuccessDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<SuccessDialogComponent>>;
  const mockData = { message: 'Operación exitosa' };

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [MatDialogModule, NoopAnimationsModule],
      declarations: [SuccessDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessDialogComponent);
    component = fixture.componentInstance;
    mockDialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<SuccessDialogComponent>>;
    fixture.detectChanges();
  });

  it('should display the correct success message', () => {
    const paragraphElement = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(paragraphElement.textContent).toBe(mockData.message);
  });

  it('should close the dialog when "Cerrar" is clicked', () => {
    const closeButton = fixture.debugElement.query(By.css('button')).nativeElement;
    closeButton.click();

    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
