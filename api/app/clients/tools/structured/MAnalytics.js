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
        method: 'POST', // Use POST method to send data in the body
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input), // Send the input data in the body
      });
  
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
  
      const data = await response.json();
  
      // Format the response to match the expected output schema
      return [{ output: data.message }];
    } catch (error) {
      logger.error('MAnalytics API request failed', error);
      return [{ output: `Error MAnalytics: ${error.message}` }];
    }
  }  
}

module.exports = MAnalytics;