const fs = require('fs');
const { Keyring } = require('@polkadot/api');
const { ApiPromise, WsProvider } = require('@polkadot/api');
const { BN } = require('bn.js');

async function main() {
    const json = JSON.parse(fs.readFileSync('./account.json', 'utf8'));
    const keyring = new Keyring({ type: 'sr25519' });
    const pair = keyring.addFromJson(json);

    if (pair.isLocked) {
        await pair.unlock("Cdl12345!");
    }

    const provider = new WsProvider('wss://ws.calamari.systems');
    const api = await ApiPromise.create({ provider });

    const transferAmount = new BN('5000000000000');
    const recipient = 'dmvCt6VeEQeyhBbWkuKwFBV6rf3vNNaGzVmPV9xu64FijvTtC'; // replace with actual recipient address

    const transfer = api.tx.balances.transfer(recipient, transferAmount);

    const txHash = await transfer.signAndSend(pair);
    console.log(`Transaction hash: ${txHash}`);

}

main().catch((error) => {
    console.error(error);
    process.exit(-1);
  });