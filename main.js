/* LDV UNIO – main.js */
'use strict';

/* ── Email obfuscation ── */
document.querySelectorAll('[data-u][data-d]').forEach(function(el){
  var addr = el.dataset.u + '\u0040' + el.dataset.d;
  if(el.tagName === 'A'){ el.href = 'mailto:' + addr; }
  el.textContent = addr;
});

/* ── Smooth-scroll nav ── */
function navTo(id){
  var wrap = document.getElementById('page-wrap');
  var target = document.getElementById(id);
  if(!wrap || !target) return;
  wrap.scrollTo({ top: target.offsetTop - 64, behavior: 'smooth' });
  /* close burger on mobile */
  document.getElementById('nav-list').classList.remove('open');
  document.getElementById('burger').setAttribute('aria-expanded','false');
}

/* ── Burger ── */
var burger = document.getElementById('burger');
var navList = document.getElementById('nav-list');
if(burger && navList){
  burger.addEventListener('click', function(){
    var open = navList.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

/* ── Keyboard: Enter on nav links ── */
document.querySelectorAll('[onclick]').forEach(function(el){
  el.addEventListener('keydown', function(e){
    if(e.key === 'Enter') el.click();
  });
});

/* ── FAQ accordion ── */
document.querySelectorAll('.faq-item').forEach(function(item){
  var q = item.querySelector('.faq-q');
  if(!q) return;
  q.addEventListener('click', function(){
    var isOpen = item.classList.contains('open');
    /* close all */
    document.querySelectorAll('.faq-item.open').forEach(function(o){ o.classList.remove('open'); });
    if(!isOpen) item.classList.add('open');
  });
  q.addEventListener('keydown', function(e){
    if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); q.click(); }
  });
});

/* ── Active nav highlight on scroll ── */
(function(){
  var wrap = document.getElementById('page-wrap');
  var sections = Array.from(document.querySelectorAll('section[id], div[id="nuorodos"]'));
  var links = Array.from(document.querySelectorAll('#nav-list a[data-section]'));
  if(!wrap) return;
  wrap.addEventListener('scroll', function(){
    var scrollY = wrap.scrollTop + 80;
    var current = '';
    sections.forEach(function(sec){
      if(sec.offsetTop <= scrollY) current = sec.id;
    });
    links.forEach(function(a){
      a.classList.toggle('active', a.dataset.section === current);
    });
  });
})();

/* ── Insurance calculator ── */
(function(){
  var form = document.getElementById('calc-form');
  var result = document.getElementById('calc-result');
  if(!form || !result) return;

  function parseNum(str){
    return parseFloat(String(str).replace(/\s/g,'').replace(',','.')) || 0;
  }

  function ageFactor(age){
    if(age < 25) return 1.5;
    if(age > 65) return 1.2;
    return 1.0;
  }

  function fmt(n){ return Math.round(n).toLocaleString('lt-LT') + ' €'; }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var val  = parseNum(document.getElementById('calc-val').value);
    var age  = parseInt(document.getElementById('calc-age').value, 10) || 35;
    var type = document.getElementById('calc-type').value;

    if(val <= 0){
      result.innerHTML = '<p class="cr-warn">Įveskite teisingą transporto priemonės vertę.</p>';
      return;
    }

    var rateMin, rateMax, label;
    if(type === 'tpvca'){
      rateMin = 0.008; rateMax = 0.015; label = 'TPVCA (privalomasis)';
    } else if(type === 'kasko-full'){
      rateMin = 0.025; rateMax = 0.045; label = 'KASKO (pilnas)';
    } else {
      rateMin = 0.015; rateMax = 0.025; label = 'KASKO (dalinis)';
    }

    var af = ageFactor(age);
    var low  = val * rateMin * af;
    var high = val * rateMax * af;
    var afLabel = af === 1.5 ? 'Jaunas vairuotojas (×1,5)' : af === 1.2 ? 'Vyresnio amžiaus (×1,2)' : 'Standartinis (×1,0)';

    result.innerHTML =
      '<table class="cr-table">' +
        '<tr><th>TP vertė</th><td>' + fmt(val) + '</td></tr>' +
        '<tr><th>Draudimo rūšis</th><td>' + label + '</td></tr>' +
        '<tr><th>Amžiaus koef.</th><td>' + afLabel + '</td></tr>' +
        '<tr class="cr-total"><th>Orientacinė metinė kaina</th><td>' + fmt(low) + ' – ' + fmt(high) + '</td></tr>' +
      '</table>' +
      '<p class="cr-note">* Ši skaičiuoklė pateikia orientacinę kainą. Tikslų draudimo įmoką gaukite susisiekę su mūsų konsultantu.</p>';
  });

  form.addEventListener('reset', function(){ result.innerHTML = ''; });
})();
