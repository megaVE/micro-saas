import stripe from "@/app/lib/stripe";
import { handleStripeCancelSubscription } from "@/app/server/stripe/handle-cancel";
import { handleStripePayment } from "@/app/server/stripe/handle-payment";
import { handleStripeSubscription } from "@/app/server/stripe/handle-subscription";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

const secret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
	try {
		const body = await req.text();
		const headersList = await headers();
		const signature = headersList.get("stripe-signature");

		if (!signature || !secret) {
			return NextResponse.json(
				{ error: "No signature or secret" },
				{ status: 400 },
			);
		}

		const event = stripe.webhooks.constructEvent(body, signature, secret);

		switch (event.type) {
			// Payment
			case "checkout.session.completed":
				await (async () => {
					const metadata = event.data.object.metadata;

					if (metadata?.price === process.env.STRIPE_PRODUCT_PRICE_ID) {
						await handleStripePayment(event);
					}
					if (metadata?.price === process.env.STRIPE_SUBSCRIPTION_PRICE_ID) {
						await handleStripeSubscription(event);
					}
				})();
				break;
			case "checkout.session.expired":
				// Send Email
				break;

			// Boleto
			case "checkout.session.async_payment_succeeded":
				// Send Email
				break;
			case "checkout.session.async_payment_failed":
				// Send Email
				break;

			// Subscription
			case "customer.subscription.created":
				// Send Email
				break;
			case "customer.subscription.updated":
				// Send Email
				break;
			case "customer.subscription.deleted":
				await handleStripeCancelSubscription(event);
				break;

			default:
				console.log("Unhandled event type ", event.type);
		}

		return NextResponse.json({ message: "Webhook received" }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
