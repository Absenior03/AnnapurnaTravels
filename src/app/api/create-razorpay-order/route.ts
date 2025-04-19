import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { amount, tourId, userId, currency, receipt } = await request.json();

    // Initialize Razorpay instance with your key ID and secret
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });

    // Create an order
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt,
      notes: {
        tourId,
        userId,
      },
    });

    // Return the order details to the client
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
} 