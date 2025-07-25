import { Routes } from '@angular/router';
import { HomeComponent }    from './pages/home/home.component';
import { MenuComponent }    from './pages/menu/menu.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AdminComponent }   from './pages/admin/admin.component';

export const routes: Routes = [
  { path: '',        component: HomeComponent, title: 'Javi Macs' },
  { path: 'menu',    component: MenuComponent, title: 'Menu | Javi Macs' },
  { path: 'contact', component: ContactComponent, title: 'Contact | Javi Macs' },
  { path: 'admin',   component: AdminComponent, title: 'Admin | Javi Macs' },
  { path: '**',      redirectTo: '' }
];

