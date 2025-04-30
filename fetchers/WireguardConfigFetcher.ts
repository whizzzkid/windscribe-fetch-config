import { BaseConfigFetcher } from './BaseConfigFetcher';
import { type ConfigFetcher } from '../WindscribeConfigWorker';
import { wireguard } from '../config';

export class WireguardConfigFetcher extends BaseConfigFetcher implements ConfigFetcher {
  fetchAndWrite (location: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const wireguardConfig = await this.authenticatedFetch(wireguard.apiUrl, new URLSearchParams({
          location,
          pub_key: wireguard.pubKey,
          port: wireguard.port
        }))

        if (wireguardConfig.includes('Interface')) {
          await this.writeConfig(location, wireguardConfig, wireguard.extension);
          return resolve();
        }

        reject(new Error(`Retry: ${location} - ${wireguardConfig}`));
      } catch (error) {
        reject(error);
      }
    })
  }
}
