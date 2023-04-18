const { ApiPromise, WsProvider } = require('@polkadot/api');

async function main() {
  // Connect to a Polkadot node using WsProvider
  const provider = new WsProvider('wss://ws.calamari.systems');
  const api = await ApiPromise.create({ provider });

  // Specify the address of the account to query
  const address = 'dmyEQb7rjpbyR5JCHcJ65r7DerK2GLdWwXn6DJWcnKrMuCva8';

  // Retrieve the account information using api.query.system.account
  const accountInfo = await api.query.system.account(address);

  console.log(`Balance of ${address}: ${accountInfo.data.free}`);

  // Disconnect from the provider
  provider.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
