import { inject, Injectable, signal } from '@angular/core';
import { AiChatMessage, Product } from '../models';
import { CatalogService } from './catalog.service';

export interface AiRecommendationItem {
  product: Product;
  reason: string;
}

export interface ProductComparisonResult {
  left: Product;
  right: Product;
  priceDiff: number;
  cheaperName: string;
  higherRatedName: string;
  summary: string;
}

@Injectable({ providedIn: 'root' })
export class AiAssistantService {
  private readonly catalog = inject(CatalogService);

  readonly suggestedQuestions = [
    'How does Click & Collect work?',
    'What laptops are in stock?',
    'How do I checkout and pay?',
    'How can I track my order status?',
    'What is the return & support policy?',
  ];

  readonly messages = signal<AiChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'Hi! I am the BIDLIFY Electronics Assistant. Ask me about our electronics, Click & Collect branches, cart, checkout, payments, or order status.',
      timestamp: 'Now',
    },
  ]);

  /** Mock AI response generator — replace with real AI API call in backend integration phase. */
  sendMessage(rawText: string): void {
    const text = rawText.trim();
    if (!text) return;

    const userMsg: AiChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const reply = this.buildMockReply(text);
    this.messages.update((list) => [...list, userMsg, reply]);
  }

  getRecommendations(categorySlug?: string, excludeProductId?: string): AiRecommendationItem[] {
    const active = this.catalog.activeProducts().filter((p) => p.id !== excludeProductId);
    const pool =
      categorySlug && categorySlug !== 'all'
        ? active.filter((p) => p.categorySlug === categorySlug)
        : active;

    const source = pool.length > 0 ? pool : active;
    return [...source]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4)
      .map((product) => ({
        product,
        reason: product.originalPrice
          ? `Top-rated ${product.categoryName.toLowerCase()} pick with promotional savings.`
          : `Rated ${product.rating}★ by BIDLIFY buyers with Click & Collect availability.`,
      }));
  }

  answerProductQuestion(product: Product, question: string): string {
    const q = question.toLowerCase();
    const specEntries = Object.entries(product.specs);

    if (q.includes('warranty')) {
      const warranty = product.warranty ?? product.specs['Warranty'] ?? 'Standard supplier warranty applies (check branch counter on pickup).';
      return `Warranty for ${product.name}: ${warranty}`;
    }

    if (q.includes('spec') || q.includes('feature') || q.includes('explain')) {
      if (specEntries.length === 0) {
        return `${product.name} by ${product.brand}: ${product.shortDescription}`;
      }
      const readable = specEntries.map(([k, v]) => `${k} is ${v}`).join('; ');
      return `In simple terms, the ${product.name} offers: ${readable}. ${product.shortDescription}`;
    }

    if (q.includes('stock') || q.includes('pickup') || q.includes('branch') || q.includes('collect')) {
      return `${product.name} currently has ${product.stock} unit(s) in stock across ${product.pickupBranches.length} Click & Collect branch(es).`;
    }

    return `${product.name} (${product.brand}) is priced at LKR ${product.price.toLocaleString()} with ${product.stock} unit(s) available for Click & Collect. ${product.shortDescription}`;
  }

  compareProducts(left: Product, right: Product): ProductComparisonResult {
    const priceDiff = Math.abs(left.price - right.price);
    const cheaperName = left.price <= right.price ? left.name : right.name;
    const higherRatedName = left.rating >= right.rating ? left.name : right.name;
    const summary =
      priceDiff === 0
        ? `Both products are priced identically at LKR ${left.price.toLocaleString()}. ${higherRatedName} has the higher buyer rating.`
        : `${cheaperName} is more affordable by LKR ${priceDiff.toLocaleString()}, while ${higherRatedName} leads on buyer rating.`;

    return { left, right, priceDiff, cheaperName, higherRatedName, summary };
  }

  private buildMockReply(text: string): AiChatMessage {
    const q = text.toLowerCase();
    const active = this.catalog.activeProducts();
    let replyText = '';
    let recommendations: Product[] | undefined;

    if (q.includes('click') || q.includes('collect') || q.includes('pickup') || q.includes('delivery')) {
      replyText =
        'BIDLIFY uses Click & Collect only (no home delivery). Select your preferred branch (Colombo 03, Kandy, or Galle) during checkout and collect your electronics directly from the counter.';
    } else if (q.includes('cart')) {
      replyText =
        'Sign in with Google, then click "Add to Cart" on any electronics product. Open the Cart page to adjust quantities (+/−), remove items, and proceed to Click & Collect checkout.';
    } else if (q.includes('checkout') || q.includes('pay')) {
      replyText =
        'At Checkout, confirm your contact details, choose a Click & Collect branch, and follow the configured payment option (Merchant QR / Bank Transfer or Pay at Collection Counter).';
    } else if (q.includes('order') || q.includes('status') || q.includes('track')) {
      replyText =
        'Sign in with Google and open "My Orders" in the top navigation to view your order reference, payment status, and Click & Collect readiness.';
    } else if (q.includes('return') || q.includes('support') || q.includes('warranty')) {
      replyText =
        'You can inspect your electronics at the Click & Collect counter before leaving. For warranty or support, contact the listed supplier or visit your collection branch with your order reference.';
    } else if (
      q.includes('laptop') ||
      q.includes('phone') ||
      q.includes('audio') ||
      q.includes('headphone') ||
      q.includes('monitor') ||
      q.includes('product') ||
      q.includes('stock') ||
      q.includes('available')
    ) {
      const matched = active.filter((p) =>
        `${p.name} ${p.brand} ${p.categoryName}`.toLowerCase().includes(
          q.includes('laptop')
            ? 'laptop'
            : q.includes('phone')
              ? 'phone'
              : q.includes('audio') || q.includes('headphone')
                ? 'audio'
                : q.includes('monitor')
                  ? 'monitor'
                  : '',
        ),
      );
      recommendations = (matched.length > 0 ? matched : active).slice(0, 2);
      replyText = `We currently have ${active.length} approved electronics products in stock for Click & Collect. Here are top matching picks:`;
    } else {
      replyText =
        'I can help with BIDLIFY electronics, stock availability, Shopping Cart, Click & Collect checkout, payment guidance, order status, and returns. Try one of the suggested questions below!';
    }

    return {
      id: `a-${Date.now()}`,
      sender: 'assistant',
      text: replyText,
      recommendations,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }
}

