const REPO_BASE = 'https://github.com/jiwenbo0803-hub/investing-for-beginners-/blob/main/content/crypto/';
const STORAGE_KEY = 'crypto-learning-progress-v1';
const THEME_KEY = 'learning-lab-theme';

const modules = [
  { no:'01', title:'区块链与加密基础', desc:'先理解 BTC、ETH 和区块链到底是什么。', topics:[
    ['比特币是什么？','bitcoin.md'], ['以太坊是什么？','ethereum.md'], ['区块链是什么？','blockchain.md'],
    ['Coin 和 Token 有什么区别？','token-vs-coin.md'], ['PoW 工作量证明是什么？','proof-of-work.md'], ['PoS 权益证明是什么？','proof-of-stake.md'] ] },
  { no:'02', title:'钱包与资产安全', desc:'加密资产的第一原则：私钥与授权比收益更重要。', topics:[
    ['加密钱包是什么？','wallet.md'], ['热钱包是什么？','hot-wallet.md'], ['冷钱包是什么？','cold-wallet.md'],
    ['助记词是什么？','seed-phrase.md'], ['公钥和私钥是什么？','public-private-key.md'], ['私钥应该怎样管理？','private-key-management.md'] ] },
  { no:'03', title:'交易所与现货交易', desc:'理解 CEX、DEX、订单簿与实际成交机制。', topics:[
    ['加密货币交易所是什么？','exchange.md'], ['CEX 中心化交易所是什么？','cex.md'], ['DEX 去中心化交易所是什么？','dex.md'],
    ['加密订单簿怎么看？','order-book-crypto.md'], ['加密市价单是什么？','market-order-crypto.md'], ['加密限价单是什么？','limit-order-crypto.md'] ] },
  { no:'04', title:'永续合约与杠杆', desc:'杠杆交易的核心不是方向，而是保证金、价格与清算机制。', topics:[
    ['永续合约是什么？','perpetual-futures.md'], ['资金费率是什么？','funding-rate.md'], ['爆仓和强平是什么？','liquidation.md'],
    ['加密杠杆是什么？','leverage-crypto.md'], ['标记价格是什么？','mark-price.md'], ['加密合约未平仓量是什么？','open-interest-crypto.md'] ] },
  { no:'05', title:'稳定币与储备风险', desc:'稳定币不是现金替代物，关键要看储备、脱锚和交易所流动性。', topics:[
    ['稳定币是什么？','stablecoin.md'], ['USDT、USDC 和 DAI 有什么区别？','usdt-usdc-dai.md'], ['稳定币脱锚是什么？','stablecoin-depeg.md'],
    ['稳定币收益从哪里来？','stablecoin-yield.md'], ['交易所储备证明是什么？','proof-of-reserves.md'], ['交易所挤兑是什么？','exchange-bank-run.md'] ] },
  { no:'06', title:'DeFi 与链上流动性', desc:'从 AMM 到借贷协议，理解链上金融怎样运转。', topics:[
    ['DeFi 是什么？','defi.md'], ['流动性池是什么？','liquidity-pool.md'], ['AMM 自动做市商是什么？','amm.md'],
    ['无常损失是什么？','impermanent-loss.md'], ['DeFi 借贷协议是什么？','lending-protocol.md'], ['健康因子是什么？','health-factor-defi.md'] ] },
  { no:'07', title:'质押、收益与 TVL', desc:'收益不是凭空产生的，要知道奖励来自发行、手续费还是风险补偿。', topics:[
    ['Staking 质押是什么？','staking.md'], ['流动性质押是什么？','liquid-staking.md'], ['Restaking 再质押是什么？','restaking.md'],
    ['Yield Farming 收益耕作是什么？','yield-farming.md'], ['TVL 是什么？','tvl.md'], ['代币回购一定是利好吗？','token-buyback.md'] ] },
  { no:'08', title:'Tokenomics 与供给', desc:'研究币价之前，先把市值、FDV、解锁和排放看明白。', topics:[
    ['Tokenomics 代币经济学怎么看？','tokenomics.md'], ['流通市值和 FDV 有什么区别？','market-cap-fdv.md'], ['最大供应量是什么？','max-supply.md'],
    ['流通供应量是什么？','circulating-supply.md'], ['代币解锁是什么？','token-unlock.md'], ['代币排放为什么形成卖压？','token-emission.md'] ] },
  { no:'09', title:'链上基础设施', desc:'理解智能合约、预言机、L2、跨链桥与区块浏览器。', topics:[
    ['智能合约是什么？','smart-contract.md'], ['预言机是什么？','oracle.md'], ['Layer 2 是什么？','layer2.md'],
    ['跨链桥是什么？','cross-chain-bridge.md'], ['区块浏览器怎么查交易？','block-explorer.md'], ['Chain ID 链 ID 是什么？','chain-id.md'] ] },
  { no:'10', title:'MEV 与链上成交', desc:'链上交易不是“按下 Swap 就结束”，排序和滑点本身就是风险。', topics:[
    ['MEV 为什么会影响链上成交？','mev.md'], ['链上抢跑是什么？','front-running.md'], ['夹子攻击如何减少损失？','sandwich-attack.md'],
    ['加密交易滑点是什么？','slippage-crypto.md'], ['钱包授权是什么？','wallet-approval.md'], ['交易模拟是什么？','transaction-simulation.md'] ] },
  { no:'11', title:'诈骗与智能合约攻击', desc:'把最常见的资产损失路径逐个拆开。', topics:[
    ['加密钓鱼如何防范？','phishing-scam.md'], ['地址投毒是什么？','address-poisoning.md'], ['Rug Pull 跑路盘是什么？','rug-pull.md'],
    ['钱包 Drainer 是什么？','wallet-drainer.md'], ['预言机攻击是什么？','oracle-attack.md'], ['重入攻击是什么？','reentrancy-attack.md'] ] },
  { no:'12', title:'市场周期与主题交易', desc:'从减半、BTC 市占率到山寨季和 Meme，理解资金轮动。', topics:[
    ['加密 ETF 是什么？','crypto-etf.md'], ['比特币减半意味着什么？','halving.md'], ['比特币市占率怎么看？','bitcoin-dominance.md'],
    ['山寨季是什么？','altcoin-season.md'], ['Meme Coin 是什么？','meme-coin.md'], ['空投是什么？','airdrop.md'] ] },
  { no:'13', title:'DAO、治理与新型钱包', desc:'进入协议治理与账户体系，理解“谁真正控制协议”。', topics:[
    ['DAO 是什么？','dao.md'], ['治理代币是什么？','governance-token.md'], ['治理攻击是什么？','governance-attack.md'],
    ['多签钱包是什么？','multisig-wallet.md'], ['账户抽象是什么？','account-abstraction.md'], ['社交恢复钱包怎样找回账户？','social-recovery-wallet.md'] ] }
];

const $ = (selector) => document.querySelector(selector);
const modulesEl = $('#modules');
const searchInput = $('#searchInput');
let progress = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

function topicId(module, file) { return `${module.no}:${file}`; }
function allTopics() { return modules.flatMap(m => m.topics.map(t => ({ module:m, title:t[0], file:t[1] }))); }

function render(filter='') {
  const q = filter.trim().toLowerCase();
  modulesEl.innerHTML = '';
  let visible = 0;
  modules.forEach(module => {
    const matches = module.topics.filter(([title,file]) => `${module.title} ${module.desc} ${title} ${file}`.toLowerCase().includes(q));
    if (q && matches.length === 0 && !`${module.title} ${module.desc}`.toLowerCase().includes(q)) return;
    const topics = q && matches.length ? matches : module.topics;
    visible += topics.length;
    const completed = module.topics.filter(([,file]) => progress[topicId(module,file)]).length;
    const card = document.createElement('article');
    card.className = 'module-card';
    card.innerHTML = `
      <div class="module-head">
        <div class="module-no">${module.no}</div>
        <div><h3>${module.title}</h3><p>${module.desc}</p></div>
        <div class="module-progress">${completed}/${module.topics.length}</div>
      </div>
      <div class="topic-list">
        ${topics.map(([title,file]) => {
          const id = topicId(module,file); const done = !!progress[id];
          return `<div class="topic ${done ? 'done' : ''}">
            <input type="checkbox" ${done ? 'checked' : ''} data-id="${id}" aria-label="标记 ${title} 为已完成" />
            <span class="topic-name">${title}</span>
            <a href="${REPO_BASE}${file}" target="_blank" rel="noreferrer">原文 ↗</a>
          </div>`;
        }).join('')}
      </div>`;
    modulesEl.appendChild(card);
  });
  if (!visible) modulesEl.innerHTML = '<div class="no-results">没有找到匹配主题，换个关键词试试。</div>';
  bindChecks();
}

function bindChecks() {
  document.querySelectorAll('.topic input').forEach(box => {
    box.addEventListener('change', () => {
      progress[box.dataset.id] = box.checked;
      if (!box.checked) delete progress[box.dataset.id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      render(searchInput.value);
      updateProgress();
    });
  });
}

function updateProgress() {
  const total = allTopics().length;
  const done = allTopics().filter(({module,file}) => progress[topicId(module,file)]).length;
  const percent = total ? Math.round(done / total * 100) : 0;
  $('#topicCount').textContent = total;
  $('#progressText').textContent = `${percent}%`;
  $('#progressBar').style.width = `${percent}%`;
}

function randomPick() {
  const pool = allTopics().filter(({module,file}) => !progress[topicId(module,file)]);
  const source = pool.length ? pool : allTopics();
  const pick = source[Math.floor(Math.random() * source.length)];
  $('#pickTitle').textContent = pick.title;
  $('#pickModule').textContent = `模块 ${pick.module.no} · ${pick.module.title}`;
  $('#pickLink').href = REPO_BASE + pick.file;
  $('#pickDialog').showModal();
}

searchInput.addEventListener('input', e => render(e.target.value));
document.addEventListener('keydown', e => {
  if (e.key === '/' && document.activeElement !== searchInput) { e.preventDefault(); searchInput.focus(); }
  if (e.key === 'Escape' && $('#pickDialog').open) $('#pickDialog').close();
});
$('#todayPick').addEventListener('click', randomPick);
$('#dialogClose').addEventListener('click', () => $('#pickDialog').close());

const savedTheme = localStorage.getItem(THEME_KEY);
if (savedTheme) document.documentElement.dataset.theme = savedTheme;
$('#themeToggle').addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem(THEME_KEY, next);
});

render();
updateProgress();
