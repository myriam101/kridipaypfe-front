import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { ChatbotService, ComparaisonResponse } from '../services/chatbot.service';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
interface Message {
  type: 'user' | 'bot' | 'error' | 'typing';
  text?: string;
  response?: ComparaisonResponse;
}

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
messages: Message[] = [];
  showInfoTooltip = false;
  tooltipPosition = { top: 0, left: 0 };
  @ViewChild('titleElement', { static: true }) titleElement!: ElementRef;
  constructor(public dialogRef: MatDialogRef<ComparaisonComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private router: Router,private comparaisonService: ChatbotService) {}
submitQuestion() {
  this.errorMsg = '';
  this.response = undefined;
  this.messages = [];

  // 1. Ajouter le message utilisateur
  this.messages.push({
    type: 'user',
    text: this.question
  });

  // 2. Afficher "typing"
  this.isTyping = true;
  this.messages.push({
    type: 'typing'
  });

  // 3. Appeler l’API
  this.comparaisonService.askQuestion2(this.question).subscribe({
    next: (res) => {
      this.isTyping = false;

      // Enlever l'indicateur "typing"
      this.messages = this.messages.filter(m => m.type !== 'typing');

      // 4. Ajouter la réponse sous forme de message
      this.messages.push({
        type: 'bot',
        response: res
      });

      this.response = res; 
    },
    error: (err) => {
      this.isTyping = false;
      this.messages = this.messages.filter(m => m.type !== 'typing');
      const msg = err.error.detail || 'Erreur lors de la requête';
      this.errorMsg = msg;

      this.messages.push({
        type: 'error',
        text: msg
      });
    }
  });

  console.log("quest", this.question);
}


 closeDialog(): void {
    this.dialogRef.close();
  }


  ngOnInit() {
    setTimeout(() => {
      this.setTooltipPosition();
      this.showInfoTooltip = true;
    }, 300); 
  }

  setTooltipPosition() {
    if (!this.titleElement) return;
    const rect = this.titleElement.nativeElement.getBoundingClientRect();

    // Positionne le tooltip au-dessus du titre, centré horizontalement
    this.tooltipPosition.top = rect.top - 40 + window.scrollY;
    this.tooltipPosition.left = rect.left + rect.width / 2 + window.scrollX;
  }

  closeInfoTooltip() {
    this.showInfoTooltip = false;
  }
}
