export default {
  routes: [
    {
      method: "GET",
      path: "/vendors-by-id/:id?",
      handler: "vendor.getVendorsById",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};