("use strict");

/**
 * newsletter controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

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

    let ids = data.attributes.ressources.data.map((ressource) => ressource.id);

    const ressources = await strapi
      .controller("api::ressource.ressource")
      .customFind({
        filters: {
          id: {
            $in: data.attributes.ressources.data.map(
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
      });

    let finalNewsletter = {
      ...{
        ...data,
        attributes: {
          ...data.attributes,
          ressources: ressources.data.filter((ressource) => {
            return ids.includes(ressource.id);
          }),
        },
      },
    };

    return { data: finalNewsletter };
  },
}));
