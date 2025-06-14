import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface QuestionRequest {
  question: string;
}

interface AnswerResponse {
  answer: string;
  context_used: string;
  
}
export interface ProductInfo {
  name: string;
  brand: string;
  carbon: number;
  water: number;
  electricity: number;
}

export interface ComparaisonResponse {
  type: 'comparaison' | 'optimisation'|'categorie_mismatch';
  products?: ProductInfo[];
  comparison?: string;
  metric?: string;
  best_product?: ProductInfo;
  message?: string;
}
@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

 private apiUrl = 'http://localhost:8001/ask';  
  private apiUrl2 = 'http://localhost:8002/ask';  

  constructor(private http: HttpClient) { }

  askQuestion(question: string): Observable<AnswerResponse> {
    return this.http.post<AnswerResponse>(this.apiUrl, { question });
  }
askQuestion2(question: string): Observable<ComparaisonResponse> {
    return this.http.post<ComparaisonResponse>(this.apiUrl2, { question });
  }}
