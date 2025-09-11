export default ({ env }) => ({
    email: {
        config: {
            provider: 'nodemailer',
            providerOptions: {
                host: env('SMTP_HOST', 'smtp.gmail.com'),
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
    upload: {
        config: {
            provider: 'aws-s3',
            providerOptions: {
                baseUrl: env('CDN_URL'), // Optional: if using CloudFront
                rootPath: env('CDN_ROOT_PATH'), // Optional: root path for files
                s3Options: {
                    credentials: {
                        accessKeyId: env('AWS_ACCESS_KEY_ID'),
                        secretAccessKey: env('AWS_ACCESS_SECRET'),
                    },
                    region: env('AWS_REGION'),
                    params: {
                        // ACL: env('AWS_ACL', 'public-read'),
                        // signedUrlExpires: env('AWS_SIGNED_URL_EXPIRES', 15 * 60),
                        Bucket: env('AWS_BUCKET'),
                    },
                },
            },
            actionOptions: {
                upload: {},
                uploadStream: {},
                delete: {},
            },
        },
    },
});
