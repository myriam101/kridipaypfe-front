import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { ChatbotService, ComparaisonResponse } from '../services/chatbot.service';

interface Message {
  type: 'user' | 'bot' | 'error' | 'typing';
  text?: string;
  response?: ComparaisonResponse;
}
@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements AfterViewChecked {
 question = '';
  messages: Message[] = [];
  isOpen = false;
  isTyping = false;
  hasGreeted = false; 
  errorMsg: string = '';

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  constructor(private chatbotService: ChatbotService) {}

  toggleChat() {
    this.isOpen = !this.isOpen;

    if (this.isOpen && !this.hasGreeted) {
      this.hasGreeted = true;
      this.isTyping = true;

      setTimeout(() => {
        this.isTyping = false;
this.messages.push({
  type: 'error',
  text: "Bonjour ! Je suis un comparateur de produits. Donnez moi deux produits à comparer."
});
      }, 700);
    }
  }
sendQuestion() {
  const trimmed = this.question.trim();
  if (!trimmed) return;

  this.messages.push({
    type: 'user',
    text: trimmed
  });

  const toSend = trimmed;  // Sauvegarde pour la requête
  this.question = '';
  this.isTyping = true;

  this.chatbotService.askQuestion2(toSend).subscribe({
    next: (res: ComparaisonResponse) => {
      this.isTyping = false;

      if (res.type === 'comparaison' || res.type === 'categorie_mismatch') {
        this.messages.push({
          type: 'error',
          response: res
        });
      } else {
        this.simulateTyping(res.answer || res.comparison || 'Réponse non disponible.');
      }
    },
    error: (err) => {
      this.isTyping = false;
      const msg = err.error?.detail || 'Erreur lors de la requête.';

      this.messages.push({
        type: 'error',
        text: msg
      });
    }
  });
}


  simulateTyping(fullText: string) {
    const typingSpeed = 25;
    let index = 0;
    let currentText = '';

this.messages.push({ type: 'bot', text: '' });
    const messageIndex = this.messages.length - 1;

    const interval = setInterval(() => {
      currentText += fullText.charAt(index);
      this.messages[messageIndex].text = currentText;
      index++;

      if (index >= fullText.length) {
        clearInterval(interval);
      }
    }, typingSpeed);
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
