// Stripe integration — install package and configure env vars to enable:
//   npm install stripe
//   Required: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
//   Optional: STRIPE_PUBLISHABLE_KEY (for client-side Stripe.js)

export const stripeEnabled = !!process.env.STRIPE_SECRET_KEY;
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";

// Uncomment after: npm install stripe
// import Stripe from "stripe";
// export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2024-06-20",
// });
