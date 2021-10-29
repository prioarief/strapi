'use strict';
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async pay(ctx) {
        const { body } = ctx.request;
        console.log(body);
    
        let entity;
        // if (ctx.is('multipart')) {
        //   const { data, files } = parseMultipartData(ctx);
        //   entity = await strapi.services.restaurant.update({ id }, data, {
        //     files,
        //   });
        // } else {
        //     console.log(id, "<<<<<<<<");
        //   entity = await strapi.services.order.update({ id }, ctx.request.body);
        // }
        
        ctx.status = 400
        ctx.body = {msg: 'helo'}
        return ctx
        // return sanitizeEntity("okee", { model: strapi.models.order });
      },
};
