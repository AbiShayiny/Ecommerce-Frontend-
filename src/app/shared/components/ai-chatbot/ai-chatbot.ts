import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AiAssistantService } from '../../../core/services/ai-assistant.service';

@Component({
  selector: 'app-ai-chatbot',
  standalone: true,
  imports: [FormsModule, RouterLink, DecimalPipe],
  templateUrl: './ai-chatbot.html',
  styleUrl: './ai-chatbot.scss',
})
export class AiChatbotComponent {
  protected readonly ai = inject(AiAssistantService);

  protected readonly isOpen = signal(false);
  protected readonly draft = signal('');

  protected toggle(): void {
    this.isOpen.update((v) => !v);
  }

  protected send(text = this.draft()): void {
    if (!text.trim()) return;
    this.ai.sendMessage(text);
    if (text === this.draft()) {
      this.draft.set('');
    }
  }
}

