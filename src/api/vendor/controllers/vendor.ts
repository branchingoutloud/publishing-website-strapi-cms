/**
 * vendor controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::vendor.vendor', ({ strapi }) => ({
  async getVendorsById(ctx) {
    const { id } = ctx.params;

    try {
      if (id) {
        const vendor = await strapi.documents("api::vendor.vendor").findOne({
          documentId: id,
          populate: {
            products: {
              populate: {
                product_logo: { fields: ["url", "formats"] as any },
                category_reference: { fields: ["name", "description"] as any },
                product_reviews: { fields: ["rating", "comment"] as any },
                product_feature_values: {
                  populate: {
                    feature_id: { fields: ["name"] as any }
                  }
                }
              }
            },
            vendor_category_id: { fields: ["name"] as any }
          }
        });

        if (!vendor) {
          return ctx.notFound('Vendor not found');
        }

        return ctx.send({
          data: vendor,
          meta: {}
        });
      } else {
        const vendors = await strapi.documents("api::vendor.vendor").findMany({
          populate: {
            products: {
              populate: {
                product_logo: true,
                category_reference: { fields: ["name", "description", "search_terms"] as any },
                product_reviews: { fields: ["rating", "comment"] as any },
                product_feature_values: {
                  populate: {
                    feature_id: { fields: ["name"] as any }
                  }
                }
              }
            },
            vendor_category_id: { fields: ["name"] as any }
          }
        });

        return ctx.send({
          data: vendors,
          meta: {}
        });
      }
    } catch (error) {
      strapi.log.error('Error in getVendorsById:', error);
      return ctx.internalServerError('An error occurred while fetching vendors');
    }
  }
}));
