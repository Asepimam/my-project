'use strict';

/**
 * post controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::post.post', ({ strapi }) =>  ({
    // Method 1: Creating an entirely custom action
    async exampleAction(ctx) {
      if (ctx.state.user) {
        ctx.body = 'ok';
      } else {
        ctx.forbidden("You're not allowed to access this route");}
      // try {
      //   ctx.body = 'ok';
      // } catch (err) {
      //   ctx.body = err;
      // }
    },
  
    // solusi 1: mengabil semua data dari database lalu filter dengan validasi user
    // async find(ctx) {
    //     const {data,meta} = await super.find(ctx);
    //     if (ctx.state.user) return {data,meta};
    //     const filteredData = data.filter((post) => !post.attributes.premium )
    //     return{data:filteredData,meta}
    // },
    // solusi 2: mengambil data dari database dengan query yang sudah di filter
    // async find(ctx) {
    //     const isRequestingNonPremiun  = ctx.query.filters && ctx.query.filters.premium  == false;

    //     if(ctx.state.user || isRequestingNonPremiun) return super.find(ctx);

    //     // jika riquest dari pubilic
    //     // maka akan memanggil servis dengan filter parameter premium:false
    //     const {query}= ctx;
    //     const filteredPost = await strapi.service('api::post.post').find({
    //         filters:{
    //             ...query.filters,
    //             premium:false
    //         }
    //     })
    //     const sanitizedPosts = await this.sanitizeOutput(filteredPost,ctx);
    //     return this.transformResponse(sanitizedPosts);
    // },
    // solusi 3 menggunakan service
    async find(ctx) {
      const isRequestingNonPremiun= ctx.query.filters && ctx.query.filters.premium == false;
      if(ctx.state.user || isRequestingNonPremiun) return super.find(ctx);

      const publicPosts = await strapi.service('api::post.post').findPostsPublic(ctx.query);
      const sanitizedPosts = await this.sanitizeOutput(publicPosts,ctx);
      return this.transformResponse(sanitizedPosts);
    },
    // Method 3: Replacing a core action
    // async findOne(ctx) {
    //   const { id } = ctx.params;
    //   const { query } = ctx;
    //   console.log(query);
    //   console.log(id);
  
    //   const entity = await strapi.service('api::post.post').findOne(id, query);
    //   const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    //   console.log(sanitizedEntity);
  
    //   return this.transformResponse(sanitizedEntity);
    // },
    // jika mengabil data by id dan akan melakukan filter data by query
    async findOne(ctx) {
      if (ctx.state.user) return super.findOne(ctx); 
      const { id } = ctx.params;
      const {query} = ctx;
      const postIfPublic = await strapi.service("api::post.post").findOnePublic({
        id,
        query,
      });
      const sanitizedPost = await this.sanitizeOutput(postIfPublic, ctx);
      return this.transformResponse(sanitizedPost);
    },
    // function likepost
    async likePosts(ctx){
     const user = ctx.state.user;
     const postId = ctx.params.id;
     const {query} = ctx;
     if(!user) return ctx.forbidden("kamu tidak teruathentikasi");
     const updatePost = await strapi.service("api::post.post").likePosts({
      postId,userId:user.id,query
     });
     const sanitizedEntity = await this.sanitizeOutput(updatePost, ctx);
     return this.transformResponse(sanitizedEntity);
    }
  }));

