/**
 * Stripe Integration for Premium Features
 * Handles subscription management and payment processing
 */

import { loadStripe, Stripe } from '@stripe/stripe-js';

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId: string;
}

export interface UserSubscription {
  userId: string;
  subscriptionId: string;
  tierId: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Cosmic Explorer',
    price: 0,
    currency: 'USD',
    interval: 'month',
    features: [
      'Basic Dreamspell calendar',
      'Daily galactic signature',
      'Simple birth chart',
      'Community access',
      'Basic wavespell tracking'
    ],
    stripePriceId: '' // Free tier doesn't need Stripe
  },
  {
    id: 'premium_monthly',
    name: 'Galactic Navigator',
    price: 19.99,
    currency: 'USD',
    interval: 'month',
    features: [
      'Everything in Cosmic Explorer',
      'Complete sidereal birth chart',
      'Detailed house system analysis',
      'Sacred aspect patterns',
      'Vedic nakshatra insights',
      'Real-time transit tracking',
      'Advanced compatibility matching',
      'Personalized cosmic reports',
      'Priority community features',
      'Export charts as PDF'
    ],
    stripePriceId: 'price_1RpnotGZZLJ9HaX9WB17E5ia' // Galactic Navigator - $19.99/month
  },
  {
    id: 'premium_yearly',
    name: 'Galactic Navigator Annual',
    price: 222.00,
    currency: 'USD',
    interval: 'year',
    features: [
      'Everything in Cosmic Explorer',
      'Complete sidereal birth chart',
      'Detailed house system analysis',
      'Sacred aspect patterns',
      'Vedic nakshatra insights',
      'Real-time transit tracking',
      'Advanced compatibility matching',
      'Personalized cosmic reports',
      'Priority community features',
      'Export charts as PDF',
      '2 months FREE (vs monthly)'
    ],
    stripePriceId: 'price_1RpnotGZZLJ9HaX9mz1IMC9n' // Galactic Navigator Annual - $199.99/year
  },
  {
    id: 'new_earth_pioneer',
    name: 'New Earth Pioneer',
    price: 199.99,
    currency: 'USD',
    interval: 'year',
    features: [
      'Everything in Galactic Navigator',
      'Annual cosmic forecast',
      'Personal astrology consultations',
      'Advanced planetary return charts',
      'Custom wavespell ceremonies',
      'Exclusive pioneer community access',
      'New Earth consciousness teachings',
      'Planetary grid activation ceremonies',
      'Early access to new features',
      'Priority customer support',
      'Offline chart downloads',
      'Advanced API access'
    ],
    stripePriceId: 'price_1RpntPGZZLJ9HaX9EADXIgoI' // New Earth Pioneer - $199.99/year
  }
];

export class StripeService {
  private stripe: Stripe | null = null;
  private publishableKey: string;

  constructor(publishableKey: string) {
    this.publishableKey = publishableKey;
    this.initializeStripe();
  }

  private async initializeStripe() {
    try {
      this.stripe = await loadStripe(this.publishableKey);
    } catch (error) {
      console.error('Error initializing Stripe:', error);
    }
  }

  /**
   * Create a checkout session for subscription
   */
  async createCheckoutSession(tierId: string, userId: string): Promise<{ sessionId: string } | null> {
    try {
      const tier = SUBSCRIPTION_TIERS.find(t => t.id === tierId);
      if (!tier || tier.id === 'free') {
        throw new Error('Invalid subscription tier');
      }

      // This would make an API call to your backend
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: tier.stripePriceId,
          userId,
          tierId,
        }),
      });

      const session = await response.json();
      return { sessionId: session.id };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return null;
    }
  }

  /**
   * Redirect to Stripe Checkout
   */
  async redirectToCheckout(sessionId: string): Promise<void> {
    if (!this.stripe) {
      console.log('Stripe not initialized');
      return;
    }

    try {
      const result = await this.stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (result.error) {
        console.error('Stripe checkout error:', result.error);
      }
    } catch (error) {
      console.error('Error redirecting to checkout:', error);
    }
  }

  /**
   * Create a customer portal session for subscription management
   */
  async createPortalSession(customerId: string): Promise<{ url: string } | null> {
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
        }),
      });

      const session = await response.json();
      return { url: session.url };
    } catch (error) {
      console.error('Error creating portal session:', error);
      return null;
    }
  }

  /**
   * Get user's current subscription status
   */
  async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      const response = await fetch(`/api/stripe/subscription/${userId}`);
      const subscription = await response.json();
      return subscription;
    } catch (error) {
      console.error('Error fetching user subscription:', error);
      return null;
    }
  }

  /**
   * Check if user has access to premium features
   */
  async hasAccess(userId: string, feature: string): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId);
      
      if (!subscription || subscription.status !== 'active') {
        // Check free tier features
        const freeTier = SUBSCRIPTION_TIERS.find(t => t.id === 'free');
        return freeTier?.features.includes(feature) || false;
      }

      const tier = SUBSCRIPTION_TIERS.find(t => t.id === subscription.tierId);
      return tier?.features.includes(feature) || false;
    } catch (error) {
      console.error('Error checking feature access:', error);
      return false;
    }
  }
}

// Webhook handling for Stripe events
export const handleStripeWebhook = async (event: any) => {
  console.log('Stripe webhook event received:', event.type);

  switch (event.type) {
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object);
      break;
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object);
      break;
    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object);
      break;
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
};

const handleSubscriptionCreated = async (subscription: any) => {
  console.log('Subscription created:', subscription);
  // Update user's subscription status in Firebase
  // Send welcome email
  // Unlock premium features
};

const handleSubscriptionUpdated = async (subscription: any) => {
  console.log('Subscription updated:', subscription);
  // Update user's subscription status in Firebase
  // Handle tier changes
};

const handleSubscriptionDeleted = async (subscription: any) => {
  console.log('Subscription deleted:', subscription);
  // Downgrade user to free tier
  // Send cancellation email
  // Revoke premium access
};

const handlePaymentSucceeded = async (invoice: any) => {
  console.log('Payment succeeded:', invoice);
  // Extend subscription period
  // Send payment confirmation
};

const handlePaymentFailed = async (invoice: any) => {
  console.log('Payment failed:', invoice);
  // Send payment failure notification
  // Handle retry logic
};

// Utility functions
export const formatPrice = (price: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
};

export const getTierByPrice = (stripePriceId: string): SubscriptionTier | null => {
  return SUBSCRIPTION_TIERS.find(tier => tier.stripePriceId === stripePriceId) || null;
};

export const isSubscriptionActive = (subscription: UserSubscription): boolean => {
  return subscription.status === 'active' && 
         subscription.currentPeriodEnd > new Date();
};

export const getDaysUntilRenewal = (subscription: UserSubscription): number => {
  const now = new Date();
  const renewalDate = subscription.currentPeriodEnd;
  const diffTime = renewalDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Premium feature flags
export const PREMIUM_FEATURES = {
  ADVANCED_CHARTS: 'Complete sidereal birth chart',
  HOUSE_SYSTEM: 'Detailed house system analysis',
  ASPECTS: 'Sacred aspect patterns',
  NAKSHATRAS: 'Vedic nakshatra insights',
  TRANSITS: 'Real-time transit tracking',
  COMPATIBILITY: 'Advanced compatibility matching',
  REPORTS: 'Personalized cosmic reports',
  EXPORT_PDF: 'Export charts as PDF',
  PRIORITY_SUPPORT: 'Priority customer support',
  API_ACCESS: 'Advanced API access'
} as const;

export type PremiumFeature = typeof PREMIUM_FEATURES[keyof typeof PREMIUM_FEATURES];