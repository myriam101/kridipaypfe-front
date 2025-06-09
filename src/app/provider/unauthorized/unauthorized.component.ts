import { Component } from '@angular/core';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css']
})
export class UnauthorizedComponent {
  contactSupport() {
    // Tu peux ici ouvrir une fenêtre de contact, ou rediriger vers une page ou mailto
    window.location.href = 'mailto:support@tonsite.com?subject=Activation du module de points';
  }
}
