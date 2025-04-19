import { loadStripe } from '@stripe/stripe-js';

// Load the Stripe publishable key
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

// Create payment intent on the server (this would be called from an API route)
export async function createPaymentIntent(amount: number, tourId: string, userId: string) {
  try {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, tourId, userId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
} 