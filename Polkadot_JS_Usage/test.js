const { ApiPromise, WsProvider } = require('@polkadot/api');

async function main() {
  const wsProviderUrl = 'ws://127.0.0.1:9944';
  const wsProvider = new WsProvider(wsProviderUrl);
  const api = await ApiPromise.create({ provider: wsProvider });

  // 确保API已完成初始化
  await api.isReady;

  console.log('订阅事件：');

  // 订阅新块头事件
  const unsubscribe = await api.rpc.chain.subscribeNewHeads(async (header) => {
    console.log(`新块头：#${header.number}，哈希：${header.hash}`);

    // 获取当前块的事件
    const events = await api.query.system.events.at(header.hash);

    // 如果有事件，遍历并打印事件
    if (events.length > 0) {
      events.forEach(({ event }, index) => {
        console.log(`事件 ${index}: ${event.section}:${event.method}:: (phase=${event.phase ? event.phase.toString() : 'unknown'})`);
        console.log(`\t详情: ${event.meta.documentation? event.meta.documentation.toString(): 'unkown'}`);
        console.log(`\t参数: ${event.data? event.data.toString() : 'unknow'}`);
      });
    }
  });

  // 在30秒后取消订阅
  setTimeout(async () => {
    await unsubscribe();
    console.log('取消事件订阅');
    api.disconnect();
  }, 3000000);
}

main().catch(console.error);
