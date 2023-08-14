import { apiUrl, locations, outputDir, port, protocol, sessionAuthHash, version } from './config';
import cliProgress from 'cli-progress';

const progressBar = new cliProgress.SingleBar({
    format: 'Fetching From Windscribe: {percentage}% - {bar} - {value}/{total} Locations',
    barsize: 50
}, cliProgress.Presets.shades_classic);
progressBar.start(locations.length, 0);

await Promise.all(locations.map(async (location): Promise<void> => {
    const resp = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': `ws_session_auth_hash=${sessionAuthHash}`,
            'Referer': apiUrl,
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)',
            'Accept': '*/*',
        },
        body: new URLSearchParams({
            location,
            protocol,
            port,
            version,
        })
    })
    const ovpnConfig = await resp.text();
    await Bun.write(`${outputDir}/${location.replace(/\s/g, '_')}.ovpn`, ovpnConfig);
    progressBar.increment();
}))

progressBar.stop();
