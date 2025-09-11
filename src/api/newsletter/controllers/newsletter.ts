/**
 * newsletter controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController(
    'api::newsletter.newsletter',
    ({ strapi }) => ({
        async findOne(ctx) {
            const { id } = ctx.params;
            const result = await strapi.documents("api::newsletter.newsletter").findOne({
                documentId: id,
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

            emailService.send({
                to: 'pranav.sonawane@pyrack.com',
                from: 'pranav.sonawane@pyrack.com',
                subject: 'Here is your newsletter',
                text: `Check out your latest newsletter at https://aimsintel.com/newsletter/${result.id}`,
            });

            return result;
        },
    })
)