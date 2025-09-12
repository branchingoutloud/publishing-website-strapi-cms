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
                baseUrl: env('CDN_URL'),
                // rootPath: env('CDN_URL'),
                s3Options: {
                    credentials: {
                        accessKeyId: env('AWS_ACCESS_KEY_ID'),
                        secretAccessKey: env('AWS_ACCESS_SECRET'),
                    },
                    region: env('AWS_REGION'),
                    params: {
                        Bucket: env('AWS_BUCKET'),
                        // DO NOT include ACL parameter at all
                        // ACL: 'public-read', // Remove this line
                        ACL: 'private', // Set to private instead of public-read
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
