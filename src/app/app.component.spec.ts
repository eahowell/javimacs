import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { MenuComponent } from './pages/menu/menu.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AdminComponent } from './pages/admin/admin.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterModule.forRoot(
        [
          { path: '',        component: HomeComponent, title: 'Javi Macs' },
          { path: 'menu',    component: MenuComponent, title: 'Menu | Javi Macs' },
          { path: 'contact', component: ContactComponent, title: 'Contact | Javi Macs' },
          { path: 'admin',   component: AdminComponent, title: 'Admin | Javi Macs' },
          { path: '**',      redirectTo: '' }
        ]
      ),
        HttpClientTestingModule
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'Javi Mac's' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual("Javi Mac's");
  });

  it('should render toolbar', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-toolbar')).toBeTruthy();
  });
});
