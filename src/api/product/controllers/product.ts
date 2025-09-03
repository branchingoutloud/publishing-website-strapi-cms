/**
 * product controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::product.product",
  ({ strapi }) => ({
    async find(ctx) {
      // Call the default find method
      const { data, meta } = await super.find(ctx);

      // Transform each product
      const transformedData = data.map((product) => ({
        ...product,
        pros_and_cons: {
          pros_summary: this.extractSummaryPoints(product.pros),
          pros: [
            "Real-time collaboration",
            "Robust integrations",
            "User-friendly interface",
            "Scalable",
            "Cost-effective",
            "Cross-platform",
            "Secure",
            "Customizable",
            "Easy to use",
            "Fast",
          ],
          cons_summary: this.extractSummaryPoints(product.cons),
          cons: [
            "Difficult to use",
            "Expensive",
            "Not secure",
            "Not customizable",
            "Not scalable",
            "Not cross-platform",
            "Not robust",
            "Not fast",
            "Not easy to use",
            "Not cost-effective",
          ],
        },
      }));

      return { data: transformedData, meta };
    },

    extractSummaryPoints(text) {
      // How do you want to split the text into points?
      return text ? text.split(",").map((point) => point.trim()) : [];
    },
    async compareProducts(ctx) {
      const { productIds } = ctx.query;

      if (!productIds || typeof productIds !== "string") {
        return ctx.badRequest(
          "productIds query parameter is required and must be a string"
        );
      }

      console.log(productIds, "productIds");

      const ids = productIds.split(",");
      // .map(Number);
      console.log(ids, "ids");

      let products = await strapi.entityService.findMany(
        "api::product.product",
        {
          where: { documentId: { $in: ids } },
          populate: {
            vendor: true,
            product_logo: true,
            product_feature_values: {
              populate: {
                feature_id: true,
              },
            },
          },
        }
      );
      products = products?.map((product: any) => {
        let features = {};
        product?.product_feature_values?.map((feature: any) => {
          features = {
            ...features,
            [feature?.feature_id?.name]: feature?.value,
          };
        });
        return {
          ...product,
          ["product_feature_values"]: features,
        };
      });
      return { data: products };
    },
  })
);
