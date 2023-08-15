import cliProgress from 'cli-progress';
import { apiUrl, outputDir, port, protocol, sessionAuthHash, version } from './config';

export class WindscribeConfigWorker {
    private locationsRef: string[];
    private progress: cliProgress.SingleBar;

    constructor (locationsRef: string[], progress: cliProgress.SingleBar) {
        this.locationsRef = locationsRef;
        this.progress = progress;
    }

    public async run (): Promise<void> {
        if (this.locationsRef.length === 0) {
            return;
        }
        const location = this.locationsRef.shift() as string;

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

        if (!ovpnConfig.includes('client')) {
            // Retry
            this.locationsRef.push(location);
            await new Promise(resolve => setTimeout(resolve, Math.random() * 5000));
        } else {
            await this.writeOpenVPNConfig(location, ovpnConfig);

            this.progress.increment();
        }
        await this.run();
    }

    private async writeOpenVPNConfig (location: string, ovpnConfig: string): Promise<void> {
        await Bun.write(`${outputDir}/${location.replace(/[\s:]/g, '_')}.ovpn`, ovpnConfig);
    }

}
