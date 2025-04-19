import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { v4 as uuidv4 } from "uuid";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const {
      amount,
      tourId,
      userId,
      currency = "INR",
      receipt = uuidv4(),
    } = await request.json();

    // Validate required fields
    if (!amount || !tourId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create order
    const order = await razorpay.orders.create({
      amount, // Amount in smallest currency unit (e.g., paise for INR)
      currency,
      receipt,
      notes: {
        tourId,
        userId,
      },
    });

    // Return order details
    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);

    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
