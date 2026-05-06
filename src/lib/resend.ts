import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const FROM_EMAIL = "QARTA <noreply@qarta.be>";
export const ADMIN_EMAIL = "gobinthib99@gmail.com";
