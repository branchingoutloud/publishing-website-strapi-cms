/**
 * product controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::product.product",
  ({ strapi }) => ({
    async findOne(ctx) {
      const { id } = ctx.params;
      const result = await strapi.documents("api::product.product").findOne({
        documentId: id,
        populate: {
          vendor: true,
          product_logo: true,
          category_reference: true,
          product_reviews: {
            populate: {
              user_id: true,
            },
          },
          product_feature_values: {
            populate: {
              feature_id: true,
            },
          },
        },
      });
      return result;
    },
    async find(ctx) {
      // Call the default find method
      // const { data, meta } = await super.find(ctx);

      // let features = await strapi.documents("api::product-feature-value.product-feature-value").findMany({
      //   filters: {
      //     product: { $in: data.map((product: any) => product.id) } as any
      //   },
      //   populate: {
      //     feature_id: true,
      //   },
      // });

      // console.log(features, "features");

      // Transform each product
      // const transformedData = data.map((product: any) => ({
      //   ...product,
      //   pros_and_cons: {
      //     pros_summary: this.extractSummaryPoints(product.pros),
      //     pros: [
      //       "Real-time collaboration",
      //       "Robust integrations",
      //       "User-friendly interface",
      //       "Scalable",
      //       "Cost-effective",
      //       "Cross-platform",
      //       "Secure",
      //       "Customizable",
      //       "Easy to use",
      //       "Fast",
      //     ],
      //     cons_summary: this.extractSummaryPoints(product.cons),
      //     cons: [
      //       "Difficult to use",
      //       "Expensive",
      //       "Not secure",
      //       "Not customizable",
      //       "Not scalable",
      //       "Not cross-platform",
      //       "Not robust",
      //       "Not fast",
      //       "Not easy to use",
      //       "Not cost-effective",
      //     ],
      //   },
      // }));
      // return { data: data, meta };

      const { pagination, filters, sort } = ctx.query;
      const safePagination =
        pagination && typeof pagination === "object" ? pagination : {};

      const results = await strapi.documents('api::product.product').findMany({
        filters,
        sort,
        pagination,
        populate: {
          vendor: true,
          product_logo: true,
          // category_reference: true,
          product_feature_values: {
            populate: {
              feature_id: true,
            },
          },
        },
      });

      // If you need meta for pagination, you can
      const meta = await strapi.documents('api::product.product').count({ filters });

      return { data: results, meta: { pagination: { ...safePagination, total: meta } } };

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

      let products = await strapi.documents("api::product.product").findMany({
        filters: { documentId: { $in: ids } },
        populate: {
          vendor: true,
          product_logo: true,
          product_feature_values: {
            populate: {
              feature_id: true,
            },
          },
        },
      });

      // products = products?.map((product: any) => {
      //   let features = {};
      //   product?.product_feature_values?.map((feature: any) => {
      //     features = {
      //       ...features,
      //       [feature?.feature_id?.name]: feature?.value,
      //     };
      //   });
      //   return {
      //     ...product,
      //     ["product_feature_values"]: features,
      //   };
      // });
      return { data: products };
    },
  })
);
