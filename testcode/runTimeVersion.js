const { ApiPromise, WsProvider } = require('@polkadot/api');

async function main() {
  const provider = new WsProvider('wss://ws.calamari.systems');
  const api = await ApiPromise.create({ provider });

  await api.isReady;

  console.log(api.genesisHash.toHex());

  console.log(`Runtime version: ${api.runtimeVersion.specVersion}`);
}

main().catch(console.error);
