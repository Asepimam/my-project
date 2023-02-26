'use strict';

/**
 * `posts-police` policy
 */

module.exports = (policyContext, config, { strapi }) => {

    const {roleConfig} = config;
    console.log(roleConfig);
    const isEligible = policyContext.state.user.role.name == roleConfig;
    
    if (isEligible) {
      console.log(roleConfig)    
      return true;
    }

    return false;
};
