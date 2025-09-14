/**
 * resource controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::resource.resource', ({ strapi }) => ({
    async find(ctx) {
        const result = await strapi.documents("api::resource.resource").findMany({
            populate: {
                topic_id: true,
                type_id: true,
                author_id: true,
                resource_files: {
                    populate: ['file'] as any,
                    thumbnail: true
                }
            }
        });
        return result;
    },
}));
