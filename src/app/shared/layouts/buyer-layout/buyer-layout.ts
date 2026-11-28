import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AiChatbotComponent } from '../../components/ai-chatbot/ai-chatbot';
import { FooterComponent } from '../../components/footer/footer';
import { GoogleSignInModalComponent } from '../../components/google-signin-modal/google-signin-modal';
import { NavbarComponent } from '../../components/navbar/navbar';

@Component({
  selector: 'app-buyer-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, GoogleSignInModalComponent, AiChatbotComponent],
  templateUrl: './buyer-layout.html',
  styleUrl: './buyer-layout.scss',
})
export class BuyerLayoutComponent {}

