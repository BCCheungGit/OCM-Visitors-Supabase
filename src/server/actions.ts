"use server";


import { PrismaClient } from "@prisma/client";
import twilio from 'twilio';


import { v4 as uuidv4 } from 'uuid';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const service = process.env.TWILIO_SERVICE_SID || '';




export async function createVerification(phone: string) {
    if (!phone) {
        return { error: 'Phone number is required' }
    }
    const client = twilio(accountSid, authToken);
    const verification = await client.verify.v2
        .services(service)
        .verifications.create({
            channel: 'sms',
            to: phone,
        });
    return JSON.stringify({ verification });
}






export async function checkVerification(phone: string, code: string, formInfo: any) {
    if (!phone || !code) {
        return { error: 'Phone number and code are required' }
    }
    const client = twilio(accountSid, authToken);
    const verificationCheck = await client.verify.v2
        .services(service)
        .verificationChecks.create({
            to: phone,
            code: code,
        });
    const prisma = new PrismaClient();
    if (verificationCheck.status === 'approved') {
        const newid = uuidv4();
        const res = await prisma.visitors_master.create({
            data: {
                id: newid,
                firstname: formInfo.firstname as string,
                lastname: formInfo.lastname as string,
                phonenumber: formInfo.phone as string,
                created_at: new Date().toISOString(),
                last_signed_in: new Date().toISOString(),
                events: "",
                active: true,
                role: "visitor"
            }
        })
        await prisma.$disconnect();
        return JSON.stringify({ res });
    }
    else {
        return { error: 'Invalid code' }
    }

}



