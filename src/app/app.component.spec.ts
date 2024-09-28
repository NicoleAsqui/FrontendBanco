import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { By } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing'; 

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, MatIconModule, RouterTestingModule] 
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should display the correct title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges(); 
    const titleElement = fixture.debugElement.query(By.css('h4')).nativeElement;
    expect(titleElement.textContent).toContain('BANCO');
  });

  it('should display the payments icon', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const iconElement = fixture.debugElement.query(By.css('mat-icon')).nativeElement;
    expect(iconElement.textContent).toContain('payments');
  });
});
