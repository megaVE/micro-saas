import resend from "@/app/lib/resend";
import type { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";

export async function handleMercadoPagoPayment(paymentData: PaymentResponse) {
	const metadata = paymentData.metadata;
	const userEmail = metadata.user_email;
	const testId = metadata.test_id;

	console.log("PAYMENT SUCCESSFUL", userEmail, testId);

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
