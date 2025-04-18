import { handlers } from "@/app/lib/auth";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { GET, POST } = handlers;

export const { auth, signIn, signOut } = NextAuth({
	providers: [
		Google({
			authorization: {
				params: {
					prompt: "consent",
					access_type: "offline",
					response_type: "code",
				},
			},
		}),
	],
});
