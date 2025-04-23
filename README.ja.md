# Simple Hydra Client

Web UIからHydra node APIを操作するクライアントアプリです。  

## 特徴

* 2つのHydra Node(Alice,Bob)をブラウザ上から操作
* JSONログ閲覧機能
* Hydra APIの発行
  * Init
  * Commit
  * NewTx
  * GetUTXO
  * Close
  * Fanout
  * Abort

## 動作要件

| 必要なツール            | バージョン / 詳細                          |
  |-------------------------|--------------------------------------------|
| Node.js                | バージョン 16 以上推奨                     |
| cardano-node           | 10.1.2 [セットアップ済み](https://docs.cardano.org/cardano-testnets/getting-started) かつ 起動済み かつ Ledger同期100%         |
| cardano-cli            | 10.1.1.0                                   |
| hydra-node             | 0.20.0  [セットアップ済み](https://hydra.family/head-protocol/unstable/docs/tutorial#step-0-installation) かつ 起動済み                               |
| cardano-cli-wrapper | [セットアップ済み](https://github.com/bypptech/cardano-cli-wrapper.git) かつ起動済み |

## インストール

```bash
git clone https://github.com/bypptech/simple-hydra-client.git
cd simple-hydra-client
npm install
```

## 設定変更

vite.config.ts を編集します

```typescript
export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        port: 3000, // サーバーポートを指定
    },
    define: {
        env: {
            WS_URL_ALICE_HYDRA_NODE: 'ws://localhost:4001', // AliceのHydraノードWebSocket URLを指定
            WS_URL_BOB_HYDRA_NODE: 'ws://localhost:4002', // BobのHydraノードWebSocket URLを指定
            WS_URL_CARDANO_CLI_WRAPPER: 'ws://localhost:3002', // Cardano CLI Wrapper WebSocket URLを指定
        },
    },
});
```
## 起動

```bash
npm run dev
```

## ブラウザからアクセス

現状、本アプリはlocalhostで動作のみを想定しています。  
Simple Hydra Client を起動している同じ環境にて、ブラウザを起動し下記URLへアクセスします。

http://localhost:3000

## 操作方法

cardano-node, hydra-node, Cardano CLI Wrapper に正常に接続できた場合、下図の画面が表示されます。

![](/webui-sample.png)

### Init

**Init** をクリックし **HeadIsInitializing** メッセージを受信するまで待ちます

### Commit:Alice,Bob

**Commit:Alice** をクリックし **Committed** メッセージを受信するまで待ちます

続いて **Commit:Bob** をクリックし **Committed** メッセージを受信するまで待ちます

Alice と Bob のUTXOがコミットされると **HeadisOpen** メッセージを受信するのを確認します

### NewTx

**NewTx** をクリックすると設定されたADA(lovalace)がAliceからBobへと送信されます。  
この際、**TxValid** **SnapshotConfirmed** の順にメッセージを受信します。

### Close

**Close** をクリックすると Hydra Headの終了シーケンスが開始します。  
現状のhydra-node 0.20.0には Close 処理に制限があります。  
Closeクリック後 30秒以上経過しても反応がない場合は、再度 Close をクリックしてください。

Closeが受け付けられると **HeadIsClosed** を受信します。    
さらに2分ほど待つと**ReadyToFanout** を受信します。

### Fanout

**Fanout** をクリックすると L2結果をL1へ確定処理を開始します。
3分ほど待つと **HeadIsFinalized** メッセージを受信し、L2の結果がL1に反映されます。


