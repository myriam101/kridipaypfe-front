import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BanqueService {


  private apiurl = 'http://localhost:8000/Agent';

  constructor(private http: HttpClient) {}
    getAgentByEmail(email: string): Observable<any> {
      return this.http.get(`${this.apiurl}/email/${email}`);
    }
    getAgentDetails(agentId: number): Observable<any> {
    return this.http.get<any>(`${this.apiurl}/details/${agentId}`);
  }
}
