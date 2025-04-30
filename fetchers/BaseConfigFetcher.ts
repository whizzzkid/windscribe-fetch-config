import { ConfigFetcher } from '../WindscribeConfigWorker';
import { outputDir, sessionAuthHash } from '../config';

export class BaseConfigFetcher implements ConfigFetcher {
  readonly apiUrl!: string;
  readonly configParams!: (location: string) => URLSearchParams;
  readonly validationString!: string;
  readonly extension!: string;
  readonly fileName = (location: string, extension:string) => `${location.replace(/[\s:]/g, '_')}.${extension}`

  async writeConfig (location: string, config: string, extension: string): Promise<void> {
    await Bun.write(`${outputDir}/${this.fileName(location, extension)}`, config);
  }

  async authenticatedFetch (url: string, body: URLSearchParams): Promise<string> {
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': `ws_session_auth_hash=${sessionAuthHash}`,
          'Referer': url,
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)',
          'Accept': '*/*',
        },
        body
      });

      return await resp.text();
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  }

  fetchAndWrite (location: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const config = await this.authenticatedFetch(this.apiUrl, this.configParams(location));

        if (config.includes(this.validationString)) {
          await this.writeConfig(location, config, this.extension);
          return resolve();
        }

        reject(new Error(`Retry: ${location} - ${config}`));
      } catch (error) {
        reject(error);
      }
    })
  }
}
