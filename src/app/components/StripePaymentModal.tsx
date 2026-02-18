import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {

  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Loader2, Lock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { stripeConfig } from '../config/stripe';

// Initialize Stripe with your publishable key from config


interface StripePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  type: 'subscription' | 'ppv' | 'wallet' | 'tip';
  creatorName?: string;
  onSuccess?: () => void;
}

function CheckoutForm({ 
  amount, 
  onSuccess, 
  onClose 
}: { 
  amount: number; 
  onSuccess?: () => void; 
  onClose: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // In a real implementation, you would:
      // 1. Create a PaymentIntent on your server
      // 2. Return the client secret
      // 3. Confirm the payment with the client secret
      
      // For demo purposes, we'll simulate the payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success
      const simulatedSuccess = Math.random() > 0.1; // 90% success rate
      
      if (simulatedSuccess) {
        setSucceeded(true);
        toast.success('Payment successful!');
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1500);
      } else {
        throw new Error('Payment failed. Please try again.');
      }

      /* Real Stripe implementation:
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required',
      });

      if (submitError) {
        setError(submitError.message || 'Payment failed');
      } else {
        setSucceeded(true);
        toast.success('Payment successful!');
        onSuccess?.();
      }
      */

    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!succeeded ? (
        <>
          {/* Amount Display */}
          <div className="bg-zinc-800/50 rounded-lg p-4 text-center border border-zinc-700">
            <p className="text-sm text-zinc-400 mb-1">Total Amount</p>
            <p className="text-3xl font-bold">${amount.toFixed(2)}</p>
          </div>

          {/* Payment Element - This would render Stripe's payment form */}
          <div className="space-y-4">
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
              <p className="text-sm text-zinc-400 mb-3">Card Details</p>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Card Number"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm"
                  disabled={processing}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM / YY"
                    className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm"
                    disabled={processing}
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm"
                    disabled={processing}
                  />
                </div>
              </div>
              <p className="text-xs text-zinc-500 mt-3 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Powered by Stripe - Your payment info is secure
              </p>
            </div>

            {/* In real implementation, use PaymentElement:
            <PaymentElement />
            */}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 border-zinc-700"
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={!stripe || processing}
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay $${amount.toFixed(2)}`
              )}
            </Button>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl mb-2">Payment Successful!</h3>
          <p className="text-zinc-400">Your transaction has been completed.</p>
        </motion.div>
      )}
    </form>
  );
}

export function StripePaymentModal({
  isOpen,
  onClose,
  amount,
  type,
  creatorName,
  onSuccess
}: StripePaymentModalProps) {
  const getTitle = () => {
    switch (type) {
      case 'subscription':
        return `Subscribe to ${creatorName}`;
      case 'ppv':
        return 'Unlock Content';
      case 'wallet':
        return 'Add Funds to Wallet';
      case 'tip':
        return `Send Tip to ${creatorName}`;
      default:
        return 'Complete Payment';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'subscription':
        return `Monthly subscription for $${amount.toFixed(2)}`;
      case 'ppv':
        return 'One-time payment to unlock this content';
      case 'wallet':
        return 'Add funds to your wallet for future purchases';
      case 'tip':
        return 'Show your support with a tip';
      default:
        return '';
    }
  };



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        <div className="pt-4">
          {/* In real implementation with client secret:
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm amount={amount} onSuccess={onSuccess} onClose={onClose} />
          </Elements>
          */}
          
          {/* For demo without client secret: */}
          <CheckoutForm amount={amount} onSuccess={onSuccess} onClose={onClose} />
        </div>

        <div className="text-xs text-center text-zinc-500 space-y-1">
          <p>🔒 Secure payment processing by Stripe</p>
          <p className="text-[10px]">
            Test mode: Use card 4242 4242 4242 4242 with any future expiry and CVC
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}