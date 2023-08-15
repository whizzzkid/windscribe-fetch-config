# windscribe-ovpn

## The Problem

Windscribe VPN is great, I need it everywhere, but I don't have an integration for my travel router. My router supports oVPN and WireGuard configs, however, windscribe makes it difficult to get all the configs together as a single zip file. Instead you have to download each config individually. This is a pain.

## Setup

I am playing with [bun.js](https://bun.sh/) these days, so that is what you get.

### To install dependencies

```bash
bun install
```

### To run

- Step 1: Modify the `config.ts` file to include your configs found on the [windscribe website](https://windscribe.com/getconfig/openvpn)
- Step 2: Make sure to copy the `ws_session_auth_hash` cookie from the windscribe website and paste it into the `config.ts` file under `authSessionHash`
- Step 3: Run the script

    ```bash
        bun run index.ts
    ```

- Step 4: You should have all configs in `./output` directory. You can now zip them up and upload them to your router.

## Acknowledgements

This project was created using `bun init` in bun v0.6.1. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
