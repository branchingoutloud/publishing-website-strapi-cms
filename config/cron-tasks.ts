export default {
    /**
     * Simple example.
     * Every monday at 1am.
     */
  
    newsletterJob: {
      task: ({ strapi }) => {
        // Add your own logic here (e.g. send a queue of email, create a database backup, etc.).
        
      },
      options: {
        rule: "0 0 1 * * 1",
      },
    },
  };