import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    
    await TestBed.configureTestingModule({
      declarations: [ConfirmDialogComponent],
      imports: [NoopAnimationsModule, MatButtonModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { id: '123' } } 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct ID in the message', () => {
    const message = fixture.nativeElement.querySelector('p').textContent;
    expect(message).toContain('123');
  });

  it('should close with false when cancel button is clicked', () => {
    const cancelButton = fixture.debugElement.query(By.css('.izquierda')).nativeElement;
    cancelButton.click();
    
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });

  it('should close with true when delete button is clicked', () => {
    const deleteButton = fixture.debugElement.query(By.css('.derecha')).nativeElement;
    deleteButton.click();
    
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });
});
