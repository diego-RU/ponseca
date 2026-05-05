import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { MenuItem } from '../models/menu-item.model';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private readonly api = inject(ApiService);

  list(): Observable<MenuItem[]> {
    return this.api.getMenu();
  }

  get(id: string): Observable<MenuItem> {
    return this.api.getMenuItem(id);
  }

  create(item: Omit<MenuItem, 'id'>): Observable<MenuItem> {
    return this.api.createMenuItem(item);
  }

  update(id: string, patch: Partial<MenuItem>): Observable<MenuItem> {
    return this.api.updateMenuItem(id, patch);
  }

  remove(id: string): Observable<void> {
    return this.api.deleteMenuItem(id);
  }
}
