module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/products-by-category/:categoryId?',
        handler: 'product.getProductsByCategory',
      }
    ]
  };