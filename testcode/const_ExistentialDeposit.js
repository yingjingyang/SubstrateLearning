const { ApiPromise, WsProvider } = require('@polkadot/api');

async function main() {
  // Connect to a Polkadot node using WsProvider
  const provider = new WsProvider('wss://ws.calamari.systems');
  const api = await ApiPromise.create({ provider });

  await api.isReady;

  // Retrieve the existentialDeposit value from the runtime constants
  const existentialDeposit = api.consts.balances.existentialDeposit;

  console.log(`existentialDeposit: ${existentialDeposit}`);

  // Disconnect from the provider
  provider.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
