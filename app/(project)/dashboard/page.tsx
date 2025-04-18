import { handleAuth } from "@/app/actions/handle-auth";
import { auth } from "@/app/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Dashboard() {
	const session = await auth();

	if (!session) {
		redirect("/login");
	}

	const userEmail = session.user?.email;

	return (
		<div>
			<h1>Dashboard</h1>
			{userEmail && (
				<form action={handleAuth}>
					<p>{userEmail}</p>
					<button
						type="submit"
						className="border rounded-md px-2 py-1 cursor-pointer"
					>
						Logout
					</button>
				</form>
			)}
			<Link href="/payments">Payments</Link>
		</div>
	);
}
