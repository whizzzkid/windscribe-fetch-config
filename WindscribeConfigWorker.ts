import cliProgress from 'cli-progress';
import { waitTime } from './config';

export interface ConfigFetcher {
  fetchAndWrite(location: string): Promise<void>;
}

export class WindscribeConfigWorker {
  private locationsRef: string[];
  private progress: cliProgress.SingleBar;
  private fetchers: ConfigFetcher[];

  constructor(
    locationsRef: string[],
    progress: cliProgress.SingleBar,
    fetchers: ConfigFetcher[] = [],
  ) {
    this.locationsRef = locationsRef;
    this.progress = progress;
    this.fetchers = fetchers;
  }

  public async run(): Promise<void> {
    if (this.locationsRef.length === 0) {
      return;
    }
    const location = this.locationsRef.shift() as string;

    try {
      await Promise.all(
        this.fetchers.map(
          (fetcher: ConfigFetcher): Promise<void> =>
            fetcher.fetchAndWrite(location),
        ),
      );

      this.progress.increment();
    } catch (error) {
      // Retry
      this.locationsRef.push(location);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    await this.run();
  }
}
