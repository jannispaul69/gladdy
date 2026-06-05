// PayPal integration — install package and configure env vars to enable:
//   npm install @paypal/checkout-server-sdk
//   Required: PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET
//   Optional: PAYPAL_MODE (sandbox | live, defaults to sandbox)

export const paypalEnabled = !!process.env.PAYPAL_CLIENT_ID;
export const paypalMode = (process.env.PAYPAL_MODE ?? "sandbox") as "sandbox" | "live";

// Uncomment after: npm install @paypal/checkout-server-sdk
// import paypal from "@paypal/checkout-server-sdk";
// const env = paypalMode === "live"
//   ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID!, process.env.PAYPAL_CLIENT_SECRET!)
//   : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID!, process.env.PAYPAL_CLIENT_SECRET!);
// export const paypalClient = new paypal.core.PayPalHttpClient(env);
