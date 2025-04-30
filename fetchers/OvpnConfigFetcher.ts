import { BaseConfigFetcher } from './BaseConfigFetcher';
import { type ConfigFetcher } from '../WindscribeConfigWorker';
import { ovpn } from '../config';

export class OvpnConfigFetcher extends BaseConfigFetcher implements ConfigFetcher {
  readonly apiUrl: string = ovpn.apiUrl;
  fetchAndWrite (location: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const ovpnConfig = await this.authenticatedFetch(ovpn.apiUrl, new URLSearchParams({
          location,
          protocol: ovpn.protocol,
          port: ovpn.port,
          version: ovpn.version,
        }))

        if (ovpnConfig.includes('client')) {
          await this.writeConfig(location, ovpnConfig, ovpn.extension);
          return resolve();
        }

        reject(new Error(`Retry: ${location} - ${ovpnConfig}`));
      } catch (error) {
        reject(error);
      }
    })
  }
}
