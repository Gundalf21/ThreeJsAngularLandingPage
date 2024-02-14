import { Component, OnInit, ViewChild } from '@angular/core';
import { ThreeJsSceneComponent } from './three-js-scene/three-js-scene.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @ViewChild(ThreeJsSceneComponent) threeJsScene:
    | ThreeJsSceneComponent
    | undefined;

  private textElement: HTMLElement | null = null;
  private textContents: string[] = [
    'a Web Developer',
    'an Artist',
    'a Music Producer',
    'a Game Developer',
  ];
  private currentIndex: number = 0;

  ngOnInit(): void {
    this.textElement = document.getElementById('text-blur-change');

    if (this.textElement) {
      this.changeText();
    } else {
      console.error("Element with ID 'text-blur-change' not found.");
    }
  }

  private changeText(): void {
    if (!this.textElement) {
      return;
    }

    this.textElement.textContent = this.textContents[this.currentIndex];
    this.textElement.style.opacity = '1';

    setTimeout(() => {
      this.textElement!.style.opacity = '0';
      this.currentIndex = (this.currentIndex + 1) % this.textContents.length;

      setTimeout(() => this.changeText(), 2000); // Change text every 1 second
    }, 2000); // Fade out after 2 seconds
  }
}
