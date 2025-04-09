const { z } = require('zod');
const { Tool } = require('@langchain/core/tools');
const { logger } = require('~/config');

/**
 * Værktøj til MDrive API.
 */
class MDrive extends Tool {
  static lc_name() {
    return 'MDrive';
  }

  constructor(fields) {
    super(fields);
    this.name = 'm_drive';
    this.description = 'A tool for performing various operations in Google Drive and Google Sheets, such as managing files and manipulating spreadsheet data.';
    this.description_for_model = 'This tool enables me to perform a range of operations in Google Drive and Google Sheets. Users can manage files by copying, creating, moving, sharing, downloading, and updating them. Additionally, users can interact with Google Sheets by creating spreadsheets, adding sheets, appending or updating rows, and retrieving rows. Input the desired operation and relevant parameters as fields in the input JSON. The tool will execute the specified operation and return the result, facilitating efficient management and manipulation of files and spreadsheet data.';
    this.schema = z.object({
      query: z
        .string()
        .describe(
          ' The operation to perform, e.g., "copyFile", "createSpreadsheet", "appendRow".',
        ),
    });
  }

  // eslint-disable-next-line no-unused-vars
  async _call({ query }, _runManager) {
    const apiUrl = 'https://margial.app.n8n.cloud/webhook-test/1d3fc122-0f1c-4491-9bc8-429c5863a8dd';

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
      logger.error('MDrive API-anmodning mislykkedes', error);
      return `Fejl i MDrive: ${error.message}`;
    }
  }
}

module.exports = MDrive;
