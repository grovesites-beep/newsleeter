import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
    console.warn('RESEND_API_KEY is not defined. Email service will not work correctly.');
}

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const emailService = {
    async sendEmail({ to, subject, html, from }: { to: string | string[], subject: string, html: string, from?: string }) {
        if (!resend) throw new Error('Resend client not initialized');

        return await resend.emails.send({
            from: from || 'Newsletter Grove <onboarding@resend.dev>',
            to,
            subject,
            html,
        });
    },

    async sendBulkEmails(emails: { to: string, subject: string, html: string, from?: string }[]) {
        if (!resend) throw new Error('Resend client not initialized');

        // Resend batch API has a limit (usually 100 per call)
        // We'll implement basic batching here if needed or just use their batch method
        return await resend.batch.send(emails.map(email => ({
            from: email.from || 'Newsletter Grove <onboarding@resend.dev>',
            to: email.to,
            subject: email.subject,
            html: email.html,
        })));
    },

    async scheduleEmail({ to, subject, html, from, scheduledAt }: { to: string, subject: string, html: string, from?: string, scheduledAt: string }) {
        if (!resend) throw new Error('Resend client not initialized');

        return await resend.emails.send({
            from: from || 'Newsletter Grove <onboarding@resend.dev>',
            to,
            subject,
            html,
            scheduledAt,
        });
    }
};
