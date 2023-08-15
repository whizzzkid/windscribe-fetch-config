import cliProgress from 'cli-progress';
import { WindscribeConfigWorker } from './WindscribeConfigWorker';
import { locations, workerCount } from './config';

const progressBar = new cliProgress.SingleBar({
    format: 'Fetching From Windscribe: {percentage}% - {bar} - {value}/{total} Locations',
    barsize: 50
}, cliProgress.Presets.shades_classic);
progressBar.start(locations.length, 0);

const workers = new Array(workerCount).fill(0).map((): WindscribeConfigWorker => new WindscribeConfigWorker(locations, progressBar));

await Promise.all(workers.map((worker: WindscribeConfigWorker): Promise<void> => worker.run()));

progressBar.stop();
