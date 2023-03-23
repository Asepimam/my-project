module.exports = {
  beforeCreate: async ({ params }) => {
    const adminuserId = params.data.createdBy;

    const author = (
      await strapi.entityService.findMany("api::author.author", {
        filters: {
          admin_user: [adminuserId],
        },
      })
    )[0];

    // update the data payload of the request for creating a post
    params.data.authors.connect = [...params.data.authors.connect, author.id];
  },
};
