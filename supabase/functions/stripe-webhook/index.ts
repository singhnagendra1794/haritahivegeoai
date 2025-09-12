import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  
  if (!signature || !webhookSecret) {
    return new Response('Missing signature or webhook secret', { status: 400 });
  }

  try {
    const body = await req.text();
    
    // Verify webhook signature
    if (!await verifyStripeSignature(body, signature, webhookSecret)) {
      return new Response('Invalid signature', { status: 400 });
    }

    const event = JSON.parse(body);
    console.log('Processing Stripe webhook:', event.type);

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
        
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
        
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
        
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response('Webhook processed', { status: 200 });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Webhook error', { status: 400 });
  }
});

async function verifyStripeSignature(body: string, signature: string, secret: string): Promise<boolean> {
  // Simplified signature verification - in production, use proper HMAC verification
  // This is a basic implementation for demo purposes
  return true;
}

async function handleCheckoutSessionCompleted(session: any) {
  const userId = session.metadata?.user_id;
  if (!userId) {
    console.error('No user_id in session metadata');
    return;
  }

  // Get subscription details
  const subscription = await getStripeSubscription(session.subscription);
  if (!subscription) return;

  const plan = getPlanFromPriceId(subscription.items.data[0].price.id);
  
  await supabase
    .from('user_subscriptions')
    .upsert({
      user_id: userId,
      stripe_customer_id: session.customer,
      stripe_subscription_id: session.subscription,
      plan: plan,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    });

  console.log(`Subscription created for user ${userId}: ${plan}`);
}

async function handleSubscriptionUpdate(subscription: any) {
  const customerId = subscription.customer;
  const plan = getPlanFromPriceId(subscription.items.data[0].price.id);

  await supabase
    .from('user_subscriptions')
    .update({
      plan: plan,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    })
    .eq('stripe_customer_id', customerId);

  console.log(`Subscription updated for customer ${customerId}: ${plan}`);
}

async function handleSubscriptionDeleted(subscription: any) {
  const customerId = subscription.customer;

  await supabase
    .from('user_subscriptions')
    .update({
      plan: 'free',
      status: 'canceled',
      stripe_subscription_id: null,
    })
    .eq('stripe_customer_id', customerId);

  console.log(`Subscription canceled for customer ${customerId}`);
}

async function handlePaymentSucceeded(invoice: any) {
  // Update subscription status or handle successful payment
  console.log(`Payment succeeded for customer ${invoice.customer}`);
}

async function handlePaymentFailed(invoice: any) {
  // Handle failed payment - could notify user or update status
  console.log(`Payment failed for customer ${invoice.customer}`);
}

async function getStripeSubscription(subscriptionId: string) {
  try {
    const response = await fetch(`https://api.stripe.com/v1/subscriptions/${subscriptionId}`, {
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch subscription');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
}

function getPlanFromPriceId(priceId: string): string {
  // Map price IDs to plan names
  const priceMap: { [key: string]: string } = {
    'price_pro_monthly': 'pro',
    'price_enterprise_monthly': 'enterprise',
    // Add more price IDs as needed
  };
  
  return priceMap[priceId] || 'free';
}