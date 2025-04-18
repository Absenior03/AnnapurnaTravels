# Annapurna Tours and Travels

A modern, responsive tourism website built with Next.js, Tailwind CSS, Firebase, and Stripe integration.

## Features

- **Clean, Interactive UI/UX** - With animated parallax backgrounds and smooth transitions
- **User Authentication** - Secure sign-up and login using Firebase Auth
- **Admin Panel** - Manage tour packages, track bookings, and more
- **Dynamic Tour Pages** - Individual pages for each tour package with detailed information
- **Payment Integration** - Secure payment processing with Stripe (test mode)
- **Responsive Design** - Works seamlessly on mobile, tablet, and desktop devices
- **Real-time Database** - Firebase Firestore for real-time data management
- **Dynamic Images** - Integration with Pexels API for high-quality images

## Tech Stack

- **Frontend Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **Authentication & Database**: Firebase
- **Payment Processing**: Stripe
- **Animations**: Framer Motion
- **Image API**: Pexels
- **Icons**: React Icons

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn
- Firebase account
- Stripe account (for test mode)
- Pexels API key

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/annapurna-tours-and-travels.git
   cd annapurna-tours-and-travels
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:

   - Copy `.env.local.example` to `.env.local`
   - Fill in your Firebase, Stripe, and Pexels API credentials

4. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

## Project Structure

```
.
├── src/
│   ├── app/               # App router pages
│   ├── components/        # Reusable UI components
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Library configurations
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── public/                # Static assets
└── ...
```

## Deployment

This project is ready to be deployed on Vercel:

1. Push your code to GitHub.
2. Import your project in the Vercel dashboard.
3. Add your environment variables in the Vercel project settings.
4. Deploy!

## Admin Access

For admin panel access, use the following credentials:

- Email: admin@annapurnatours.com
- Password: securepassword123 (specified in your .env file)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Images provided by [Pexels](https://www.pexels.com/)
- Icons from [React Icons](https://react-icons.github.io/react-icons/)
