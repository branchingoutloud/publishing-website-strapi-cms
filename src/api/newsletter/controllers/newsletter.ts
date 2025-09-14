/**
 * newsletter controller
 */

import { factories } from '@strapi/strapi'
import EmailTemplateService from '../../../services/email-template'

export default factories.createCoreController(
    'api::newsletter.newsletter',
    ({ strapi }) => ({
        async findOne(ctx) {
            const { id } = ctx.params;
            const result = await strapi.documents("api::newsletter.newsletter").findOne({
                documentId: id,
                populate: {
                    newsletter_drafts: {
                        fields: ["outline", "body_text", "draft_status"]
                    },
                    topic_id: {
                        fields: ["title", "description", "topic_status"]
                    },
                }
            });

            return result;
        },
        async find(ctx) {
            const { pagination, filters, sort } = ctx.query;
            const safePagination = pagination && typeof pagination === "object" ? pagination : {};

            const result = await strapi.documents("api::newsletter.newsletter").findMany({
                filters,
                sort,
                pagination,
                populate: {
                    newsletter_drafts: {
                        fields: ["outline", "body_text", "draft_status"]
                    },
                    topic_id: {
                        fields: ["title", "description", "topic_status"]
                    },
                },
            });

            // If you need meta for pagination, you can
            const meta = await strapi.documents('api::newsletter.newsletter').count({ filters });

            return { data: result, meta: { pagination: { ...safePagination, total: meta } } };
        },
        async create(ctx) {
            const result = await strapi.documents("api::newsletter.newsletter").create(ctx.request.body);

            console.log("NewsLetter created : ", result);

            const emailService = strapi
                .plugin('email')
                .service('email');

            try {
                console.log('Newsletter creation result:', result);

                // Get the HTML template with newsletter data
                const htmlTemplate = await EmailTemplateService.getNewsletterTemplate({
                    title: result.title,
                    description: result.description,
                    subheading: 'This weeks updated intel!',
                    newsletterId: result.documentId,
                    websiteUrl: 'https://aimsintel.com'
                });

                console.log('HTML template generated, length:', htmlTemplate.length);

                const emailOptions = {
                    to: 'pranav.sonawane@pyrack.com',
                    from: 'pyracktesting@gmail.com',
                    subject: `New Newsletter: ${result.title || 'Newsletter'}`,
                    text: `Check out your latest newsletter at https://aimsintel.com/newsletter/${result.documentId}`,
                    html: htmlTemplate,
                };

                console.log('Sending email with options:', {
                    ...emailOptions,
                    html: `[HTML Content - ${htmlTemplate.length} characters]`
                });

                await emailService.send(emailOptions);

                console.log('Newsletter email sent successfully');
            } catch (error) {
                console.error('Error sending newsletter email:', error);
                console.error('Error stack:', error.stack);
                // Don't throw error to avoid breaking newsletter creation
            }

            return result;
        },
    })
)