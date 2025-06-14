import { Component } from '@angular/core';
import { ChatbotService, ComparaisonResponse } from '../services/chatbot.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comparaison',
  templateUrl: './comparaison.component.html',
  styleUrls: ['./comparaison.component.css']
})
export class ComparaisonComponent {
 question: string = '';
  response?: ComparaisonResponse;
  errorMsg: string = '';
isTyping: boolean = false;

  constructor(private router: Router,private comparaisonService: ChatbotService) {}
submitQuestion() {
  this.errorMsg = '';
  this.response = undefined;
  this.isTyping = true;

  this.comparaisonService.askQuestion2(this.question).subscribe({
    next: (res) => {
      this.response = res;
      this.isTyping = false;
    },
    error: (err) => {
      this.errorMsg = err.error.detail || 'Erreur lors de la requête';
      this.isTyping = false;
    }
  });

  console.log("quest", this.question);
}

closeProfile() {
  this.router.navigate(['/client']);
}
}
