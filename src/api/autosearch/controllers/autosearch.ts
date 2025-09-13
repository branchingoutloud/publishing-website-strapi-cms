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

        // get all products
        const products = await strapi.documents("api::product.product").findMany({
            fields: ["name"],
            populate: {
                category_reference: {
                    fields: ["name"],
                },
            }
        });

        // get all product category
        const productCategory = await strapi.documents("api::category.category").findMany({
            fields: ["name", "search_terms"] as any
        })

        // merge the data together
        const mergedData = { products, productCategory };

        let response;

        // take the first match and update it 
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
    async getUniversalSearchJson(ctx) {
        // get all products
        const products = await strapi.documents("api::product.product").findMany({
            fields: ["name"],
            populate: {
                category_reference: {
                    fields: ["name"],
                },
            }
        });

        // get all product category
        const productCategory = await strapi.documents("api::category.category").findMany({
            fields: ["name", "search_terms"] as any
        })

        // get all articles
        const articles = await strapi.documents("api::article.article").findMany({
            fields: ["title", "author"] as any
        })

        // get all newsletter
        const newsletter = await strapi.documents("api::newsletter.newsletter").findMany({
            fields: ["title", "description"] as any
        })

        // get all 
        const vendor = await strapi.documents("api::vendor.vendor").findMany({
            fields: ["name", "about"] as any
        })

        // merge the data together
        const mergedData = { products, productCategory, articles, newsletter, vendor };

        let response;

        // take the first match and update it 
        const matchedDocuments = await strapi
            .documents("api::autosearch.autosearch")
            .findMany({
                filters: { type: "universal" },
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
    async likesearch(ctx) {
        const { filter } = ctx.query;
        if (!filter) {
            return ctx.badRequest('Filter parameter is required');
        }

        const searchTerm = filter.toString().toLowerCase();

        const [articles, newsletters, products, news] = await Promise.all([
            strapi.documents("api::article.article").findMany({
                fields: ["title", "author", "body_text", "article_category", "description"] as any,
                // populate: {
                //     category_id: { fields: ["name"] },
                //     topic_id: { fields: ["title"] },
                //     tags_id: { fields: ["name"] }
                // }
            }),
            strapi.documents("api::newsletter.newsletter").findMany({
                fields: ["title", "description", "type",] as any,
                populate: {
                    topic_id: { fields: ["title"] },
                    newsletter_drafts: { fields: ["outline", "body_text"] },
                    newsletter_created_by: true,
                    newsletter_documents: true
                }
            }),

            strapi.documents("api::product.product").findMany({
                fields: ["name", "description", "pros", "cons"] as any,
                populate: {
                    category_reference: { fields: ["name"] },
                    vendor: { fields: ["name"] },
                    product_logo: true
                }
            }),
            strapi.documents("api::rss-feed.rss-feed").findMany({
                fields: ["title", "description", "url", "thumbnail_url"] as any,
                populate: {
                    source_id: true
                }
            })
        ]);

        const searchInObject = (obj: any): boolean => {
            if (!obj) return false;
            const searchableValue = (value: any): boolean => {
                if (typeof value === 'string') {
                    return value.toLowerCase().includes(searchTerm);
                }
                if (Array.isArray(value)) {
                    return value.some(item => searchInObject(item));
                }
                if (typeof value === 'object' && value !== null) {
                    return searchInObject(value);
                }
                return false;
            };
            return Object.values(obj).some(searchableValue);
        };
        const filteredArticles = articles.filter(article => searchInObject(article));
        const filteredNewsletters = newsletters.filter(newsletter => searchInObject(newsletter));
        const filteredProducts = products.filter(product => searchInObject(product));
        const filteredNews = news.filter(news => searchInObject(news));
        return {
            articles: filteredArticles,
            newsletters: filteredNewsletters,
            products: filteredProducts,
            news: filteredNews,
            totalResults: filteredArticles.length + filteredNewsletters.length + filteredProducts.length + filteredNews.length
        };
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
