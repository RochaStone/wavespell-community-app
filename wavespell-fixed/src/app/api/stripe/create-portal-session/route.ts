import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: NextRequest) {
  try {
    const { customerId } = await request.json();

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Create Stripe customer portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${request.nextUrl.origin}/subscription`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}