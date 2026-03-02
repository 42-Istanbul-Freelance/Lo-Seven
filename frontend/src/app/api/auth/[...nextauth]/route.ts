import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing credentials");
                }

                try {
                    const res = await fetch(`${process.env.BACKEND_URL || 'http://localhost:8080'}/api/v1/auth/login`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    });

                    const user = await res.json();

                    if (res.ok && user && user.token) {
                        return {
                            id: String(user.id),
                            email: user.email,
                            name: `${user.firstName} ${user.lastName}`,
                            image: user.profilePictureUrl || undefined,
                            role: user.role,
                            accessToken: user.token,
                        };
                    } else {
                        throw new Error(user.message || "Invalid credentials");
                    }
                } catch (error) {
                    console.error("Auth error:", error);
                    throw new Error("Authentication failed");
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.image = user.image;
                token.accessToken = user.accessToken;
            }
            if (trigger === "update" && session?.image) {
                token.image = session.image;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                if (token.image) {
                    session.user.image = token.image as string;
                }
                session.accessToken = token.accessToken as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_development_only_12345",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
