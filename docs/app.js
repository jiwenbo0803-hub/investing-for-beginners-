const REPO_BASE = 'https://github.com/jiwenbo0803-hub/investing-for-beginners-/blob/main/content/stocks/';
const STORAGE_KEY = 'us-equity-learning-progress-v1';
const THEME_KEY = 'us-equity-learning-theme';

const modules = [
  {
    no: '01', title: '市场与交易入门', desc: '先理解美股怎样交易，再谈选股与策略。',
    topics: [
      ['美股指数是什么？','market-index.md'], ['ETF 是什么？','etf.md'], ['美股交易时间怎么看？','trading-hours.md'], ['市价单和限价单应该怎么选？','market-order-limit-order.md'], ['买卖价差是什么？','bid-ask-spread.md'], ['保证金账户是什么？','margin-account.md']
    ]
  },
  {
    no: '02', title: '技术与盘面', desc: '观察价格、波动、广度与市场行为。',
    topics: [
      ['52 周新高和新低应该怎么看？','52-week-high-low.md'], ['涨跌线 A/D Line 有什么用？','advance-decline-line.md'], ['市场广度为什么重要？','market-breadth.md'], ['波动率怎样用于仓位管理？','volatility.md'], ['流通股 Float 为什么影响股价波动？','float.md'], ['Short Interest 高意味着什么？','short-interest.md']
    ]
  },
  {
    no: '03', title: '财务基础与商业质量', desc: '学会三张表，再判断公司究竟赚不赚钱。',
    topics: [
      ['利润表怎么看？','income-statement.md'], ['资产负债表怎么看？','balance-sheet.md'], ['现金流量表怎么看？','cash-flow-statement.md'], ['营收和利润有什么区别？','revenue-vs-profit.md'], ['毛利率是什么？','gross-margin.md'], ['经济护城河是什么？','economic-moat.md']
    ]
  },
  {
    no: '04', title: '现金流与资本结构', desc: '从“利润”进一步走到现金、债务与资本回报。',
    topics: [
      ['自由现金流 FCF 是什么？','free-cash-flow.md'], ['ROIC 是什么？','roic.md'], ['债务到期墙应该怎样分析？','debt-maturity-wall-analysis.md'], ['利息覆盖倍数是什么？','interest-coverage.md'], ['资本配置为什么决定长期回报？','capital-allocation.md'], ['财务杠杆如何放大回报和风险？','financial-leverage.md']
    ]
  },
  {
    no: '05', title: '财报深度分析', desc: '把 Earnings 从“看 EPS”升级成完整经营诊断。',
    topics: [
      ['财报是什么？','earnings-report.md'], ['财报电话会怎么看？','earnings-call.md'], ['公司指引是什么？','guidance.md'], ['盈利质量怎么看？','earnings-quality.md'], ['财报季应该重点看什么？','earnings-season.md'], ['财报电话会应该听什么？','earnings-call-question-checklist.md']
    ]
  },
  {
    no: '06', title: '宏观与市场情绪', desc: '把利率、通胀、就业和风险偏好连接到资产定价。',
    topics: [
      ['美联储议息会议为什么影响美股？','fed-meeting.md'], ['CPI 通胀数据怎么看？','cpi-inflation.md'], ['非农就业数据怎么看？','nonfarm-payrolls.md'], ['收益率曲线倒挂意味着什么？','yield-curve.md'], ['Risk-on / Risk-off 怎么理解？','risk-on-risk-off.md'], ['VIX 恐慌指数是什么？','vix-index.md']
    ]
  },
  {
    no: '07', title: '估值体系', desc: '从倍数估值到现金流折现，理解“好公司”和“好价格”的区别。',
    topics: [
      ['市盈率 PE 是什么？','pe-ratio.md'], ['DCF 估值是什么？','discounted-cash-flow.md'], ['EV/EBITDA 怎么看？','ev-ebitda.md'], ['PEG 怎么把估值和增长放在一起看？','peg-ratio.md'], ['市净率 PB 适合分析什么公司？','pb-ratio.md'], ['安全边际是什么？','margin-of-safety.md']
    ]
  },
  {
    no: '08', title: '盈利质量与增长', desc: '拆解增长来源，识别“看起来增长”和“高质量增长”。',
    topics: [
      ['应计比率 Accrual Ratio 怎么看？','accrual-ratio.md'], ['CAC 获客成本怎么判断？','customer-acquisition-cost.md'], ['ARR 年化经常性收入怎么看？','arr.md'], ['Bookings 和 Backlog 有什么区别？','bookings-backlog.md'], ['现金转换周期是什么？','cash-conversion-cycle.md'], ['库存周转率是什么？','inventory-turnover.md']
    ]
  },
  {
    no: '09', title: '稀释、回购与公司行动', desc: '关注每股价值，而不只看公司总利润。',
    topics: [
      ['股权稀释是什么？','share-dilution.md'], ['股权激励 SBC 为什么也是成本？','stock-based-compensation.md'], ['股票回购是什么？','stock-buyback.md'], ['股票回购质量应该怎样检查？','buyback-quality-checklist.md'], ['可转债对股票有什么影响？','convertible-bond.md'], ['股票拆分是什么？','stock-split.md']
    ]
  },
  {
    no: '10', title: '高级会计与企业价值', desc: '进入企业价值、业务分部和资本市场层面的分析。',
    topics: [
      ['企业价值 EV 是什么？','enterprise-value.md'], ['业务分部应该怎样看？','business-segment.md'], ['资本配置为什么决定长期回报？','capital-allocation.md'], ['CapEx 应该怎样分析？','capex.md'], ['应收账款是什么？','accounts-receivable.md'], ['递延收入是什么？','deferred-revenue.md']
    ]
  },
  {
    no: '11', title: '财务取证与风险红旗', desc: '从“会看财报”升级到“会怀疑财报”。',
    topics: [
      ['Beneish M-Score 能发现什么问题？','beneish-m-score.md'], ['Altman Z-Score 怎样判断破产风险？','altman-z-score.md'], ['现金流红旗应该怎样识别？','cash-flow-red-flag-checklist.md'], ['审计师辞任或更换意味着什么？','auditor-resignation-change.md'], ['资产负债表压力测试','balance-sheet-stress-test.md'], ['应计费用分析','accrued-expenses-analysis.md']
    ]
  },
  {
    no: '12', title: 'SEC 文件与公司治理', desc: '真正做美股个股研究，最终要回到一手披露文件。',
    topics: [
      ['10-K 年报怎么看？','annual-report-10k.md'], ['10-Q 季报怎么看？','form-10q.md'], ['8-K 临时公告怎么看？','form-8k.md'], ['13F 持仓文件应该怎样用？','form-13f.md'], ['怎样查阅 SEC 文件？','sec-filing.md'], ['股东大会适合看什么？','annual-meeting.md']
    ]
  },
  {
    no: '13', title: '融资与特殊事件', desc: 'IPO、SPAC、退市、ATM 等事件往往改变风险收益结构。',
    topics: [
      ['IPO 是什么？','ipo.md'], ['SPAC 是什么？','spac.md'], ['直接上市和 IPO 有什么区别？','direct-listing.md'], ['美股退市后会怎样？','delisting.md'], ['ATM 增发追踪','atm-offering-tracker.md'], ['反向 ETF 为什么不适合长期持有？','inverse-etf.md']
    ]
  }
];

const $ = (selector) => document.querySelector(selector);
const modulesEl = $('#modules');
const searchInput = $('#searchInput');
let progress = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

function topicId(module, file) { return `${module.no}:${file}`; }
function allTopics() { return modules.flatMap(m => m.topics.map(t => ({ module: m, title: t[0], file: t[1] }))); }

function render(filter = '') {
  const q = filter.trim().toLowerCase();
  modulesEl.innerHTML = '';
  let visible = 0;

  modules.forEach(module => {
    const matches = module.topics.filter(([title, file]) => `${module.title} ${module.desc} ${title} ${file}`.toLowerCase().includes(q));
    if (q && matches.length === 0 && !`${module.title} ${module.desc}`.toLowerCase().includes(q)) return;
    const topics = q && matches.length ? matches : module.topics;
    visible += topics.length;

    const completed = module.topics.filter(([, file]) => progress[topicId(module, file)]).length;
    const card = document.createElement('article');
    card.className = 'module-card';
    card.innerHTML = `
      <div class="module-head">
        <div class="module-no">${module.no}</div>
        <div><h3>${module.title}</h3><p>${module.desc}</p></div>
        <div class="module-progress">${completed}/${module.topics.length}</div>
      </div>
      <div class="topic-list">
        ${topics.map(([title, file]) => {
          const id = topicId(module, file); const done = !!progress[id];
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
  const done = allTopics().filter(({module, file}) => progress[topicId(module, file)]).length;
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
