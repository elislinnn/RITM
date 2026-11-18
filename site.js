(function(){
  var cfg = window.RITM_CONFIG || {};
  document.querySelectorAll('[data-pilot]').forEach(function(a){
    if (cfg.pilotFormUrl) { a.href = cfg.pilotFormUrl; a.target = '_blank'; a.rel = 'noopener'; }
    else { a.style.display = 'none'; }
  });
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var supView = window.CSS && CSS.supports && CSS.supports('animation-timeline: view()');
  var supScope = window.CSS && CSS.supports && CSS.supports('timeline-scope: --a');
  if (!supView && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('io');
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if (e.isIntersecting) { e.target.style.animationPlayState = 'running'; io.unobserve(e.target); } });
    }, { threshold: 0.2 });
    document.querySelectorAll('.rv,.cnt,.typ,.ans,.draw,.lockp').forEach(function(el){ io.observe(el); });
  }
  if (!supScope) {
    var steps = document.querySelectorAll('.how .st');
    var sc = [null, document.querySelector('.sc2'), document.querySelector('.sc3')];
    if (steps.length === 3 && sc[1]) {
      var tick = function(){
        var h = window.innerHeight;
        for (var i = 1; i < 3; i++) {
          var top = steps[i].getBoundingClientRect().top;
          sc[i].classList.toggle('show', top < h * 0.6);
        }
      };
      window.addEventListener('scroll', function(){ requestAnimationFrame(tick); }, { passive: true });
      tick();
    }
  }
  // ---------- landing: hero counter, backer ticker, honest-goal calculator ----------
  if (!document.getElementById('calc')) return;
  var S = { p: 0, bi: 0, price: 214000, clients: 180, check: 1800, ip: false };
  var names = ['Катя', 'Ольга', 'Дарья', 'Ирина', 'Вика'], amts = [5600, 12000, 5600, 1400, 5600];
  function f(n){ return Math.round(n).toLocaleString('ru-RU'); }
  function vals(){
    var taxRate = S.ip ? 0.06 : 0.04, comm = 0.05;
    var rew = Math.round(S.price * 0.21 / 100) * 100;
    var goal = Math.ceil((S.price + rew) / (1 - taxRate - comm) / 1000) * 1000;
    var tax = Math.round(goal * taxRate), fee = Math.round(goal * comm);
    var real = S.clients * 0.3 * S.check * 2.7;
    var lo = Math.round(real * 0.8 / 1000) * 1000, hi = Math.round(real * 1.2 / 1000) * 1000;
    var chance = Math.max(5, Math.min(95, Math.round(100 / (1 + Math.exp(-7 * (real / goal - 0.78))))));
    var z = { zoneStyle: 'border-color:#9FDDC2', zoneText: 'good', hintStyle: 'background:#DDF5EA', hint: 'Хороший шанс. Метроном подготовит текст, награды и список клиентов, кому написать в первый день.' };
    if (chance < 70) z = { zoneStyle: 'border-color:#FFD79A', zoneText: 'warn', hintStyle: 'background:#FFF1D6', hint: 'Средний риск. Разбейте покупку на 2 этапа или добавьте аудиторию: Telegram-канал, QR в точке.' };
    if (chance < 45) z = { zoneStyle: 'border-color:#F3B0B3', zoneText: 'bad', hintStyle: 'background:#FDE4E5', hint: 'Цель велика для вашей аудитории. Начните с этапа на ' + f(lo) + ' ₽ — успешный сбор снизит комиссию следующего.' };
    return {
      amount: f(201600 * S.p), pct: Math.round(72 * S.p), pctw: (72 * S.p).toFixed(1) + '%', backers: Math.round(41 * S.p),
      bName: names[S.bi], bAmt: f(amts[S.bi]),
      priceF: f(S.price), clients: S.clients, checkF: f(S.check), goalF: f(goal), rewF: f(rew), taxF: f(tax), feeF: f(fee), taxPct: S.ip ? 6 : 4,
      loF: f(lo), hiF: f(hi), chance: chance, needle: (-90 + chance * 1.8).toFixed(1),
      fPrice: S.price, fRew: rew, fTax: tax, fFee: fee,
      zoneStyle: z.zoneStyle, zoneText: z.zoneText, hintStyle: z.hintStyle, hint: z.hint,
      selfCls: S.ip ? 'btn sm' : 'btn sm bd', ipCls: S.ip ? 'btn sm bd' : 'btn sm'
    };
  }
  var kEls = document.querySelectorAll('[data-k]');
  var tpl = { style: document.querySelectorAll('[data-tpl-style]'), 'class': document.querySelectorAll('[data-tpl-class]'), 'aria-label': document.querySelectorAll('[data-tpl-aria-label]') };
  function fill(t, v){ return t.replace(/\{(\w+)\}/g, function(m, k){ return v[k] != null ? v[k] : ''; }); }
  function render(){
    var v = vals();
    kEls.forEach(function(e){ var x = v[e.getAttribute('data-k')]; if (x != null && e.textContent !== String(x)) e.textContent = x; });
    tpl.style.forEach(function(e){ e.style.cssText = fill(e.getAttribute('data-tpl-style'), v); });
    tpl['class'].forEach(function(e){ e.className = fill(e.getAttribute('data-tpl-class'), v); });
    tpl['aria-label'].forEach(function(e){ e.setAttribute('aria-label', fill(e.getAttribute('data-tpl-aria-label'), v)); });
  }
  document.querySelectorAll('[data-in]').forEach(function(inp){
    var k = inp.getAttribute('data-in');
    inp.value = S[k];
    inp.addEventListener('input', function(){ S[k] = Number(inp.value); render(); });
  });
  document.querySelectorAll('[data-click]').forEach(function(b){
    b.addEventListener('click', function(){ S.ip = b.getAttribute('data-click') === 'setIp'; render(); });
  });
  render();
  if (reduce) { S.p = 1; render(); return; }
  var t0 = performance.now() + 1100;
  function step(now){
    var t = Math.min(1, Math.max(0, (now - t0) / 1200));
    S.p = 1 - Math.pow(1 - t, 3); render();
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
  setInterval(function(){
    S.bi = (S.bi + 1) % names.length; render();
    document.querySelectorAll('.swap').forEach(function(el){ el.classList.remove('swap'); void el.offsetWidth; el.classList.add('swap'); });
  }, 6000);
})();
