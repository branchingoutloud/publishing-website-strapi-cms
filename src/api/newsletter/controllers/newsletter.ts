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
            });

            // If you need meta for pagination, you can
            const meta = await strapi.documents('api::newsletter.newsletter').count({ filters });

            return { data: result, meta: { pagination: { ...safePagination, total: meta } } };
        },
    })
)