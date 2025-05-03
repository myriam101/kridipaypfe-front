import { Component } from '@angular/core';

@Component({
  selector: 'app-adminboard',
  templateUrl: './adminboard.component.html',
  styleUrls: ['./adminboard.component.css']
})
export class AdminboardComponent {
  ngOnInit() {
    const toggleButton = document.getElementById("menu-toggle");
    const wrapper = document.getElementById("wrapper");
  
    if (toggleButton && wrapper) {
      toggleButton.addEventListener("click", () => {
        wrapper.classList.toggle("toggled");
      });
    }
}
}