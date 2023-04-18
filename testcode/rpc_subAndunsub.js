const { ApiPromise, WsProvider } = require('@polkadot/api');

async function main() {
    const provider = new WsProvider('wss://ws.calamari.systems');
    const api = await ApiPromise.create({ provider });

    await api.isReady;

    // let count = 0;

    // // Retrieve the chain name
    // const chain = await api.rpc.system.chain();

    // // Subscribe to the new headers
    // const unsubHeads = await api.rpc.chain.subscribeNewHeads((lastHeader) => {
    // console.log(`${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`);

    // if (++count === 10) {
    //     unsubHeads();
    // }
    // });

    // Retrieve a snapshot of the validators
// (all active & waiting based on ValidatorPrefs storage)
const validatorKeys = await api.query.staking.validators.keys();

// Subscribe to the balances for these accounts
const unsub = await api.query.balances.account.multi(validatorKeys, (balances) => {
  console.log(`The nonce and free balances are: ${balances.map(([nonce, { free }]) => [nonce, free])}`);
});
}

main().catch(console.error);
