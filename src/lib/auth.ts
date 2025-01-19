import { PrismaClient } from "@prisma/client";
import type { NextAuthOptions } from "next-auth";
import credentials from "next-auth/providers/credentials";
import twilio from 'twilio';
import { v4 as uuidv4 } from 'uuid';



export const authOptions: NextAuthOptions = {
    providers: [
        credentials({
            name: 'Credentials',
            id: 'credentials',
            credentials: {
                phoneNumber: { label: "Phone Number", type: "text" },
                otpValue: { label: "OTP", type: "text" },
                signup: { label: "Sign Up", type: "boolean" },
            },
            authorize: async (credentials) => {
                const prisma = new PrismaClient();
                if (credentials?.signup) {
                    const user = await prisma.visitors_master.findFirst({
                        where: {
                            phonenumber: credentials.phoneNumber,
                        },
                    });
                    if (!user) {
                        throw new Error('User not found');
                    }
                    return { id: user.id, firstname: user.firstname, lastname: user.lastname, phone: user.phonenumber, image: user.image || '', created_at: user.created_at, last_signed_in: user.last_signed_in || '', events: user.events, active: user.active ?? false, role: user.role || '' } as any;

                } else {

                    const accountSid = process.env.TWILIO_ACCOUNT_SID;
                    const authToken = process.env.TWILIO_AUTH_TOKEN;

                    const service = process.env.TWILIO_SERVICE_SID || '';

                    const client = twilio(accountSid, authToken);
                    if (!credentials) {
                        throw new Error('No credentials provided');
                    }
                    const verificationCheck = await client.verify.v2
                        .services(service)
                        .verificationChecks.create({
                            to: credentials.phoneNumber,
                            code: credentials.otpValue,
                        });
                    if (verificationCheck.status === 'approved') {
                        const user = await prisma.visitors_master.findFirst({
                            where: {
                                phonenumber: credentials.phoneNumber,
                            },
                        });
                        if (!user) {
                            throw new Error('User not found');
                        }
                        user.last_signed_in = new Date().toISOString();
                        await prisma.visitors_master.update({
                            where: {
                                id: user.id,
                            },
                            data: {
                                last_signed_in: user.last_signed_in,
                            },
                        });
                        await prisma.$disconnect();
                        return { id: user.id, firstname: user.firstname, lastname: user.lastname, phone: user.phonenumber, image: user.image || '', created_at: user.created_at, last_signed_in: user.last_signed_in || '', events: user.events, active: user.active ?? false, role: user.role || '' } as any;
                    }
                    else {
                        throw new Error('Invalid OTP');
                    }
                }
            }
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.firstname = user.firstname;
                token.lastname = user.lastname;
                token.phone = user.phone;
                token.image = user.image;
                token.created_at = user.created_at;
                token.last_signed_in = user.last_signed_in;
                token.events = user.events;
                token.active = user.active;
                token.role = user.role;

            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                if (session.user) {
                    session.user.id = token.id;
                    session.user.firstname = token.firstname;
                    session.user.lastname = token.lastname;
                    session.user.phone = token.phone;
                    session.user.image = token.image;
                    session.user.created_at = token.created_at;
                    session.user.last_signed_in = token.last_signed_in;
                    session.user.events = token.events;
                    session.user.active = token.active;
                    session.user.role = token.role;
                }
            }
            return session;
        },
    },
    pages: {
        signIn: '/sign-in',
    }
}
