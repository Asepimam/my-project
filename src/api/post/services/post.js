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
      }
}))
