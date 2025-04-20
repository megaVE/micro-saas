import { db } from "@/app/lib/firebase";
import resend from "@/app/lib/resend";
import "server-only";

import type Stripe from "stripe";

export async function handleStripePayment(
	event: Stripe.CheckoutSessionCompletedEvent,
) {
	if (event.data.object.payment_status === "paid") {
		console.log("Payment successful");

		const metadata = event.data.object.metadata;
		const userId = metadata?.userId;
		const userEmail =
			event.data.object.customer_email ??
			event.data.object.customer_details?.email;

		if (!userId || !userEmail) {
			console.error("User ID or User Email not found");
			return;
		}

		await db.collection("users").doc(userId).update({
			stripeSubscriptionId: event.data.object.subscription,
			subscriptionStatus: "active",
		});

		const { data, error } = await resend.emails.send({
			from: "Acme <test@email.com>",
			to: [userEmail],
			subject: "Payment Success",
			text: "",
		});

		if (error) {
			console.error(error);
		}

		console.log(data);
	}
}
