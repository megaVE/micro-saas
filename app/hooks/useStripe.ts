import { useEffect, useState } from "react";
import { loadStripe, type Stripe } from "@stripe/stripe-js";

export function useStripe() {
	const [stripe, setStripe] = useState<Stripe | null>(null);

	useEffect(() => {
		const loadStripeAsync = async () => {
			const stripeInstance = await loadStripe(
				process.env.NEXT_PUBLIC_STRIPE_PUB_KEY as string,
			);
			setStripe(stripeInstance);
		};

		loadStripeAsync();
	}, []);

	async function createPaymentStripeCheckout(checkoutData: unknown) {
		if (!stripe) return;

		try {
			const response = await fetch("/api/stripe/create-pay-checkout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(checkoutData),
			});
			const data = await response.json();

			await stripe.redirectToCheckout({ sessionId: data.sessionId });
		} catch (error) {
			console.error(error);
		}
	}

	async function createSubscriptionStripeCheckout(checkoutData: unknown) {
		if (!stripe) return;

		try {
			const response = await fetch("/api/stripe/create-subscription-checkout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(checkoutData),
			});
			const data = await response.json();

			await stripe.redirectToCheckout({ sessionId: data.sessionId });
		} catch (error) {
			console.error(error);
		}
	}

	async function handleCreateStripePortal(checkoutData: unknown) {
		try {
			const response = await fetch("/api/stripe/create-portal", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(checkoutData),
			});
			const data = await response.json();

			window.location.href = data.url;
		} catch (error) {
			console.error(error);
		}
	}

	return {
		createPaymentStripeCheckout,
		createSubscriptionStripeCheckout,
		handleCreateStripePortal,
	};
}
