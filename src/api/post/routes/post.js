'use strict';

/**
 * post router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::post.post',{
    // config:{
    //     find:{
    //         policies:[{name:"posts-police",config:{roleConfig:"Author"}}]
    //     }
    // }
});
