# Simple Hydra Client

A client application to interact with the Hydra node API via a web UI.

## Features

* Operate two Hydra Nodes (Alice, Bob) from the browser
* View JSON logs
* Execute Hydra API calls:
  * Init
  * Commit
  * NewTx
  * GetUTXO
  * Close
  * Fanout
  * Abort

## Requirements

| Required Tools         | Version / Details                          |
|-------------------------|--------------------------------------------|
| Node.js                | Recommended version 16 or higher           |
| cardano-node           | 10.1.2 [Set up](https://docs.cardano.org/cardano-testnets/getting-started), running, and 100% Ledger synced |
| cardano-cli            | 10.1.1.0                                   |
| hydra-node             | 0.20.0 [Set up](https://hydra.family/head-protocol/unstable/docs/tutorial#step-0-installation) and running |
| cardano-cli-wrapper    | [Set up](https://github.com/bypptech/cardano-cli-wrapper.git) and running |

## Installation

```bash
git clone https://github.com/bypptech/simple-hydra-client.git
cd simple-hydra-client
npm install
```

## Configuration

Edit `vite.config.ts`:

```typescript
export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        port: 3000, // Specify the server port
    },
    define: {
        env: {
            WS_URL_ALICE_HYDRA_NODE: 'ws://localhost:4001', // Specify Alice's Hydra Node WebSocket URL
            WS_URL_BOB_HYDRA_NODE: 'ws://localhost:4002', // Specify Bob's Hydra Node WebSocket URL
            WS_URL_CARDANO_CLI_WRAPPER: 'ws://localhost:3002', // Specify Cardano CLI Wrapper WebSocket URL
        },
    },
});
```

## Start

```bash
npm run dev
```

## Access via Browser

Currently, this application is designed to work only on localhost.  
On the same environment where Simple Hydra Client is running, open a browser and access the following URL:

http://localhost:3000

## How to Use

If successfully connected to `cardano-node`, `hydra-node`, and `Cardano CLI Wrapper`, the following screen will be displayed:

![](/webui-sample.png)

### Init

Click **Init** and wait until the **HeadIsInitializing** message is received.

### Commit:Alice, Bob

Click **Commit:Alice** and wait until the **Committed** message is received.

Next, click **Commit:Bob** and wait until the **Committed** message is received.

Once the UTXOs of Alice and Bob are committed, confirm that the **HeadIsOpen** message is received.

### NewTx

Click **NewTx** to send the configured ADA (lovelace) from Alice to Bob.  
During this process, the **TxValid** and **SnapshotConfirmed** messages will be received in sequence.

### Close

Click **Close** to start the Hydra Head termination sequence.  
Currently, hydra-node 0.20.0 has limitations in the Close process.  
If there is no response even after 30 seconds of clicking Close, click Close again.

Once Close is accepted, the **HeadIsClosed** message will be received.  
Wait for about 2 more minutes to receive the **ReadyToFanout** message.

### Fanout

Click **Fanout** to start the process of finalizing the L2 results on L1.  
Wait for about 3 minutes to receive the **HeadIsFinalized** message, confirming that the L2 results have been reflected on L1.