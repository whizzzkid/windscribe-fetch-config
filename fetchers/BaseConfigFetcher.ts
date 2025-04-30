import { ConfigFetcher } from '../WindscribeConfigWorker';
import { outputDir, sessionAuthHash } from '../config';

export class BaseConfigFetcher implements ConfigFetcher {
  async writeConfig (location: string, config: string, extension: string): Promise<void> {
    await Bun.write(`${outputDir}/${location.replace(/[\s:]/g, '_')}.${extension}`, config);
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

  fetchAndWrite (_location: string): Promise<void> {
    throw new Error('Not Implemented');
  }
}
