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
    const apiUrl = `https://cvrapi.dk/api?search=${query}&country=dk`;
  
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
  
      const data = await response.json();
  
      if (!data || !data.name) {
        throw new Error('Invalid API response: Missing company information.');
      }
  
      // Function to remove empty properties
      const removeEmptyProperties = (obj) => {
        return Object.fromEntries(
          Object.entries(obj)
            .filter(([_, v]) => v != null && v !== '' && !(Array.isArray(v) && v.length === 0))
            .map(([k, v]) => [k, v === Object(v) ? removeEmptyProperties(v) : v])
        );
      };
  
      const cleanedData = removeEmptyProperties(data);
  
      // Formatting the output
      const formatData = (obj, indent = '') => {
        return Object.entries(obj)
          .map(([key, value]) => {
            const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            if (typeof value === 'object' && !Array.isArray(value)) {
              return `${indent}**${formattedKey}**:\n${formatData(value, indent + '  ')}`;
            } else if (Array.isArray(value)) {
              return `${indent}**${formattedKey}**:\n${value.map(item => `${indent}- ${item}`).join('\n')}`;
            } else {
              return `${indent}**${formattedKey}**: ${value}`;
            }
          })
          .join('\n');
      };
  
      return formatData(cleanedData);
    } catch (error) {
      logger.error('CVRSearch API request failed', error);
      return `Error CVR: ${error.message}`;
    }
  }  
}

module.exports = CVRSearch;