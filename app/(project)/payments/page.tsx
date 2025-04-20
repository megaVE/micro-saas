"use client";

import { useMercadoPago } from "@/app/hooks/useMercadoPago";
import { useStripe } from "@/app/hooks/useStripe";

export default function Payments() {
	const {
		createPaymentStripeCheckout,
		createSubscriptionStripeCheckout,
		handleCreateStripePortal,
	} = useStripe();

	const { createMercadoPagoCheckout } = useMercadoPago();

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
				Create Stripe Payment Portal
			</button>
			<button
				className="border rounded-md px-1"
				type="button"
				onClick={() =>
					createMercadoPagoCheckout({
						testId: "123",
						userEmail: "test@email.com",
					})
				}
			>
				Create Mercado Pago Payment Portal
			</button>
		</div>
	);
}
