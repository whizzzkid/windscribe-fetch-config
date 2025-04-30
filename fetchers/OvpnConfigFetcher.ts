import { BaseConfigFetcher } from './BaseConfigFetcher';
import { type ConfigFetcher } from '../WindscribeConfigWorker';
import { ovpn } from '../config';

export class OvpnConfigFetcher
  extends BaseConfigFetcher
  implements ConfigFetcher
{
  readonly apiUrl: string = ovpn.apiUrl;
  readonly configParams = (location: string) =>
    new URLSearchParams({
      location,
      protocol: ovpn.protocol,
      port: ovpn.port,
      version: ovpn.version,
    });
  readonly validationString = 'client';
  readonly extension = ovpn.extension;
  readonly fileName = (location: string, extension: string) => {
    const [city, vanity] = [...location.matchAll(/[a-zA-Z]+/gi)].flat();
    return `${city}-${vanity}-${ovpn.protocol.toLocaleLowerCase()}.${extension}`;
  };
}
