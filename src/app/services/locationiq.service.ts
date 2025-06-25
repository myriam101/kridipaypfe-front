import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationiqService {

private apiKey = 'pk.d172405108fcee94fb1bf69dc782a875';
  private baseUrl = 'https://us1.locationiq.com/v1';

  constructor(private http: HttpClient) {}

  reverseGeocode(lat: number, lon: number): Observable<any> {
    const params = new HttpParams()
      .set('key', this.apiKey)
      .set('lat', lat.toString())
      .set('lon', lon.toString())
      .set('format', 'json');

    return this.http.get(`${this.baseUrl}/reverse.php`, { params });
  }
}
