'use strict';

/**
 * post service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::post.post',({ strapi })=>({
    async exampleService(...args) {
        let response = { okay: true }
    
        if (response.okay === false) {
          return { response, error: true }
        }
    
        return response
      },
    
      // Method 2: Wrapping a core service (leaves core logic in place)
      async find(...args) {  
        // Calling the default core controller
        const { results, pagination } = await super.find(...args);
    
        // some custom logic
        results.forEach(result => {
          result.counter = 1;
        });
    
        return { results, pagination };
      },
    
      // Method 3: Replacing a core service
      async findOne(entityId, params = {}) {
        return strapi.entityService.findOne('api::post.post', entityId, this.getFetchParams(params));
      },
      async findPostsPublic(args) {
        const newQuery = {
          ...args,
          filters:{
            ...args.filters,
            premium:false,
          }
        }
        const publicPosts = await strapi.entityService.findMany("api::post.post",this.getFetchParams(newQuery))
        return publicPosts;
      },
      async findOnePublic(args){
        const {id,query} = args;

        const post = await strapi.entityService.findOne(
          "api::post.post",
          id,
          this.getFetchParams(query)
          );
        return post.premium ? null : post;

      },
      async likePosts(args){
        const {postId,userId,query} = args;
        const postTolike = await strapi.entityService.findOne("api::post.post",postId,{
          populate:["likeBy"]
        });
        const updatePost = await strapi.entityService.update("api::post.post",postId,{
          data:{
            likeBy:[userId,...postTolike.likeBy]

          },
          ...query
        });
        return updatePost;
      },
      // async authorPosts(args){
      //   const {authorId,query} = args;
      //   const authorPosts = await strapi.entityService.findMany("api::post.post",{
      //     populate:["author"],
      //   })
      //   return authorPosts;
      // }
}))

