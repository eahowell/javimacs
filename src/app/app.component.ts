import { Component }                from '@angular/core';
import { CommonModule }             from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from './toolbar/toolbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToolbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Javi Mac\'s';
  currentYear = new Date().getFullYear();
  constructor() {};
}
