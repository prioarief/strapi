"use strict";
const { env, sanitizeEntity } = require("strapi-utils");
const { default: axios } = require("axios");
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async pay(ctx) {
    try {
      const { body } = ctx.request;
      const { order_id: id } = body;
      const entity = await strapi.services.order.findOne({ id });
      if (!entity) {
        ctx.status = 400;
        ctx.body = { msg: "order id not found" };
        return ctx;
      }
      const { total_amount, member } = entity;
      const { name, email } = member;
      const first_name = name.split(" ")[0];
      const data = {
        transaction_details: {
          order_id: id,
          gross_amount: total_amount,
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          first_name,
          last_name: name.split(" ").slice(1).join(" "),
          email,
        },
      };
      // console.log(total_amount);

      const hit = await axios.post(env("MIDTRANS_SANDBOX_URL"), data, {
        headers: {
          Authorization:
            "Basic " + Buffer.from(env("MIDTRANS_KEY")).toString("base64"),
        },
      });

      ctx.status = 200;
      ctx.body = { msg: hit.data };
      return ctx;
    } catch (error) {
      ctx.status = 400;
      ctx.body = { msg: error.response.data.error_messages[0] };
      return ctx;
    }
  },
  async callback(ctx) {
    try {
      const { body } = ctx.request;
      const { transaction_status, order_id: id } = body;
      const is_paid = transaction_status === "settlement" ? true : false;

      const entity = await strapi.services.order.update({ id }, { is_paid });
      return sanitizeEntity(entity, { model: strapi.models.orders });
    } catch (error) {
      console.log(error);
    }
  },
};
