/**
 * product controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::product.product', ({ strapi }) => ({
    async compareProducts(ctx) {
        const { productIds } = ctx.query;
        
        if (!productIds || typeof productIds !== 'string') {
            return ctx.badRequest('productIds query parameter is required and must be a string');
        }
        
        console.log(productIds, "productIds");

        const ids = productIds.split(',')
        // .map(Number);
        // console.log(ids, "ids");

        const products = await strapi.entityService.findMany('api::product.product', {
            filters: { id: { $in: ids } },
            populate: {
                vendor: true,
                // product_feature_values: {
                //     populate: {
                //         feature_id: true
                //     }
                // }
                product_reviews: true
            }
        });

        return { data: products };
    }
}));