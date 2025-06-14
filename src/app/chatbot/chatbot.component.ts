import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { ChatbotService } from '../services/chatbot.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements AfterViewChecked {
  question = '';
  messages: { text: string; from: 'user' | 'bot' }[] = [];
  isOpen = false;
  isTyping = false;
 hasGreeted = false; 

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  constructor(private chatbotService: ChatbotService) {}
 
 toggleChat() {
    this.isOpen = !this.isOpen;

    if (this.isOpen && !this.hasGreeted) {
      this.hasGreeted = true;
      this.isTyping = true;

      setTimeout(() => {
        this.isTyping = false;
        this.simulateTyping("Bonjour ! Je suis expert en écologie. En quoi puis-je vous aider aujourd’hui ?");
      }, 700);
    }
  }

 sendQuestion() {
  const trimmed = this.question.trim();
  if (!trimmed) return;

  this.messages.push({ text: trimmed, from: 'user' });
  this.question = '';
  this.isTyping = true;

  this.chatbotService.askQuestion(trimmed).subscribe({
    next: (res) => {
      setTimeout(() => {
        this.isTyping = false; 
        this.simulateTyping(res.answer); 
      }, 700); 
      console.log("contexte",res.context_used);
    },
    error: () => {
      this.messages.push({ text: "Erreur lors de la requête.", from: 'bot' });
      this.isTyping = false;
    }
  });
}
simulateTyping(fullText: string) {
  const typingSpeed = 25;
  let index = 0;
  let currentText = '';

  this.messages.push({ text: '', from: 'bot' });
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
