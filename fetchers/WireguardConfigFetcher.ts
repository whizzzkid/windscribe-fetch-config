import { BaseConfigFetcher } from './BaseConfigFetcher';
import { type ConfigFetcher } from '../WindscribeConfigWorker';
import { wireguard } from '../config';

export class WireguardConfigFetcher extends BaseConfigFetcher implements ConfigFetcher {
  readonly apiUrl: string = wireguard.apiUrl;
  readonly configParams = (location: string) => new URLSearchParams({
    location,
    pub_key: wireguard.pubKey,
    port: wireguard.port
  });
  readonly validationString = 'Interface';
  readonly extension = wireguard.extension;
}
