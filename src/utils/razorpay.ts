import { Tour } from '@/types';

// Function to format price in Indian Rupees
export const formatRupees = (amount: number): string => {
  // Format using Indian numbering system (e.g., ₹1,00,000 instead of ₹100,000)
  return amount.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });
};

// Function to initialize Razorpay payment
export const initializeRazorpayPayment = async (
  orderId: string,
  amount: number,
  tour: Tour,
  userEmail: string,
  userName: string,
  onSuccess: () => void,
  onError: (error: any) => void
) => {
  // Check if Razorpay is available
  if (!(window as any).Razorpay) {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }

  // Create a new Razorpay instance
  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: amount * 100, // Razorpay expects amount in paise (INR*100)
    currency: 'INR',
    name: 'Annapurna Tours',
    description: `Payment for ${tour.title}`,
    order_id: orderId,
    prefill: {
      name: userName,
      email: userEmail,
    },
    theme: {
      color: '#10b981', // emerald-600 color
    },
    handler: function (response: any) {
      // Handle successful payment
      if (response.razorpay_payment_id && response.razorpay_order_id) {
        onSuccess();
      } else {
        onError(new Error('Payment failed'));
      }
    },
    modal: {
      ondismiss: function () {
        console.log('Payment window closed');
      },
    },
  };

  const razorpay = new (window as any).Razorpay(options);
  razorpay.open();
  
  return razorpay;
};

// Function to create a Razorpay order (to be called from server component or API)
export const createRazorpayOrder = async (amount: number, tourId: string, userId: string) => {
  try {
    // This would be a server-side API call in a real app
    const response = await fetch('/api/create-razorpay-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to paise
        tourId,
        userId,
        currency: 'INR',
        receipt: `receipt_${tourId}_${Date.now()}`,
      }),
    });

    const data = await response.json();
    
    if (data.id) {
      return data.id; // Return the order ID
    } else {
      throw new Error('Failed to create order');
    }
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
}; 