export default {
  routes: [
    {
      method: 'GET',
      path: '/get-product-search',
      handler: 'autosearch.getProductSearchJson',
    },
    {
      method: 'GET',
      path: '/get-universal-search',
      handler: 'autosearch.getUniversalSearchJson',
    },
  ]
};