(() => {
  const $ = (id) => document.getElementById(id);
  const state = { gender: 'male', calendar: 'solar', location: null, locations: [] };
  const FALLBACK_LOCATIONS = [
    ['北京市 北京市',116.4074,39.9042],['天津市 天津市',117.1901,39.1256],['上海市 上海市',121.4737,31.2304],['重庆市 重庆市',106.5516,29.5630],
    ['河北省 石家庄市',114.5149,38.0428],['山西省 太原市',112.5489,37.8706],['辽宁省 沈阳市',123.4315,41.8057],['辽宁省 大连市',121.6147,38.9140],
    ['吉林省 长春市',125.3235,43.8171],['黑龙江省 哈尔滨市',126.5349,45.8038],['江苏省 南京市',118.7969,32.0603],['江苏省 苏州市',120.5853,31.2989],
    ['浙江省 杭州市',120.1551,30.2741],['浙江省 宁波市',121.5503,29.8746],['安徽省 合肥市',117.2272,31.8206],['福建省 福州市',119.2965,26.0745],
    ['福建省 厦门市',118.0894,24.4798],['江西省 南昌市',115.8582,28.6829],['山东省 济南市',117.1205,36.6512],['山东省 青岛市',120.3826,36.0671],
    ['河南省 郑州市',113.6254,34.7466],['湖北省 武汉市',114.3054,30.5931],['湖南省 长沙市',112.9388,28.2282],['广东省 广州市',113.2644,23.1291],
    ['广东省 深圳市',114.0579,22.5431],['广西壮族自治区 南宁市',108.3669,22.8170],['海南省 海口市',110.1983,20.0440],['四川省 成都市',104.0665,30.5723],
    ['贵州省 贵阳市',106.6302,26.6470],['云南省 昆明市',102.8329,24.8801],['陕西省 西安市',108.9398,34.3416],['甘肃省 兰州市',103.8343,36.0611],
    ['青海省 西宁市',101.7782,36.6171],['宁夏回族自治区 银川市',106.2309,38.4872],['新疆维吾尔自治区 乌鲁木齐市',87.6168,43.8256],['内蒙古自治区 呼和浩特市',111.7492,40.8426]
  ].map(([fullName, longitude, latitude]) => ({fullName, longitude, latitude}));

  function initTheme() {
    const root = document.documentElement;
    const saved = localStorage.getItem('learning-lab-theme') || localStorage.getItem('us-equity-learning-theme');
    if (saved) root.dataset.theme = saved;
    $('themeToggle').addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      localStorage.setItem('learning-lab-theme', next);
      localStorage.setItem('us-equity-learning-theme', next);
    });
  }

  function fillLunarSelects() {
    $('lunarMonth').innerHTML = Array.from({length:12}, (_,i) => `<option value="${i+1}">${i+1}月</option>`).join('');
    $('lunarDay').innerHTML = Array.from({length:30}, (_,i) => `<option value="${i+1}">${i+1}日</option>`).join('');
  }

  function setSegment(type, value) {
    document.querySelectorAll(`[data-${type}]`).forEach(btn => btn.classList.toggle('active', btn.dataset[type] === value));
    state[type] = value;
    if (type === 'calendar') {
      $('solarFields').hidden = value !== 'solar';
      $('lunarFields').hidden = value !== 'lunar';
    }
  }

  function extractArrayLiteral(text) {
    const marker = 'export const CHINA_REGIONS';
    const markerIndex = text.indexOf(marker);
    if (markerIndex < 0) throw new Error('城市数据格式不匹配');
    const start = text.indexOf('[', markerIndex);
    if (start < 0) throw new Error('城市数据起点不存在');
    let depth = 0, quote = '', escaped = false;
    for (let i = start; i < text.length; i++) {
      const ch = text[i];
      if (quote) {
        if (escaped) escaped = false;
        else if (ch === '\\') escaped = true;
        else if (ch === quote) quote = '';
        continue;
      }
      if (ch === "'" || ch === '"' || ch === '`') { quote = ch; continue; }
      if (ch === '[') depth++;
      if (ch === ']') {
        depth--;
        if (depth === 0) return text.slice(start, i + 1);
      }
    }
    throw new Error('城市数据结束位置不存在');
  }

  function flattenRegions(regions) {
    const out = [];
    for (const p of regions || []) {
      if (Number.isFinite(p.longitude)) out.push({fullName:p.name, longitude:p.longitude, latitude:p.latitude});
      for (const c of p.cities || []) {
        out.push({fullName:`${p.name} ${c.name}`, longitude:c.longitude, latitude:c.latitude});
        for (const d of c.districts || []) out.push({fullName:`${p.name} ${c.name} ${d.name}`, longitude:d.longitude, latitude:d.latitude});
      }
    }
    return out;
  }

  async function loadLocations() {
    const urls = [
      'https://cdn.jsdelivr.net/gh/jiwenbo0803-hub/life-kline@main/data/chinaCities.ts',
      'https://raw.githubusercontent.com/jiwenbo0803-hub/life-kline/main/data/chinaCities.ts'
    ];
    let lastError = null;
    for (const url of urls) {
      try {
        const res = await fetch(url, {cache:'force-cache'});
        if (!res.ok) throw new Error(String(res.status));
        const text = await res.text();
        const literal = extractArrayLiteral(text);
        const regions = Function(`"use strict";return (${literal});`)();
        const locations = flattenRegions(regions);
        if (locations.length < 50) throw new Error('城市数据数量异常');
        state.locations = locations;
        $('locationStatus').textContent = `城市坐标库已加载 · ${state.locations.length} 个地点 · 可输入城市、区县或详细地址`;
        return;
      } catch (err) {
        lastError = err;
      }
    }
    console.warn('完整城市库加载失败，使用常用城市列表', lastError);
    state.locations = FALLBACK_LOCATIONS;
    $('locationStatus').textContent = '完整城市库加载失败 · 当前支持常用城市；直接输入城市名即可';
  }

  function normalizeLocationText(text='') {
    return String(text)
      .toLowerCase()
      .replace(/[\s,，。.;；、·•()（）\-_/\\]+/g, '');
  }

  function shortAdminName(name='') {
    return normalizeLocationText(name)
      .replace(/特别行政区$/, '')
      .replace(/维吾尔自治区$/, '')
      .replace(/壮族自治区$/, '')
      .replace(/回族自治区$/, '')
      .replace(/自治区$/, '')
      .replace(/自治州$/, '')
      .replace(/地区$/, '')
      .replace(/省$/, '')
      .replace(/市$/, '')
      .replace(/区$/, '')
      .replace(/县$/, '')
      .replace(/旗$/, '')
      .replace(/盟$/, '');
  }

  function rankLocationMatches(query) {
    const q = normalizeLocationText(query);
    if (!q) return [];

    return state.locations.map(item => {
      const parts = item.fullName.split(/\s+/).filter(Boolean);
      const compact = normalizeLocationText(item.fullName);
      const shortParts = parts.map(shortAdminName).filter(Boolean);
      const shortCompact = shortParts.join('');
      let score = -1;

      if (q === compact || (shortCompact && q === shortCompact)) score = Math.max(score, 1200);
      if (q.includes(compact) && compact.length >= 2) score = Math.max(score, 1000 + compact.length);
      if (shortCompact && q.includes(shortCompact) && shortCompact.length >= 2) score = Math.max(score, 960 + shortCompact.length);
      if (compact.includes(q) && q.length >= 2) score = Math.max(score, 760 - Math.max(0, compact.length - q.length));

      let matchedParts = 0;
      let matchedLast = false;
      parts.forEach((part, index) => {
        const full = normalizeLocationText(part);
        const short = shortAdminName(part);
        const aliases = [...new Set([full, short].filter(x => x && x.length >= 2))];
        const isLast = index === parts.length - 1;

        for (const alias of aliases) {
          if (q === alias) {
            score = Math.max(score, isLast ? 920 : 780);
            matchedParts++;
            if (isLast) matchedLast = true;
            break;
          }
          if (q.includes(alias)) {
            matchedParts++;
            if (isLast) matchedLast = true;
            break;
          }
        }
      });

      if (matchedParts) {
        score = Math.max(score, 420 + matchedParts * 150 + (matchedLast ? 90 : 0));
      }

      return {item, score, depth: parts.length};
    })
      .filter(x => x.score >= 0)
      .sort((a,b) => b.score - a.score || b.depth - a.depth || a.item.fullName.localeCompare(b.item.fullName, 'zh-CN'));
  }

  function selectLocation(item) {
    if (!item) return;
    state.location = item;
    $('birthPlace').value = item.fullName;
    $('locationStatus').textContent = `已选择：${item.fullName} · 东经 ${item.longitude.toFixed(4)}°`;
    $('locationResults').hidden = true;
  }

  function tryResolveLocationInput() {
    const query = $('birthPlace').value.trim();
    if (!query) return {status:'empty'};
    const ranked = rankLocationMatches(query);
    if (!ranked.length) return {status:'none'};

    const top = ranked[0];
    const second = ranked[1];
    const topLeaf = shortAdminName(top.item.fullName.split(/\s+/).filter(Boolean).at(-1));
    const secondLeaf = second ? shortAdminName(second.item.fullName.split(/\s+/).filter(Boolean).at(-1)) : '';
    if (second && second.score === top.score && topLeaf && topLeaf === secondLeaf && top.item.fullName !== second.item.fullName) {
      return {status:'ambiguous'};
    }

    selectLocation(top.item);
    return {status:'selected', item:top.item};
  }

  function renderLocationResults(query) {
    const box = $('locationResults');
    if (!query.trim()) { box.hidden = true; return; }
    const matches = rankLocationMatches(query).slice(0,8);
    if (!matches.length) {
      box.innerHTML = `<div class="location-option"><b>未找到地点</b><span>可输入城市名，例如“武汉”；也可输入省市区或详细地址</span></div>`;
      box.hidden = false;
      return;
    }
    box.innerHTML = matches.map((x,i) => `<button type="button" class="location-option" data-location-index="${i}"><b>${x.item.fullName}</b><span>东经 ${x.item.longitude.toFixed(4)}° · 北纬 ${x.item.latitude.toFixed(4)}°</span></button>`).join('');
    box.hidden = false;
    box.querySelectorAll('[data-location-index]').forEach(btn => btn.addEventListener('click', () => {
      selectLocation(matches[Number(btn.dataset.locationIndex)]?.item);
    }));
  }

  function dayOfYear(y,m,d) {
    const start = Date.UTC(y,0,0); const current = Date.UTC(y,m-1,d);
    return Math.floor((current-start)/86400000);
  }

  function equationOfTimeMinutes(y,m,d) {
    const n = dayOfYear(y,m,d);
    const b = 2 * Math.PI * (n - 81) / 364;
    return 9.87 * Math.sin(2*b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
  }

  const DST_RANGES = {
    1986:['1986-05-04T02:00','1986-09-14T02:00'],
    1987:['1987-04-12T02:00','1987-09-13T02:00'],
    1988:['1988-04-17T02:00','1988-09-11T02:00'],
    1989:['1989-04-16T02:00','1989-09-17T02:00'],
    1990:['1990-04-15T02:00','1990-09-16T02:00'],
    1991:['1991-04-14T02:00','1991-09-15T02:00']
  };

  function isMainlandLocation(name='') { return !/香港|澳门|澳門|台湾|臺灣/.test(name); }
  function isChinaDST(y,m,d,h,min, locationName) {
    if (!isMainlandLocation(locationName)) return false;
    const range = DST_RANGES[y]; if (!range) return false;
    const t = new Date(y,m-1,d,h,min,0).getTime();
    const [sy,sm,sd,sh,smin] = range[0].split(/[-T:]/).map(Number);
    const [ey,em,ed,eh,emin] = range[1].split(/[-T:]/).map(Number);
    return t >= new Date(sy,sm-1,sd,sh,smin).getTime() && t < new Date(ey,em-1,ed,eh,emin).getTime();
  }

  function addMinutes(parts, minutes) {
    const dt = new Date(parts.y, parts.m-1, parts.d, parts.h, parts.min, 0);
    dt.setMinutes(dt.getMinutes() + Math.round(minutes));
    return {y:dt.getFullYear(), m:dt.getMonth()+1, d:dt.getDate(), h:dt.getHours(), min:dt.getMinutes()};
  }

  function to2(n){ return String(n).padStart(2,'0'); }
  function fmtDelta(n){ const r=Math.round(n); return `${r>=0?'+':''}${r} 分钟`; }

  function getInputSolarDate() {
    const [hh,mm] = $('birthTime').value.split(':').map(Number);
    if (state.calendar === 'solar') {
      if (!$('solarDate').value) throw new Error('请选择公历出生日期');
      const [y,m,d] = $('solarDate').value.split('-').map(Number);
      return {y,m,d,h:hh,min:mm, sourceLabel:`公历 ${y}-${to2(m)}-${to2(d)}`};
    }
    const y=Number($('lunarYear').value), m=Number($('lunarMonth').value), d=Number($('lunarDay').value);
    if (!y || !m || !d) throw new Error('请填写完整农历日期');
    if (typeof Lunar === 'undefined') throw new Error('排盘引擎尚未加载，请稍后重试');
    let lunarMonth = m;
    if ($('lunarLeap').checked) {
      if (typeof LunarYear !== 'undefined') {
        const leap = LunarYear.fromYear(y).getLeapMonth();
        if (leap !== m) throw new Error(`${y} 年的闰月不是 ${m} 月，请核对农历日期`);
      }
      lunarMonth = -m;
    }
    const lunar = Lunar.fromYmd(y, lunarMonth, d);
    const solar = lunar.getSolar();
    return {y:solar.getYear(),m:solar.getMonth(),d:solar.getDay(),h:hh,min:mm,sourceLabel:`农历 ${y}年${$('lunarLeap').checked?'闰':''}${m}月${d}日`};
  }

  function calculateTrueSolar(base) {
    if (!state.location) throw new Error('请先填写出生地');
    const useTrue = $('trueSolarToggle').checked;
    const useDST = $('dstToggle').checked;
    const dst = useDST && isChinaDST(base.y,base.m,base.d,base.h,base.min,state.location.fullName) ? 60 : 0;
    const longitude = 4 * (state.location.longitude - 120);
    const eot = equationOfTimeMinutes(base.y,base.m,base.d);
    const correction = useTrue ? longitude + eot - dst : -dst;
    return {parts:addMinutes(base, correction), correction, longitude, eot, dst};
  }

  function updateLeapHint() {
    const y = Number($('lunarYear').value);
    if (!y || typeof LunarYear === 'undefined') { $('leapHint').textContent='填写年份后自动提示该年闰月'; return; }
    try {
      const leap = LunarYear.fromYear(y).getLeapMonth();
      $('leapHint').textContent = leap ? `${y} 年闰 ${leap} 月` : `${y} 年无闰月`;
    } catch { $('leapHint').textContent='无法读取该年闰月'; }
  }

  function renderResult(base, adjusted, solar, lunar, eightChar, yun) {
    const pillars = [
      ['年柱',eightChar.getYear(), eightChar.getYearNaYin?.() || ''],
      ['月柱',eightChar.getMonth(), eightChar.getMonthNaYin?.() || ''],
      ['日柱',eightChar.getDay(), eightChar.getDayNaYin?.() || ''],
      ['时柱',eightChar.getTime(), eightChar.getTimeNaYin?.() || '']
    ];
    $('resultEmpty').hidden = true; $('resultContent').hidden = false;
    $('birthSummary').innerHTML = `${base.sourceLabel} · 钟表时间 ${to2(base.h)}:${to2(base.min)} · ${state.location.fullName}<br>换算公历 ${base.y}-${to2(base.m)}-${to2(base.d)} · 校正后 ${adjusted.parts.y}-${to2(adjusted.parts.m)}-${to2(adjusted.parts.d)} ${to2(adjusted.parts.h)}:${to2(adjusted.parts.min)} · 总校正 ${fmtDelta(adjusted.correction)}`;
    $('pillars').innerHTML = pillars.map(([label,gz,sub]) => `<div class="pillar"><span class="pillar-label">${label}</span><b class="pillar-gz">${gz}</b><span class="pillar-sub">${sub || '—'}</span></div>`).join('');
    const dayMaster = eightChar.getDayGan?.() || eightChar.getDay().charAt(0);
    const startText = `${yun.getStartYear()}年${yun.getStartMonth()}个月${yun.getStartDay()}天`;
    $('resultMeta').innerHTML = [
      ['日主',dayMaster],['起运',startText],['时间校正',`经度 ${fmtDelta(adjusted.longitude)} · 均时差 ${fmtDelta(adjusted.eot)}${adjusted.dst?` · 夏令时 -60 分钟`:''}`]
    ].map(([k,v]) => `<div class="meta-item"><span>${k}</span><b>${v}</b></div>`).join('');

    const dir = yun.isForward() ? '顺行' : '逆行';
    $('yunDirection').textContent = `${dir} · 起运约 ${yun.getStartYear()} 岁`;
    const dayuns = yun.getDaYun().filter(x => x.getGanZhi && x.getGanZhi()).slice(0,10);
    $('yunGrid').innerHTML = dayuns.map(x => `<div class="yun-card"><span class="yun-age">${x.getStartAge()} 岁起</span><b class="yun-gz">${x.getGanZhi()}</b><span class="yun-year">${x.getStartYear()} 年</span></div>`).join('');
    $('liunianContent').innerHTML = dayuns.slice(0,6).map(x => {
      const years = (x.getLiuNian?.() || []).slice(0,10);
      return `<div class="liunian-group"><h4>${x.getGanZhi()}大运 · ${x.getStartAge()}岁起</h4><div class="liunian-grid">${years.map(y=>`<div class="liunian-item"><b>${y.getGanZhi()}</b><span>${y.getYear()} · ${y.getAge()}岁</span></div>`).join('')}</div></div>`;
    }).join('');
    $('resultShell').scrollIntoView({behavior:'smooth',block:'start'});
  }

  async function onSubmit(e) {
    e.preventDefault();
    const error = $('formError'); error.hidden = true;
    try {
      if (typeof Solar === 'undefined' || typeof Lunar === 'undefined') throw new Error('排盘引擎尚未加载，请检查网络后重试');
      if (!$('birthTime').value) throw new Error('请选择出生时间');
      if (!state.location) {
        const resolved = tryResolveLocationInput();
        if (resolved.status === 'empty') throw new Error('请输入出生地；只输入城市名即可，例如“武汉”');
        if (resolved.status === 'ambiguous') throw new Error('存在多个同名地点，请从下拉搜索结果中选择具体城市或区县');
        if (resolved.status === 'none') throw new Error('没有识别到该地点，请尝试只输入城市名，或补充省 / 市 / 区县信息');
      }
      const btn = $('calculateBtn'); btn.disabled = true; btn.textContent = '正在排盘…';
      const base = getInputSolarDate();
      const adjusted = calculateTrueSolar(base);
      const p = adjusted.parts;
      const solar = Solar.fromYmdHms(p.y,p.m,p.d,p.h,p.min,0);
      const lunar = solar.getLunar();
      const eightChar = lunar.getEightChar();
      const yun = eightChar.getYun(state.gender === 'male' ? 1 : 0);
      renderResult(base, adjusted, solar, lunar, eightChar, yun);
      btn.disabled = false; btn.textContent = '重新计算';
    } catch (err) {
      $('calculateBtn').disabled = false; $('calculateBtn').textContent = '开始排盘';
      error.textContent = err.message || '排盘失败，请核对输入信息'; error.hidden = false;
    }
  }

  function init() {
    initTheme(); fillLunarSelects(); loadLocations();
    document.querySelectorAll('[data-gender]').forEach(btn => btn.addEventListener('click',()=>setSegment('gender',btn.dataset.gender)));
    document.querySelectorAll('[data-calendar]').forEach(btn => btn.addEventListener('click',()=>setSegment('calendar',btn.dataset.calendar)));
    $('birthPlace').addEventListener('input', e => { state.location=null; renderLocationResults(e.target.value); });
    $('birthPlace').addEventListener('focus', e => renderLocationResults(e.target.value));
    document.addEventListener('click', e => { if (!e.target.closest('.location-group')) $('locationResults').hidden=true; });
    $('lunarYear').addEventListener('input', updateLeapHint);
    $('lunarMonth').addEventListener('change', updateLeapHint);
    $('baziForm').addEventListener('submit', onSubmit);
    $('resetBtn').addEventListener('click', () => { $('resultContent').hidden=true; $('resultEmpty').hidden=false; window.scrollTo({top:0,behavior:'smooth'}); });
    setTimeout(updateLeapHint, 300);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
