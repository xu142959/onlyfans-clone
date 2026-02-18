// Stripe Configuration
// This file manages Stripe API keys and configuration

export const stripeConfig = {
  // Public key (safe to expose in client-side code)
  publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51Ox737QKYCKMFsRZm9ldPglv5mWhmsSxJRvebSU44DuBkIINeMnNcSQf3HZ84doALvMq9BAPkUMpNJgVwd4e0PBo00GKMyaNRz',
  
  // Secret key (should ONLY be used server-side in production)
  // This should be set in environment variables or on the backend
  secretKey: import.meta.env.VITE_STRIPE_SECRET_KEY || '',
  
  // Stripe options
  options: {
    apiVersion: '2024-11-20.acacia' as const,
  },
};

// Validate Stripe configuration
export function validateStripeConfig(): boolean {
  const hasPublicKey = !!stripeConfig.publicKey && stripeConfig.publicKey.startsWith('pk_');
  
  if (!hasPublicKey) {
    console.error('⚠️ Stripe public key is missing or invalid');
    return false;
  }
  
  // Check if using test keys in production
  if (import.meta.env.PROD && stripeConfig.publicKey.includes('test')) {
    console.warn('⚠️ WARNING: Using test Stripe keys in production!');
  }
  
  return true;
}

// Currency settings
export const currency = {
  code: 'USD',
  symbol: '$',
  minimumAmount: 0.50, // Minimum charge amount in USD
};

// Test card numbers for development
export const testCards = {
  success: '4242424242424242',
  requiresAuthentication: '4000002500003155',
  declined: '4000000000009995',
  insufficientFunds: '4000000000009995',
  expiredCard: '4000000000000069',
};

export default stripeConfig;
