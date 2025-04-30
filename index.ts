import { WireguardConfigFetcher } from './fetchers/WireguardConfigFetcher';
import cliProgress from 'cli-progress';
import { ConfigFetcher, WindscribeConfigWorker } from './WindscribeConfigWorker';
import { locations, workerCount, ovpn, wireguard } from './config';
import { OvpnConfigFetcher } from './fetchers/OvpnConfigFetcher';

const progressBar = new cliProgress.SingleBar({
    format: 'Fetching From Windscribe: {percentage}% - {bar} - {value}/{total} Locations',
    barsize: 50
}, cliProgress.Presets.shades_classic);
progressBar.start(locations.length, 0);

const fetchers: ConfigFetcher[] = [];
if (ovpn.enabled) {
    fetchers.push(new OvpnConfigFetcher());
}
if (wireguard.enabled) {
    fetchers.push(new WireguardConfigFetcher());
}
const workers = new Array(workerCount).fill(0).map((): WindscribeConfigWorker => new WindscribeConfigWorker(locations, progressBar, fetchers));

await Promise.all(workers.map((worker: WindscribeConfigWorker): Promise<void> => worker.run()));

progressBar.stop();
