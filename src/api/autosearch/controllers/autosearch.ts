/**
 * autosearch controller
 */

import { factories } from '@strapi/strapi'

// export default factories.createCoreController('api::autosearch.autosearch');

export default factories.createCoreController('api::autosearch.autosearch', ({ strapi }) => ({
    async findOne(ctx) {
        const { id } = ctx.params;
        const result = await strapi.documents("api::autosearch.autosearch").findOne({
            documentId: id,
        });
        return result;
    },
    async find(ctx) {
        const result = await strapi.documents("api::autosearch.autosearch").findMany({});
        return result;
    },
    async getProductSearchJson(ctx) {
        const products = await strapi.documents("api::product.product").findMany({
            fields: ["name"],
            populate: {
                category_reference: {
                    fields: ["name"],
                },
            }
        });

        const productCategory = await strapi.documents("api::category.category").findMany({
            fields: ["name", "search_terms"] as any
        })

        const mergedData = { products, productCategory };

        let response;
        const matchedDocuments = await strapi
            .documents("api::autosearch.autosearch")
            .findMany({
                filters: { type: "product" },
                limit: 1,
                // fields: ['documentId'] // fetch only needed field for update
            });
        if (matchedDocuments.length > 0) {
            const documentId = matchedDocuments[0].documentId;
            response = await strapi
                .documents("api::autosearch.autosearch")
                .update({
                    documentId: documentId,
                    data: {
                        search_json: JSON.stringify(mergedData) as any
                    }
                });
            console.log('Updated document:', response);
        } else {
            console.log('No document found with type "product"');
        }

        return response;
    },


    // async getProductSearchJson1(ctx) {
    //     const products = await strapi.documents("api::product.product").findMany({
    //         fields: ["name"],
    //         populate: {
    //             category_reference: {
    //                 fields: ["name"],
    //             },
    //         }
    //     });

    //     const productCategory = await strapi.documents("api::category.category").findMany({
    //         fields: ["name", "search_terms"] as any
    //     });

    //     // Transform data to plain objects compatible with JSONValue
    //     const transformedData = {
    //         products: products.map(product => ({
    //             id: product.id,
    //             documentId: product.documentId,
    //             name: product.name,
    //             category: product?.category_reference ? {
    //                 id: product?.category_reference.id,
    //                 documentId: product?.category_reference.documentId,
    //                 name: product?.category_reference.name
    //             } : null
    //         })),
    //         productCategory: productCategory.map(category => ({
    //             id: category.id,
    //             documentId: category.documentId,
    //             name: category.name,
    //             search_terms: category.search_terms
    //         }))
    //     };

    //     //     where: {
    //     //         type: "product"
    //     //     },
    //     //     data: {
    //     //         // type: "product",
    //     //         search_json: transformedData
    //     //     },
    //     // });
    //     let response;
    //     const matchedDocuments = await strapi
    //         .documents("api::autosearch.autosearch")
    //         .findMany({
    //             filters: { type: "product" },
    //             limit: 1,
    //             // fields: ['documentId'] // fetch only needed field for update
    //         });
    //     if (matchedDocuments.length > 0) {
    //         const documentId = matchedDocuments[0].documentId;
    //         response = await strapi
    //             .documents("api::autosearch.autosearch")
    //             .update({
    //                 documentId: documentId,
    //                 data: {
    //                     search_json: transformedData
    //                 }
    //             });
    //         console.log('Updated document:', response);
    //     } else {
    //         console.log('No document found with type "product"');
    //     }

    //     return response;
    // },
}));
