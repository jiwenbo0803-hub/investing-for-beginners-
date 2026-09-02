(() => {
  const ENGINE_SOURCES = [
    'https://cdn.jsdelivr.net/npm/lunar-javascript@1.7.7/lunar.js',
    'https://unpkg.com/lunar-javascript@1.7.7/lunar.js'
  ];

  const STEM_ELEMENT = {
    '甲':'木','乙':'木','丙':'火','丁':'火','戊':'土',
    '己':'土','庚':'金','辛':'金','壬':'水','癸':'水'
  };
  const BRANCH_ELEMENT = {
    '子':'水','丑':'土','寅':'木','卯':'木','辰':'土','巳':'火',
    '午':'火','未':'土','申':'金','酉':'金','戌':'土','亥':'水'
  };
  const ELEMENT_ORDER = ['木','火','土','金','水'];
  const ELEMENT_HINT = {
    '木':'生发、试探、启动',
    '火':'延续、顺势、持有',
    '土':'稳定、等待、守成',
    '金':'收敛、兑现、降低暴露',
    '水':'退守、回避、保留现金'
  };

  const $ = (id) => document.getElementById(id);
  const esc = (value='') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async function ensureEngine() {
    if (typeof Solar !== 'undefined' && typeof Lunar !== 'undefined') return true;
    for (const src of ENGINE_SOURCES) {
      try {
        await loadScript(src);
        if (typeof Solar !== 'undefined' && typeof Lunar !== 'undefined') return true;
      } catch (_) {
        // Try the alternate CDN.
      }
    }
    return false;
  }

  function safeCall(obj, method, fallback='') {
    try {
      return obj && typeof obj[method] === 'function' ? obj[method]() : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function pillarElements(ganZhi='') {
    const gan = ganZhi.charAt(0);
    const zhi = ganZhi.charAt(1);
    return [STEM_ELEMENT[gan], BRANCH_ELEMENT[zhi]].filter(Boolean);
  }

  function buildFiveElementSignal(pillars) {
    const weights = {年:0.75, 月:1.25, 日:1.5};
    const scores = {木:0, 火:0, 土:0, 金:0, 水:0};

    pillars.forEach(({label, ganZhi}) => {
      const weight = weights[label] || 1;
      pillarElements(ganZhi).forEach(element => { scores[element] += weight; });
    });

    const ranked = ELEMENT_ORDER
      .map(element => ({element, score:scores[element]}))
      .sort((a,b) => b.score - a.score || ELEMENT_ORDER.indexOf(a.element) - ELEMENT_ORDER.indexOf(b.element));

    const dominant = ranked[0];
    const runnerUp = ranked[1];
    const margin = dominant.score - runnerUp.score;
    let action = '偏持仓';

    if (dominant.element === '木') action = margin >= 0.5 ? '偏开仓' : '偏持仓';
    if (dominant.element === '火') action = '偏持仓';
    if (dominant.element === '土') action = '偏持仓';
    if (dominant.element === '金') action = '偏减仓';
    if (dominant.element === '水') action = margin >= 1 ? '偏清仓' : '偏减仓';

    return {
      action,
      dominant: dominant.element,
      scores,
      reason: `${dominant.element}气相对更显，娱乐映射为“${ELEMENT_HINT[dominant.element]}”方向。`
    };
  }

  function formatLunarDate(lunar) {
    const y = safeCall(lunar, 'getYearInChinese');
    const m = safeCall(lunar, 'getMonthInChinese');
    const d = safeCall(lunar, 'getDayInChinese');
    if (y && m && d) return `${y}年${m}月${d}`;
    return safeCall(lunar, 'toString', '农历日期');
  }

  function renderTags(items, className) {
    const list = Array.isArray(items) && items.length ? items.slice(0, 5) : ['—'];
    return list.map(item => `<span class="${className}">${esc(item)}</span>`).join('');
  }

  function renderAlmanac() {
    const root = $('dailyAlmanac');
    if (!root) return;

    try {
      const now = new Date();
      const solar = Solar.fromDate(now);
      const lunar = solar.getLunar();
      const solarText = new Intl.DateTimeFormat('zh-CN', {
        year:'numeric', month:'long', day:'numeric', weekday:'long'
      }).format(now);

      const yearGz = safeCall(lunar, 'getYearInGanZhiExact') || safeCall(lunar, 'getYearInGanZhi');
      const monthGz = safeCall(lunar, 'getMonthInGanZhiExact') || safeCall(lunar, 'getMonthInGanZhi');
      const dayGz = safeCall(lunar, 'getDayInGanZhi');
      const pillars = [
        {label:'年', ganZhi:yearGz},
        {label:'月', ganZhi:monthGz},
        {label:'日', ganZhi:dayGz}
      ];
      const signal = buildFiveElementSignal(pillars);
      const yi = safeCall(lunar, 'getDayYi', []);
      const ji = safeCall(lunar, 'getDayJi', []);
      const dayNumber = String(now.getDate()).padStart(2, '0');
      const monthNumber = String(now.getMonth() + 1).padStart(2, '0');

      root.innerHTML = `
        <div class="almanac-head">
          <div>
            <p class="eyebrow">DAILY ALMANAC · 今日黄历</p>
            <div class="almanac-date-line">
              <span class="almanac-date-num">${dayNumber}</span>
              <div><b>${monthNumber}月 · ${esc(solarText)}</b><span>农历 ${esc(formatLunarDate(lunar))}</span></div>
            </div>
          </div>
          <span class="almanac-badge">娱乐信号</span>
        </div>

        <div class="almanac-pillars">
          ${pillars.map(({label, ganZhi}) => {
            const elements = pillarElements(ganZhi).join('·') || '—';
            return `<div><span>${label}柱</span><b>${esc(ganZhi || '—')}</b><small>${esc(elements)}</small></div>`;
          }).join('')}
        </div>

        <div class="almanac-yi-ji">
          <div class="almanac-list almanac-yi"><b>宜</b><div>${renderTags(yi, 'yi-tag')}</div></div>
          <div class="almanac-list almanac-ji"><b>忌</b><div>${renderTags(ji, 'ji-tag')}</div></div>
        </div>

        <div class="almanac-signal">
          <div class="signal-top"><span>五行娱乐暗示</span><b>${esc(signal.action)}</b></div>
          <div class="element-meter" aria-label="年月日五行权重">
            ${ELEMENT_ORDER.map(element => `<span title="${element} ${signal.scores[element].toFixed(2)}" style="--weight:${Math.max(.12, signal.scores[element] / 3)}"><i>${element}</i></span>`).join('')}
          </div>
          <p>${esc(signal.reason)} 此映射为本站自定义玄学玩法，不代表市场判断。</p>
        </div>

        <div class="almanac-disclaimer">仅供娱乐，不构成投资建议</div>
      `;
    } catch (err) {
      root.innerHTML = `
        <div class="almanac-error">
          <p class="eyebrow">DAILY ALMANAC · 今日黄历</p>
          <b>黄历暂时无法加载</b>
          <span>刷新页面后重试。该区域仅供娱乐，不构成投资建议。</span>
        </div>`;
      console.warn('Daily almanac render failed', err);
    }
  }

  async function init() {
    const root = $('dailyAlmanac');
    if (!root) return;
    const ready = await ensureEngine();
    if (!ready) {
      root.innerHTML = `
        <div class="almanac-error">
          <p class="eyebrow">DAILY ALMANAC · 今日黄历</p>
          <b>黄历引擎暂时无法加载</b>
          <span>请检查网络后刷新。仅供娱乐，不构成投资建议。</span>
        </div>`;
      return;
    }
    renderAlmanac();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
