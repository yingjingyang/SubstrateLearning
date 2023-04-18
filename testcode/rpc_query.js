const { ApiPromise, WsProvider } = require('@polkadot/api');

async function main() {
    const provider = new WsProvider('wss://ws.calamari.systems');
    const api = await ApiPromise.create({ provider });

    await api.isReady;

    // Retrieve the chain name
    const chain = await api.rpc.system.chain();
    console.log(chain)

    // Retrieve the latest header
    const lastHeader = await api.rpc.chain.getHeader();
    console.log(lastHeader)
}

main().catch(console.error);
