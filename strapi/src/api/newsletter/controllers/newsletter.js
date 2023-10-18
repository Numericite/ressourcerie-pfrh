("use strict");

/**
 * newsletter controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

const retrieveDeepPopulate = async (data, ressource_ids) => {
  const ressources = await strapi
    .controller("api::ressource.ressource")
    .customFind({
      filters: {
        id: {
          $in: ressource_ids,
        },
      },
      populate: {
        theme: true,
        image: true,
        sub_themes: true,
        personaes: true,
        personae_occupations: true,
      },
    });

  let finalNewsletter = {
    ...{
      ...data,
      attributes: {
        ...data.attributes,
        ressources: ressources.data.filter((ressource) => {
          return ressource_ids.includes(ressource.id);
        }),
      },
    },
  };

  return finalNewsletter;
};

module.exports = createCoreController("api::newsletter.newsletter", () => ({
  async find(ctx) {
    const { data, meta } = await super.find(ctx);

    const newsletterPromises = data.map((newsletter) => {
      let ids = newsletter.attributes.ressources.data.map(
        (ressource) => ressource.id
      );
      return strapi
        .controller("api::ressource.ressource")
        .customFind({
          filters: {
            id: {
              $in: newsletter.attributes.ressources.data.map(
                (ressource) => ressource.id
              ),
            },
          },
          populate: {
            theme: true,
            image: true,
            sub_themes: true,
            personaes: true,
            personae_occupations: true,
          },
        })
        .then((ressources) => {
          return {
            ...{
              ...newsletter,
              attributes: {
                ...newsletter.attributes,
                ressources: ressources.data.filter((ressource) => {
                  return ids.includes(ressource.id);
                }),
              },
            },
          };
        });
    });

    let finalNewsletter = await Promise.all(newsletterPromises).then(
      (newsletters) => {
        return newsletters;
      }
    );

    return { data: finalNewsletter, meta };
  },
  async findOne(ctx) {
    const { data } = await super.findOne(ctx);

    let ressource_ids = data.attributes.ressources.data.map(
      (ressource) => ressource.id
    );

    let finalNewsletter = await retrieveDeepPopulate(data, ressource_ids);

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
