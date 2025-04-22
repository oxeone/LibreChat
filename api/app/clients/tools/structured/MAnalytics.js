const { z } = require('zod');
const { Tool } = require('@langchain/core/tools');
const { logger } = require('~/config');

/**
 * Værktøj til MAnalytics API.
 */
class MAnalytics extends Tool {
  static lc_name() {
    return 'MAnalytics';
  }

  constructor(fields) {
    super(fields);
    this.name = 'm_analytics';
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
    const apiUrl = 'https://margial.app.n8n.cloud/webhook/e9df69a4-1e32-47ee-9fcc-35b479b34ba2';

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
      logger.error('MAnalytics API-anmodning mislykkedes', error);
      return `Fejl i MAnalytics: ${error.message}`;
    }
  }
}

module.exports = MAnalytics;
