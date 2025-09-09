export default ({ env }) => ({
    email: {
        config: {
            provider: 'nodemailer',
            providerOptions: {
                host: env('SMTP_HOST', 'smtp-relay.brevo.com'),
                port: env('SMTP_PORT', 587),
                secure: false, // true for 465, false for other ports
                auth: {
                    user: env('SMTP_USERNAME'),
                    pass: env('SMTP_PASSWORD'),
                },
                // Optional: Additional security settings
                tls: {
                    rejectUnauthorized: false
                }
            },
            settings: {
                defaultFrom: env('DEFAULT_FROM_EMAIL'),
                defaultReplyTo: env('DEFAULT_REPLY_TO_EMAIL'),
            },
        },
    },
});
