const { z } = require('zod');
const { Tool } = require('@langchain/core/tools');
const { getEnvironmentVariable } = require('@langchain/core/utils/env');
const { logger } = require('~/config');

/**
 * Tool for the MAnalytics search API.
 */
class MAnalytics extends Tool {
  static lc_name() {
    return 'MAnalytics';
  }
  constructor(fields) {
    super(fields);
    this.name = 'm_analytics';
    // UPDATED DESCRIPTION:
    this.description = `A tool for searching Google Analytics Reports. Get data from Analytics accounts based on `;
    // UPDATED DESCRIPTION FOR MODEL:
    this.description_for_model = 'This tool enables users to search and retrieve data from Google Analytics reports. By specifying parameters such as client name or URL, users can access detailed analytics data from their Google Analytics accounts. Input the desired client name or URL as the "query" field in the input JSON. The tool will return relevant analytics data for the specified client, facilitating comprehensive analysis of website or application performance.';
    this.schema = z.object({
      query: z
        .string()
        .describe('Client name or URL to get Google Analytics data reports.'),
    });

    //this.apiKey = fields?.TRAVERSAAL_API_KEY ?? this.getApiKey();
  }

  /*getApiKey() {
    const apiKey = getEnvironmentVariable('TRAVERSAAL_API_KEY');
    if (!apiKey && this.override) {
      throw new Error(
        'No Traversaal API key found. Either set an environment variable named "TRAVERSAAL_API_KEY" or pass an API key as "apiKey".',
      );
    }
    return apiKey;
  }*/

  // eslint-disable-next-line no-unused-vars
  async _call(input, _runManager) {
    const apiUrl = 'https://margial.app.n8n.cloud/webhook-test/e9df69a4-1e32-47ee-9fcc-35b479b34ba2';
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST', // Brug POST-metoden til at sende data i body
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input), // Send inputdata i body
      });
  
      if (!response.ok) {
        throw new Error(`API-anmodning mislykkedes med status ${response.status}`);
      }
  
      const data = await response.json();
  
      // Antager, at data er en liste med objekter, der har en 'output' nøgle
      if (Array.isArray(data) && data.length > 0 && data[0].output) {
        return {
          content: [
            {
              type: 'text',
              text: data[0].output
            }
          ]
        };
      } else {
        throw new Error('Ugyldigt API-svar: Mangler forventet output.');
      }
    } catch (error) {
      logger.error('MAnalytics API-anmodning mislykkedes', error);
      return {
        content: [
          {
            type: 'text',
            text: `Fejl i MAnalytics: ${error.message}`
          }
        ]
      };
    }
  }  
}

module.exports = MAnalytics;