const { logger } = require('~/config');

const options = [
  {
    label: 'com_ui_product_marketing',
    value: 'product_marketing',
  },
  {
    label: 'com_ui_marketing_analytics',
    value: 'marketing_analytics',
  },
  {
    label: 'com_ui_content_strategy',
    value: 'content_strategy',
  },
  {
    label: 'com_ui_branding',
    value: 'branding',
  },
  {
    label: 'com_ui_social_media',
    value: 'social_media',
  },
  {
    label: 'com_ui_email_marketing',
    value: 'email_marketing',
  },
  {
    label: 'com_ui_copywriting',
    value: 'copywriting',
  },
  {
    label: 'com_ui_seo',
    value: 'seo',
  },
  {
    label: 'com_ui_ads',
    value: 'ads',
  },
  {
    label: 'com_ui_code',
    value: 'code',
  },
  {
    label: 'com_ui_misc',
    value: 'misc',
  },
];

module.exports = {
  /**
   * Retrieves the categories asynchronously.
   * @returns {Promise<TGetCategoriesResponse>} An array of category objects.
   * @throws {Error} If there is an error retrieving the categories.
   */
  getCategories: async () => {
    try {
      // const categories = await Categories.find();
      return options;
    } catch (error) {
      logger.error('Error getting categories', error);
      return [];
    }
  },
};
