// 导入所需的库
const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api');
const { async, ConnectableObservable } = require('rxjs');

const wsProviderUrl = 'wss://i1.calamari.systems';

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

async function connectSubstrate(wsUrl) {

  // 创建WebSocket提供程序
  const wsProvider = new WsProvider(wsUrl);

  // 通过提供程序创建API实例
  const api = await ApiPromise.create({provider: wsProvider});

  await api.isReady;

  console.log("Connect successfully")

  return api
}

async function printAliceBobBalance(api,alice,bob){
    // console.log("Alice address: ", alice.address)
    // console.log("Alice address: ", bob.address)
    console.log("alice balance: ",await getFreeBalance(api,alice.address))
    console.log("bob balance: ",await getFreeBalance(api,bob.address))
}

async function getFreeBalance(api, userAddress){
    const userAccount = await api.query.system.account(userAddress)
    return userAccount['data']['free'].toHuman();
}

async function getConst(api) {
    const deposit = await api.consts.balances.existentialDeposit.toHuman();
    console.log("Deposit: ", deposit)
    return deposit;
}

async function transferFromAliceToBob(api,alice,bob,amount){
    await api.tx.balances.transfer(bob.address,amount).signAndSend(alice,res => {
        console.log(`Tx status: ${res.status}`);
    })
}

async function subscribeAliceBalance(api,alice){
    await api.query.system.account(alice.address,aliceAcct => {
        console.log("Subscribed to Alice account");
        const aliceFreeSub = aliceAcct.data.free;
        console.log(`Alice account (sub): ${aliceFreeSub}`)
    })
}

async function subscribeEvent(api){
    // 订阅新块头事件
  const subscribe = await api.rpc.chain.subscribeNewHeads(async (header) => {
    console.log(`新块头：#${header.number}，哈希：${header.hash}`);

    // 获取当前块的事件
    const events = await api.query.system.events.at(header.hash);

    // 遍历并打印事件
    events.forEach(({ event }, index) => {
      console.log(`事件 ${index}: ${event.section}:${event.method}:: (phase=${event.phase.toString()})`);
      console.log(`\t详情: ${event.meta.documentation.toString()}`);
      console.log(`\t参数: ${event.data.toString()}`);
    });
  });

  await subscribe();

  // 在30秒后取消订阅
  setTimeout(async () => {
    await subscribe();
    console.log('取消事件订阅');
    api.disconnect();
  }, 30000);
}

async function subTest(api){
  const unsub = await api.query.timestamp.now((moment) => {
    console.log(`The last block has a timestamp of ${moment}`);
  });
}



async function getHistoricalTransactionFailureInfo(api,blockNumber) {
  // Get the block hash for the specified block number
  const blockHash = await api.rpc.chain.getBlockHash(blockNumber);

  // Retrieve the events for the specified block
  // const apiAT = await api.at(blockHash);
  const block = await api.rpc.chain.getBlock(blockHash);
  

  // Filter events related to the specific transaction
  // const transactionEvents = events.filter((event) => {
  //   const { event: { method, section, data } } = event;

  //   // Check if the event is related to the desired extrinsic
  //   return method === 'ExtrinsicFailed' && section === 'system';
  // });

  // Extract the failure information from the events
  if (transactionEvents.length > 0) {
    const { event: { data } } = transactionEvents[0];
    console.log('Transaction Failure Info:', data.toString());

    // Process and extract relevant failure information
    // ...
  } else {
    console.log('Transaction is successful');
  }
}


async function main() {
    const api  = await connectSubstrate(wsProviderUrl);

    await subTest(api);
    // await getHistoricalTransactionFailureInfo(api,3509303)
    // const existentionDeposit = await getConst(api);
    
    // const keyring = new Keyring({type: 'sr25519'})
    // const alice = keyring.addFromUri('//Alice')
    // const bob = keyring.addFromUri('//Bob')

    // await subscribeEvent(api);

    // subscribeAliceBalance()
    // // Before transfer
    // await printAliceBobBalance(api,alice,bob);

    // await transferFromAliceToBob(api,alice,bob, 10**6);

    // await subscribeAliceBalance(api,alice,bob);

    // // After transfer
    // await printAliceBobBalance(api,alice,bob);

}

main().then(() =>{
    console.log("Success created")
    // process.exit(0);
}).catch(console.error);
