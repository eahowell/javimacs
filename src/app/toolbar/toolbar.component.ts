// import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
// import { AsyncPipe, DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// import {
//   MatSlideToggleChange,
//   MatSlideToggleModule,
// } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, RouterLinkActive } from '@angular/router';
// import { Observable } from 'rxjs';
// import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatTooltipModule,
    // MatSlideToggleModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  // private breakpointObserver = inject(BreakpointObserver);
  // private document = inject(DOCUMENT);

  // isHandset$: Observable<boolean> = this.breakpointObserver
  //   .observe(Breakpoints.Handset)
  //   .pipe(
  //     map((result) => result.matches),
  //     shareReplay()
  //   );
  // onThemeChange(event: MatSlideToggleChange) {
  //   this.document.body.classList.toggle('dark');
  // }
}
