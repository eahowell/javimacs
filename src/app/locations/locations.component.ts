import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';

// Interface matching the structure of the JSON file
export type Location = {
  id: string;
  date: string;
  venue: string;
  address: string;
  start: string;
  end: string;
  details: string;
};

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss'],
})
export class LocationsComponent {
  http = inject(HttpClient);
  locations = toSignal(this.http.get<Location[]>('assets/locations.json'), {
    initialValue: [],
  });
}
