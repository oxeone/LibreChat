const { z } = require('zod');
const { Tool } = require('@langchain/core/tools');
const { logger } = require('~/config');

/**
 * Værktøj til MAnalytics API.
 */
class MAnalytics extends Tool {
  static lc_name() {
    return 'MActiveCampaign';
  }

  constructor(fields) {
    super(fields);
    this.name = 'm_activecampaign';
    this.description = 'Et værktøj til at søge i Google Analytics-rapporter baseret på klientnavn eller URL.';
    this.description_for_model = 'Dette værktøj gør det muligt for brugere at søge og hente data fra Google Analytics-rapporter. Ved at angive parametre som klientnavn eller URL kan brugere få adgang til detaljerede analytics-data fra deres Google Analytics-konti. Indtast det ønskede klientnavn eller URL som "query"-feltet i input JSON. Værktøjet returnerer relevante analytics-data for den specificerede klient, hvilket letter en omfattende analyse af webstedets eller applikationens ydeevne.';
    this.schema = z.object({
      query: z
        .string()
        .describe('Klientnavn eller URL for at hente Google Analytics-data.'),
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
