const { z } = require('zod');
const { Tool } = require('@langchain/core/tools');
const { logger } = require('~/config');

/**
 * Værktøj til MMCP API.
 */
class MAnalytics extends Tool {
  static lc_name() {
    return 'MMCP';
  }

  constructor(fields) {
    super(fields);
    this.name = 'm_mcp';
    this.description = 'Et værktøj til at indsamle virksomhedsoplysninger og foreslå relevante handlinger baseret på klientnavn eller URL.';
    this.description_for_model = `Dette værktøj indsamler oplysninger om en virksomhed baseret på et angivet klientnavn eller en URL. Det returnerer følgende JSON-struktur:
      {
        "message": "Beskrivelse af brugerens hensigt og de kaldte værktøjer.",
        "place_id": "Google Place ID for virksomheden",
        "company": "Virksomhedens fulde navn på dansk",
        "cvr": "Virksomhedens CVR-nummer",
        "website": "Virksomhedens webadresse",
        "action": "En eller flere af følgende handlinger, adskilt af komma: website, serp_paa, serp_adresult, monday_boards, trustpilot_score",
        "response": "Forventet svartype, som standard 'mail'"
      }
      Angiv klientnavnet eller URL'en som 'query' i input-JSON. Værktøjet vil derefter returnere de relevante oplysninger i det angivne format.`;
      this.schema = z.object({
        query: z
          .string()
          .describe('Klientnavn eller URL for at hente virksomhedsoplysninger og foreslå handlinger.')
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

module.exports = MMCP;
