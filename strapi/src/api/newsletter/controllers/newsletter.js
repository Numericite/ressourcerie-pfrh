("use strict");

/**
 * newsletter controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

const retrieveDeepPopulate = async (data, ressource_ids, ressource_list) => {
  const finalNewsletter = await strapi
    .controller("api::ressource.ressource")
    .customFind({
      query: {
        filters: {
          id: {
            $in: [...ressource_ids],
          },
        },
        populate: {
          theme: true,
          image: true,
          sub_themes: true,
          personaes: true,
          personae_occupations: true,
        },
      },
    })
    .then((ressources) => {
      return {
        ...{
          ...data,
          attributes: {
            ...data.attributes,
            ressources_list: ressource_list.map((el) => {
              return {
                ...el,
                ressource: ressources.data.find((ressource) => {
                  return ressource.id === el.ressource.data.id;
                }),
              };
            }),
          },
        },
      };
    });

  return finalNewsletter;
};

module.exports = createCoreController("api::newsletter.newsletter", () => ({
  async find(ctx) {
    const { data, meta } = await super.find(ctx);

    let ids = [];
    data.map((el) => {
      return el.attributes.ressources_list.forEach((res) => {
        ids.push(res.ressource.data.id);
      });
    });

    const newslettersPromises = data.map((newsletter) => {
      let ressource_list = newsletter.attributes.ressources_list;
      return retrieveDeepPopulate(newsletter, ids, ressource_list);
    });

    let finalNewsletters = await Promise.all(newslettersPromises).then(
      (newsletters) => {
        return newsletters;
      }
    );

    return { data: finalNewsletters, meta };
  },
  async findOne(ctx) {
    const { data } = await super.findOne(ctx);

    let ressource_ids = data.attributes.ressources_list.map(
      (ressource_component) => ressource_component.ressource.data.id
    );

    let finalNewsletter = await retrieveDeepPopulate(
      data,
      ressource_ids,
      data.attributes.ressources_list
    );

    return { data: finalNewsletter };
  },
  async updateStatus(ctx) {
    const { id, status } = ctx.request.body;
    const response = await strapi
      .service("api::newsletter.newsletter")
      .update(id, {
        data: { status: status },
        populate: {
          ressources: true,
        },
      });

    let ressource_ids = response.ressources.map((ressource) => ressource.id);

    let { id: response_id, ...responseWithoutId } = response;

    let formatted_response = {
      id: response_id,
      attributes: {
        ...responseWithoutId,
      },
    };

    let finalNewsletter = await retrieveDeepPopulate(
      formatted_response,
      ressource_ids
    );

    return { data: finalNewsletter };
  },
}));
