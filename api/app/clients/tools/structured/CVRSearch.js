const { z } = require('zod');
const { Tool } = require('@langchain/core/tools');
const { getEnvironmentVariable } = require('@langchain/core/utils/env');
const { logger } = require('~/config');

/**
 * Tool for the CVRSearch search API.
 */
class CVRSearch extends Tool {
  static lc_name() {
    return 'CVRSearch';
  }
  constructor(fields) {
    super(fields);
    this.name = 'cvr_search';
    // UPDATED DESCRIPTION:
    this.description = `A tool for searching the Danish CVR registry by an 8-digit company CVR number. Provide an 8-digit number as the query to fetch company data.`;
    // UPDATED DESCRIPTION FOR MODEL:
    this.description_for_model =
      `'Use this tool to fetch data for a Danish company by its 8-digit CVR number. For example: "12345678". Provide it as the "query" field in the input JSON. The tool will return details about that company from the CVR API.'`;
    this.schema = z.object({
      query: z
        .string()
        .describe(
          ' 8-digit CVR. It must be exactly 8 digits if you are looking up a specific CVR number.',
        ),
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
  async _call({ query }, _runManager) {
    const body = {
      query: [query],
    };
    try {
      // UPDATED FETCH URL:
      const response = await fetch(`https://cvrapi.dk/api?search=${query}&country=dk`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          //'x-api-key': this.apiKey,
        },
        body: JSON.stringify({ ...body }),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(
          `Request failed with status code ${response.status}: ${json.error ?? json.message}`,
        );
      }
      if (!json.data) {
        throw new Error('Could not parse CVRSearch API results. Please try again.');
      }

      const baseText = json.data?.response_text ?? '';
      const sources = json.data?.web_url;
      const noResponse = 'No response found in CVRSearch API results';

      if (!baseText && !sources) {
        return noResponse;
      }

      const sourcesText = sources?.length ? '\n\nSources:\n - ' + sources.join('\n - ') : '';
      const result = baseText + sourcesText;

      if (!result) {
        return noResponse;
      }

      return result;
    } catch (error) {
      logger.error('CVRSearch API request failed', error);
      return `CVRSearch API request failed: ${error.message}`;
    }
  }
}

module.exports = CVRSearch;