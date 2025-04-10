const { z } = require('zod');
const { Tool } = require('@langchain/core/tools');
const { logger } = require('~/config');

/**
 * Værktøj til MActiveCampaign API.
 */
class MActiveCampaign extends Tool {
  static lc_name() {
    return 'MActiveCampaign';
  }

  constructor(fields) {
    super(fields);
    this.name = 'm_activecampaign';
    this.description = 'Et værktøj til at administrere deals, accounts og contacts i ActiveCampaign.';
    this.description_for_model = 'Dette værktøj gør det muligt for brugere at søge, opdatere og oprette deals, accounts og contacts i ActiveCampaign. Ved at angive en søgeforespørgsel kan brugere interagere med deres ActiveCampaign-data for effektiv styring af salgs- og marketingaktiviteter. Indtast den ønskede søgeforespørgsel som "query"-feltet i input JSON. Værktøjet returnerer relevante data fra ActiveCampaign baseret på den specificerede forespørgsel.';
    this.schema = z.object({
      query: z
        .string()
        .describe('Søgeforespørgsel for at hente data fra ActiveCampaign.'),
    });
  }

  // eslint-disable-next-line no-unused-vars
  async _call({ query }, _runManager) {
    const apiUrl = 'https://margial.app.n8n.cloud/webhook-test/094db746-0b30-437e-be9f-02600c860586';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`API-anmodning mislykkedes med status ${response.status}`);
      }

      const data = await response.json();

      if (!data || !data.output) {
        throw new Error('Ugyldigt API-svar: Mangler forventet output.');
      }

      return data.output;
    } catch (error) {
      logger.error('MActiveCampaign API-anmodning mislykkedes', error);
      return `Fejl i MActiveCampaign: ${error.message}`;
    }
  }
}

module.exports = MActiveCampaign;