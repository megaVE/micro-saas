import mpClient from "@/app/lib/mercado-pago";
import { Preference } from "mercadopago";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const { testId, userEmail } = await req.json();

	try {
		const preference = new Preference(mpClient);
		const createdPreference = await preference.create({
			body: {
				external_reference: testId, // Impacts on MercadoPago's score
				metadata: {
					testId, // Converted into snakecase -> test_id
					userEmail,
				},
				...(userEmail && { payer: { email: userEmail } }), // Impacts on MercadoPago's score
				items: [
					{
						id: "",
						description: "",
						title: "",
						quantity: 1,
						unit_price: 1,
						currency_id: "BRL",
						category_id: "services",
					},
				],
				payment_methods: {
					installments: 12,
					excluded_payment_methods: [
						{
							id: "bolbradesco",
						},
						{
							id: "pec",
						},
					],
					// excluded_payment_types: [
					//     {
					//         id: "debit_card"
					//     },
					//     {
					//         id: "credit_card"
					//     }
					// ]
				},
				auto_return: "approved",
				back_urls: {
					success: `${req.headers.get("origin")}/api/mercado-pago/success`,
					failure: `${req.headers.get("origin")}/api/mercado-pago/failure`,
					pending: `${req.headers.get("origin")}/api/mercado-pago/pending`,
				},
			},
		});
		if (!createdPreference.id) {
			return NextResponse.json(
				{
					error: "Error creating checkout with Mercado Pago.",
				},
				{ status: 500 },
			);
		}

		return NextResponse.json(
			{
				preferenceId: createdPreference.id,
				initPoint: createdPreference.init_point,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{
				error: "Error creating checkout with Mercado Pago.",
			},
			{ status: 500 },
		);
	}
}
