"use client";

import { useStripe } from "@/app/hooks/useStripe";

export default function Payments() {
	const {
		createPaymentStripeCheckout,
		createSubscriptionStripeCheckout,
		handleCreateStripePortal,
	} = useStripe();

	return (
		<div>
			<h1>Payments</h1>
			<button
				className="border rounded-md px-1"
				type="button"
				onClick={() => createPaymentStripeCheckout({ userId: 123 })}
			>
				Create Stripe Payment
			</button>
			<button
				className="border rounded-md px-1"
				type="button"
				onClick={() => createSubscriptionStripeCheckout({ userId: 123 })}
			>
				Create Stripe Subscription
			</button>
			<button
				className="border rounded-md px-1"
				type="button"
				onClick={() => handleCreateStripePortal({ userId: 123 })}
			>
				Create Payment Portal
			</button>
		</div>
	);
}
