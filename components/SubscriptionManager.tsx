'use client';

import React, { useState, useEffect } from 'react';
import { StripeService, SUBSCRIPTION_TIERS, SubscriptionTier, UserSubscription, formatPrice, PREMIUM_FEATURES } from '@/lib/stripe';
import { CosmicContainer, CosmicCard, CosmicButton, CosmicText, StarField, GlowingOrb, FloatingElement } from './ui/CosmicTheme';

interface SubscriptionManagerProps {
  userId: string;
  currentSubscription?: UserSubscription | null;
}

export default function SubscriptionManager({ userId, currentSubscription }: SubscriptionManagerProps) {
  const [subscription, setSubscription] = useState<UserSubscription | null>(currentSubscription || null);
  const [loading, setLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [stripeService] = useState(new StripeService(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''));

  useEffect(() => {
    if (!currentSubscription && userId) {
      loadUserSubscription();
    }
  }, [userId, currentSubscription]);

  const loadUserSubscription = async () => {
    try {
      const userSub = await stripeService.getUserSubscription(userId);
      setSubscription(userSub);
    } catch (error) {
      console.error('Error loading subscription:', error);
    }
  };

  const handleUpgrade = async (tierId: string) => {
    setLoading(true);
    setSelectedTier(tierId);

    try {
      const session = await stripeService.createCheckoutSession(tierId, userId);
      if (session?.sessionId) {
        await stripeService.redirectToCheckout(session.sessionId);
      } else {
        alert('Unable to create checkout session. Please try again.');
      }
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      alert('Error processing upgrade. Please try again.');
    } finally {
      setLoading(false);
      setSelectedTier(null);
    }
  };

  const handleManageSubscription = async () => {
    if (!subscription) return;

    setLoading(true);
    try {
      // In a real app, you'd get the customer ID from your database
      const customerId = 'cus_example'; // Replace with actual customer ID
      const portal = await stripeService.createPortalSession(customerId);
      if (portal?.url) {
        window.location.href = portal.url;
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      alert('Error opening subscription management. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentTier = (): SubscriptionTier => {
    if (!subscription || subscription.status !== 'active') {
      return SUBSCRIPTION_TIERS[0]; // Free tier
    }
    return SUBSCRIPTION_TIERS.find(tier => tier.id === subscription.tierId) || SUBSCRIPTION_TIERS[0];
  };

  const renderTierCard = (tier: SubscriptionTier, isCurrentTier: boolean) => {
    const isPopular = tier.id === 'premium';
    const isFree = tier.id === 'free';

    return (
      <FloatingElement key={tier.id} className="h-full">
        <CosmicCard
          className={`
            h-full relative transition-all duration-300 hover:scale-105
            ${isCurrentTier ? 'ring-2 ring-purple-400 shadow-2xl shadow-purple-500/50' : ''}
            ${isPopular ? 'border-2 border-yellow-400 shadow-xl shadow-yellow-400/30' : ''}
          `}
        >
          {isPopular && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-1 rounded-full text-sm font-bold">
                ⭐ Most Popular
              </div>
            </div>
          )}

          {isCurrentTier && (
            <div className="absolute -top-4 right-4">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                ✨ Current Plan
              </div>
            </div>
          )}

          <div className="p-6 h-full flex flex-col">
            {/* Header */}
            <div className="text-center mb-6">
              <CosmicText variant="primary" size="xl">
                {tier.name}
              </CosmicText>
              <div className="mt-4">
                <span className="text-3xl font-bold text-white">
                  {isFree ? 'Free' : formatPrice(tier.price)}
                </span>
                {!isFree && (
                  <span className="text-purple-200 ml-1">
                    /{tier.interval}
                  </span>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="flex-1 mb-6">
              <ul className="space-y-3">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="text-green-400 text-sm mt-1">✓</span>
                    <span className="text-purple-100 text-sm leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button */}
            <div className="mt-auto">
              {isCurrentTier ? (
                <div className="space-y-3">
                  <CosmicButton
                    variant="ethereal"
                    className="w-full"
                    disabled={true}
                  >
                    Current Plan
                  </CosmicButton>
                  {!isFree && (
                    <CosmicButton
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={handleManageSubscription}
                      disabled={loading}
                    >
                      Manage Subscription
                    </CosmicButton>
                  )}
                </div>
              ) : isFree ? (
                <CosmicButton
                  variant="ethereal"
                  className="w-full"
                  disabled={true}
                >
                  Always Free
                </CosmicButton>
              ) : (
                <CosmicButton
                  variant={isPopular ? "primary" : "secondary"}
                  className="w-full"
                  onClick={() => handleUpgrade(tier.id)}
                  disabled={loading}
                >
                  {loading && selectedTier === tier.id ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    `Upgrade to ${tier.name}`
                  )}
                </CosmicButton>
              )}
            </div>
          </div>
        </CosmicCard>
      </FloatingElement>
    );
  };

  const renderCurrentSubscriptionInfo = () => {
    if (!subscription || subscription.status !== 'active') return null;

    const tier = getCurrentTier();
    const daysUntilRenewal = Math.ceil(
      (subscription.currentPeriodEnd.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
      <CosmicCard title="🌟 Your Cosmic Journey" glowing={true} className="mb-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <CosmicText variant="accent" size="lg">
              Current Tier
            </CosmicText>
            <div className="text-white font-semibold mt-2">
              {tier.name}
            </div>
          </div>

          <div className="text-center">
            <CosmicText variant="accent" size="lg">
              Status
            </CosmicText>
            <div className={`font-semibold mt-2 ${
              subscription.status === 'active' ? 'text-green-400' : 'text-red-400'
            }`}>
              {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
            </div>
          </div>

          <div className="text-center">
            <CosmicText variant="accent" size="lg">
              Next Renewal
            </CosmicText>
            <div className="text-white font-semibold mt-2">
              {daysUntilRenewal} days
            </div>
          </div>
        </div>

        {subscription.cancelAtPeriodEnd && (
          <div className="mt-6 p-4 rounded-lg bg-yellow-500/20 border border-yellow-400/30">
            <div className="flex items-center space-x-2 text-yellow-200">
              <span>⚠️</span>
              <span className="font-semibold">Subscription Ending</span>
            </div>
            <p className="text-yellow-100 text-sm mt-1">
              Your subscription will end on {subscription.currentPeriodEnd.toLocaleDateString()}.
              You can reactivate it anytime before then.
            </p>
          </div>
        )}
      </CosmicCard>
    );
  };

  const renderFeatureComparison = () => (
    <CosmicCard title="🌟 Feature Comparison" className="mb-8">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-purple-400/30">
              <th className="text-left py-3 text-purple-200">Feature</th>
              {SUBSCRIPTION_TIERS.map(tier => (
                <th key={tier.id} className="text-center py-3 text-purple-200 min-w-32">
                  {tier.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.values(PREMIUM_FEATURES).map((feature, index) => (
              <tr key={index} className="border-b border-purple-400/20">
                <td className="py-3 text-purple-100">{feature}</td>
                {SUBSCRIPTION_TIERS.map(tier => (
                  <td key={tier.id} className="text-center py-3">
                    {tier.features.includes(feature) ? (
                      <span className="text-green-400">✓</span>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CosmicCard>
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Cosmic background effects */}
      <StarField density={60} animated={true} />
      <GlowingOrb size={350} color="rgba(147, 51, 234, 0.2)" className="top-10 right-10" />
      <GlowingOrb size={200} color="rgba(59, 130, 246, 0.15)" className="bottom-20 left-20" />

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <CosmicText variant="primary" size="2xl">
            ✨ Choose Your Cosmic Path ✨
          </CosmicText>
          <p className="text-purple-200 mt-4 text-lg max-w-2xl mx-auto">
            Unlock the full power of your galactic journey with advanced features, 
            detailed charts, and cosmic insights tailored to your unique signature.
          </p>
        </div>

        <CosmicContainer variant="primary" className="p-8">
          {/* Current Subscription Info */}
          {renderCurrentSubscriptionInfo()}

          {/* Subscription Tiers */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {SUBSCRIPTION_TIERS.map(tier => {
              const currentTier = getCurrentTier();
              const isCurrentTier = tier.id === currentTier.id;
              return renderTierCard(tier, isCurrentTier);
            })}
          </div>

          {/* Feature Comparison */}
          {renderFeatureComparison()}

          {/* FAQ Section */}
          <CosmicCard title="💫 Frequently Asked Questions">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-white mb-2">
                  Can I change my subscription at any time?
                </h4>
                <p className="text-purple-200 text-sm">
                  Yes! You can upgrade, downgrade, or cancel your subscription at any time. 
                  Changes take effect at your next billing cycle.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">
                  What happens to my data if I cancel?
                </h4>
                <p className="text-purple-200 text-sm">
                  Your basic account and data remain safe. Premium features become unavailable, 
                  but you can reactivate them anytime by subscribing again.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">
                  Do you offer refunds?
                </h4>
                <p className="text-purple-200 text-sm">
                  We offer a 30-day money-back guarantee for all subscriptions. 
                  Contact support for assistance with refund requests.
                </p>
              </div>
            </div>
          </CosmicCard>
        </CosmicContainer>
      </div>
    </div>
  );
}