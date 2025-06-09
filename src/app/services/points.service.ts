import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PointsService {

private api = 'http://localhost:8000/Packpoint'
  constructor(private http: HttpClient) {}

  togglePackVisibility(id: number): Observable<any> {
  return this.http.patch(`${this.api}/${id}/toggle-visibility`, {});
}

}
