module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    if (data.thumbnail) {
      const fileId = Array.isArray(data.thumbnail) ? data.thumbnail[0] : data.thumbnail;
      const file = await strapi.entityService.findOne('plugin::upload.file', fileId);

      if (file?.url) {
        data.thumbnail_cdn_url = file.url;
      }
    }
  },

  async beforeUpdate(event) {
    const { data } = event.params;

    if (data.thumbnail) {
      const fileId = Array.isArray(data.thumbnail) ? data.thumbnail[0] : data.thumbnail;
      const file = await strapi.entityService.findOne('plugin::upload.file', fileId);

      if (file?.url) {
        data.thumbnail_cdn_url = file.url;
      }
    }
  },
};
