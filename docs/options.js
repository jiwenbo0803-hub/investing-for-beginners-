const REPO_BASE = 'https://github.com/jiwenbo0803-hub/investing-for-beginners-/blob/main/content/options/';
const STORAGE_KEY = 'options-learning-progress-v1';
const THEME_KEY = 'learning-lab-theme';

const modules = [
  { no:'01', title:'期权基础', desc:'先把合约结构、到期与价值构成学清楚。', topics:[
    ['期权是什么？Call 与 Put 入门','calls-and-puts.md'], ['行权价是什么？','strike-price.md'], ['期权到期日是什么？','expiration-date.md'],
    ['期权权利金是什么？','option-premium.md'], ['内在价值和时间价值是什么？','intrinsic-time-value.md'], ['实值、平值、虚值怎么区分？','moneyness.md'] ] },
  { no:'02', title:'期权链与交易机制', desc:'会看报价、流动性和订单，才能谈策略。', topics:[
    ['期权链怎么看？','option-chain.md'], ['成交量和未平仓量有什么区别？','open-interest-volume.md'], ['期权买卖价差怎么看？','bid-ask-options.md'],
    ['期权订单怎么选？','option-order-types.md'], ['期权流动性怎么看？','options-liquidity.md'], ['期权合约乘数为什么通常是 100？','contract-multiplier.md'] ] },
  { no:'03', title:'Greeks 风险暴露', desc:'Delta、Gamma、Theta、Vega 是期权风险语言。', topics:[
    ['Delta 和 Gamma 是什么？','delta-gamma.md'], ['Theta 时间损耗是什么？','theta.md'], ['Vega 是什么？','vega.md'],
    ['Rho 利率敏感度什么时候重要？','rho.md'], ['组合希腊值怎么看？','net-greeks.md'], ['为什么不同券商的 Greeks 不一样？','option-greeks-model-discrepancy.md'] ] },
  { no:'04', title:'隐含波动率与波动率结构', desc:'期权不只交易方向，也交易波动率本身。', topics:[
    ['隐含波动率 IV 是什么？','implied-volatility.md'], ['历史波动率是什么？','historical-volatility.md'], ['隐含波动率和实际波动率有什么区别？','implied-vs-realized-volatility.md'],
    ['IV Rank 和 IV Percentile 怎么用？','iv-rank-percentile.md'], ['波动率偏斜是什么？','volatility-skew.md'], ['波动率期限结构是什么？','term-structure.md'] ] },
  { no:'05', title:'单腿与持股策略', desc:'先学最直观的方向暴露和保护策略。', topics:[
    ['买入 Call 前要算什么？','buying-call.md'], ['买入 Put 前要算什么？','buying-put.md'], ['备兑开仓 Covered Call 是什么？','covered-call.md'],
    ['现金担保卖 Put 是什么？','cash-secured-put.md'], ['保护性 Put 是什么？','protective-put.md'], ['领口策略是什么？','collar-strategy.md'] ] },
  { no:'06', title:'垂直价差与有限风险', desc:'用多腿结构把收益和最大亏损预先限定。', topics:[
    ['垂直价差是什么？','vertical-spread.md'], ['借方价差是什么？','debit-spread.md'], ['信用价差是什么？','credit-spread.md'],
    ['牛市看涨价差是什么？','bull-call-spread.md'], ['熊市看跌价差是什么？','bear-put-spread.md'], ['牛市看跌信用价差是什么？','bull-put-spread.md'] ] },
  { no:'07', title:'中性与波动率策略', desc:'方向不明确时，策略核心变成区间和波动预期。', topics:[
    ['买入跨式是什么？','long-straddle.md'], ['买入宽跨式是什么？','long-strangle.md'], ['铁鹰策略是什么？','iron-condor.md'],
    ['铁蝶策略是什么？','iron-butterfly.md'], ['蝶式价差是什么？','butterfly-spread.md'], ['日历价差是什么？','calendar-spread.md'] ] },
  { no:'08', title:'行权、指派与到期日', desc:'很多期权亏损来自不理解交割，而不是方向判断。', topics:[
    ['行权与指派是什么？','exercise-assignment.md'], ['期权指派风险是什么？','assignment-risk.md'], ['提前行权是什么？','early-exercise.md'],
    ['自动行权规则是什么？','exercise-by-exception.md'], ['Pin Risk 是什么？','pin-risk.md'], ['期权到期日应该怎样处理持仓？','expiration-day-position-checklist.md'] ] },
  { no:'09', title:'滚仓与仓位管理', desc:'策略只是起点，真正的难点是管理持仓生命周期。', topics:[
    ['期权滚仓是什么？','options-rolling.md'], ['Covered Call 如何滚仓？','covered-call-roll.md'], ['现金担保 Put 如何滚仓？','cash-secured-put-roll.md'],
    ['期权仓位大小怎么定？','position-sizing-options.md'], ['期权交易如何复盘？','options-journal.md'], ['期权观察名单怎么建立？','options-watchlist.md'] ] },
  { no:'10', title:'财报、FOMC 与事件波动', desc:'事件期权常见陷阱是方向看对、波动率却做错。', topics:[
    ['财报期权为什么不只看方向？','earnings-options.md'], ['Expected Move 怎么看？','expected-move.md'], ['财报期权的预期波动怎么看？','earnings-straddle-expected-move.md'],
    ['事件波动率为什么重要？','event-volatility.md'], ['FOMC 前后交易期权要注意什么？','fomc-options-risk.md'], ['实际波动与隐含预期差多少？','realized-vs-implied-move.md'] ] },
  { no:'11', title:'对冲与组合风险', desc:'从单一策略升级到组合层面的敞口管理。', topics:[
    ['Delta 对冲是什么？','delta-hedging.md'], ['Delta 中性为什么不等于无风险？','delta-neutral.md'], ['Beta 加权 Delta 怎么用？','beta-weighted-delta-hedging.md'],
    ['期权仓位如何做压力测试？','option-stress-testing.md'], ['组合 Vega 分桶','portfolio-vega-bucketing.md'], ['尾部风险对冲应该怎样设计？','tail-risk-hedging.md'] ] },
  { no:'12', title:'期权定价与模型', desc:'理解模型不是为了背公式，而是理解价格由什么组成。', topics:[
    ['Black-Scholes 模型对交易有什么用？','black-scholes-model.md'], ['二叉树模型为什么适合美式期权？','binomial-option-pricing.md'], ['Put-Call Parity 有什么用？','put-call-parity.md'],
    ['怎样用无套利边界检查期权报价？','no-arbitrage-option-bounds.md'], ['波动率曲面怎样帮助比较期权？','volatility-surface.md'], ['期权模型风险是什么？','option-model-risk.md'] ] },
  { no:'13', title:'高级结构与微观机制', desc:'最后再进入 0DTE、长期期权、Dealer Gamma 与高级保证金。', topics:[
    ['0DTE 期权是什么？','0dte-options.md'], ['LEAPS 长期期权是什么？','leaps.md'], ['PMCC 穷人版备兑开仓是什么？','poor-mans-covered-call.md'],
    ['Dealer Gamma Exposure 应该怎样看？','dealer-gamma-exposure.md'], ['Gamma Scalping 是什么？','gamma-scalping.md'], ['投资组合保证金有什么风险？','portfolio-margin-options.md'] ] }
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

const savedTheme = localStorage.getItem(THEME_KEY) || localStorage.getItem('us-equity-learning-theme');
if (savedTheme) document.documentElement.dataset.theme = savedTheme;
$('#themeToggle').addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem(THEME_KEY, next);
  localStorage.setItem('us-equity-learning-theme', next);
});

render();
updateProgress();
