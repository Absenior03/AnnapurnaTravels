import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { v4 as uuidv4 } from "uuid";

// Check if Razorpay credentials are available
const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

// Initialize Razorpay instance or create a mock implementation
let razorpay: Razorpay | null = null;

// Only initialize Razorpay if credentials are available
if (razorpayKeyId && razorpayKeySecret) {
  razorpay = new Razorpay({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret,
  });
}

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

    // If Razorpay is not initialized, return a mock order for development
    if (!razorpay) {
      console.warn("Razorpay not initialized. Using mock implementation.");
      return NextResponse.json({
        id: `order_${uuidv4().replace(/-/g, "")}`,
        entity: "order",
        amount,
        amount_paid: 0,
        amount_due: amount,
        currency,
        receipt,
        status: "created",
        notes: {
          tourId,
          userId,
        },
        created_at: Date.now(),
      });
    }

    // Create order with Razorpay
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
