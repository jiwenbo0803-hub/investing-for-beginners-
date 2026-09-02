(() => {
  const TOTAL = 78;
  const configs = {
    stocks: {
      label: '美股', key: 'us-equity-learning-progress-v1', href: './stocks.html', tone: 'stock',
      realms: [
        [0,'凡人','尚未踏入美股修行'],
        [1,'炼气','市场与交易规则入门'],
        [7,'筑基','交易机制基础已立'],
        [19,'金丹','盘面与三张表形成基础框架'],
        [31,'元婴','现金流与财报分析开始成体系'],
        [43,'化神','宏观与估值框架贯通'],
        [55,'炼虚','增长质量与股东价值分析成型'],
        [61,'合体','进入高级会计与企业价值分析'],
        [67,'大乘','财务取证与风险红旗框架建立'],
        [73,'渡劫','SEC 披露与公司治理已过关'],
        [78,'飞升','13 模块全部完成']
      ]
    },
    crypto: {
      label: '加密货币', key: 'crypto-learning-progress-v1', href: './crypto.html', tone: 'crypto',
      realms: [
        [0,'凡人','尚未踏入链上修行'],
        [1,'炼气','BTC / ETH / 区块链入门'],
        [7,'筑基','加密基础框架已立'],
        [13,'金丹','钱包、私钥与资产安全过关'],
        [19,'元婴','现货交易与交易所机制成型'],
        [31,'化神','杠杆与稳定币风险框架建立'],
        [49,'炼虚','DeFi、收益与 Tokenomics 贯通'],
        [61,'合体','链上基础设施与 MEV 机制成型'],
        [67,'大乘','诈骗与合约攻击风险框架建立'],
        [73,'渡劫','市场周期已过关，进入治理终局'],
        [78,'飞升','13 模块全部完成']
      ]
    },
    options: {
      label: '期权', key: 'options-learning-progress-v1', href: './options.html', tone: 'options',
      realms: [
        [0,'凡人','尚未踏入期权修行'],
        [1,'炼气','合约基础入门'],
        [7,'筑基','Call / Put 与价值构成过关'],
        [13,'金丹','期权链、流动性与成交机制成型'],
        [25,'元婴','Greeks 与 IV 风险语言贯通'],
        [37,'化神','单腿与垂直价差收益结构成型'],
        [43,'炼虚','中性与波动率策略入门'],
        [55,'合体','行权、到期与滚仓管理成体系'],
        [67,'大乘','事件波动与组合对冲框架建立'],
        [73,'渡劫','定价模型与无套利边界过关'],
        [78,'飞升','13 模块全部完成']
      ]
    }
  };

  function countDone(key) {
    try {
      const data = JSON.parse(localStorage.getItem(key) || '{}');
      return Math.min(TOTAL, Object.values(data).filter(Boolean).length);
    } catch { return 0; }
  }

  function realmInfo(type, done = countDone(configs[type].key)) {
    const list = configs[type].realms;
    let index = 0;
    for (let i = 0; i < list.length; i++) if (done >= list[i][0]) index = i;
    const current = list[index];
    const next = list[index + 1] || null;
    const stageStart = current[0];
    const stageEnd = next ? next[0] : TOTAL;
    const stageSpan = Math.max(1, stageEnd - stageStart);
    const stagePct = next ? Math.max(0, Math.min(100, Math.round((done - stageStart) / stageSpan * 100))) : 100;
    return {
      done, name: current[1], desc: current[2], next,
      stagePct,
      nextText: next ? `距 ${next[1]} 还差 ${Math.max(0, next[0] - done)} 节` : '道法圆满 · 已完成全部修炼'
    };
  }

  function injectStyles() {
    if (document.getElementById('cultivationRealmStyles')) return;
    const style = document.createElement('style');
    style.id = 'cultivationRealmStyles';
    style.textContent = `
      .cultivation-overview{padding:0 0 34px}.cultivation-head{display:flex;align-items:end;justify-content:space-between;gap:28px;margin-bottom:16px}.cultivation-head h2{font-size:clamp(25px,3vw,36px)}.cultivation-head>p{max-width:560px;margin:0;color:var(--muted);font-size:12px;line-height:1.7}.cultivation-panel{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border:1px solid var(--line);background:var(--surface);border-radius:20px;box-shadow:var(--shadow);overflow:hidden}.cultivation-item{min-width:0;padding:20px 22px}.cultivation-item+.cultivation-item{border-left:1px solid var(--line)}.cultivation-card-top{display:flex;justify-content:space-between;align-items:center;gap:12px}.cultivation-market{font-size:11px;font-weight:800;letter-spacing:.12em;color:var(--muted)}.cultivation-count{font-size:11px;color:var(--muted)}.cultivation-realm{margin:13px 0 4px;font-family:Georgia,'Noto Serif SC',serif;font-size:30px;letter-spacing:-.04em}.cultivation-desc{min-height:38px;margin:0;color:var(--muted);font-size:12px;line-height:1.6}.cultivation-track{height:6px;margin-top:15px;border-radius:999px;background:var(--line);overflow:hidden}.cultivation-track span{display:block;height:100%;border-radius:inherit;transition:width .3s ease}.cultivation-item.stock .cultivation-track span{background:#1d5f4a}.cultivation-item.crypto .cultivation-track span{background:#9a5c18}.cultivation-item.options .cultivation-track span{background:#6a4bb8}.cultivation-next{display:flex;justify-content:space-between;gap:8px;margin-top:8px;color:var(--muted);font-size:10px}.realm-strip{margin-top:16px;padding-top:16px;border-top:1px solid var(--line)}.realm-strip-top{display:flex;align-items:baseline;justify-content:space-between;gap:12px}.realm-strip-label{font-size:10px;letter-spacing:.14em;color:var(--muted);font-weight:800}.realm-strip-name{font-family:Georgia,'Noto Serif SC',serif;font-size:26px}.realm-strip-desc{margin:5px 0 0;color:var(--muted);font-size:11px;line-height:1.55}.realm-stage-track{height:5px;margin-top:11px;background:var(--line);border-radius:999px;overflow:hidden}.realm-stage-track span{display:block;height:100%;background:var(--accent);border-radius:inherit;transition:width .3s ease}.realm-stage-next{margin:7px 0 0;color:var(--muted);font-size:10px;text-align:right}@media(max-width:820px){.cultivation-overview{padding-bottom:28px}.cultivation-head{display:block}.cultivation-head>p{margin-top:10px}.cultivation-panel{grid-template-columns:1fr}.cultivation-item{padding:18px}.cultivation-item+.cultivation-item{border-left:0;border-top:1px solid var(--line)}.cultivation-desc{min-height:0}.cultivation-realm{font-size:27px}}
    `;
    document.head.appendChild(style);
  }

  function renderHome() {
    const hero = document.querySelector('.portal-hero');
    const tracks = document.querySelector('.track-grid');
    if (!hero || !tracks) return;

    let section = document.getElementById('cultivationOverview');
    if (!section) {
      section = document.createElement('section');
      section.id = 'cultivationOverview';
      section.className = 'cultivation-overview section-shell';
      tracks.parentNode.insertBefore(section, tracks);
    }

    section.innerHTML = `
      <div class="cultivation-head">
        <div><p class="eyebrow">CULTIVATION REALM · 修炼境界</p><h2>三道修炼 · 当前境界</h2></div>
        <p>这里只显示三条修炼路线的实时境界与修为，不作为学习入口。下方三个板块才是进入知识地图与学习内容的唯一入口。</p>
      </div>
      <div class="cultivation-panel" aria-label="三道修炼当前境界总览">
        ${Object.entries(configs).map(([type,cfg]) => {
          const r = realmInfo(type);
          return `<div class="cultivation-item ${cfg.tone}">
            <div class="cultivation-card-top"><span class="cultivation-market">${cfg.label}</span><span class="cultivation-count">修为 ${r.done}/${TOTAL}</span></div>
            <div class="cultivation-realm">${r.name}</div>
            <p class="cultivation-desc">${r.desc}</p>
            <div class="cultivation-track"><span style="width:${r.stagePct}%"></span></div>
            <div class="cultivation-next"><span>本境界 ${r.stagePct}%</span><span>${r.nextText}</span></div>
          </div>`;
        }).join('')}
      </div>`;

    const ids = { stocks:'stockPortalProgress', crypto:'cryptoPortalProgress', options:'optionsPortalProgress' };
    Object.entries(ids).forEach(([type,id]) => {
      const el = document.getElementById(id);
      if (!el) return;
      const r = realmInfo(type);
      el.textContent = `${r.name} · ${r.done}/${TOTAL}`;
    });
  }

  function pageType() {
    const p = location.pathname.toLowerCase();
    if (p.includes('stocks')) return 'stocks';
    if (p.includes('crypto')) return 'crypto';
    if (p.includes('options')) return 'options';
    return null;
  }

  function renderSubpage(type) {
    const panel = document.querySelector('.hero-panel');
    if (!panel) return;
    const r = realmInfo(type);
    let strip = document.getElementById('realmStrip');
    if (!strip) {
      strip = document.createElement('div');
      strip.id = 'realmStrip';
      strip.className = 'realm-strip';
      const progressWrap = panel.querySelector('.progress-wrap');
      if (progressWrap) progressWrap.insertAdjacentElement('afterend', strip);
      else panel.appendChild(strip);
    }
    strip.innerHTML = `
      <div class="realm-strip-top"><span class="realm-strip-label">CURRENT REALM · 当前境界</span><strong class="realm-strip-name">${r.name}</strong></div>
      <p class="realm-strip-desc">${r.desc}</p>
      <div class="realm-stage-track"><span style="width:${r.stagePct}%"></span></div>
      <p class="realm-stage-next">修为 ${r.done}/${TOTAL} · ${r.nextText}</p>`;
  }

  function init() {
    injectStyles();
    if (document.body.classList.contains('portal-page')) {
      renderHome();
      window.addEventListener('storage', renderHome);
      window.addEventListener('pageshow', renderHome);
      return;
    }
    const type = pageType();
    if (!type) return;
    renderSubpage(type);
    const progressText = document.getElementById('progressText');
    if (progressText) new MutationObserver(() => renderSubpage(type)).observe(progressText, {childList:true,characterData:true,subtree:true});
    window.addEventListener('storage', () => renderSubpage(type));
    window.addEventListener('pageshow', () => renderSubpage(type));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();