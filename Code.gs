<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Tokyo Trip">
<meta name="theme-color" content="#f3f4f7" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#11151f" media="(prefers-color-scheme: dark)">
<title>Tokyo–Kamakura Trip</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css">
<style>
/* Layout: one-screen phone app — header (days) / scrolling view / bottom tab bar. Map view fills the middle. */
:root{
  --bg:#f3f4f7; --surface:#ffffff; --sunk:#e9ebf1; --ink:#161b2a; --muted:#5d6579; --line:#d9dce5;
  --accent:#2c4aa0; --accent-ink:#ffffff; --accent-soft:#e3e8f7;
  --c-food:#d2541b; --c-shop:#8a3cb0; --c-sight:#c3272b; --c-station:#1f6fbf; --c-other:#5b6478;
  --ok:#2f8a4f; --warn:#b7791f; --bad:#c3272b;
  --f-body:"IBM Plex Sans Thai","Hiragino Sans","Noto Sans JP",system-ui,sans-serif;
  --f-jp:"Hiragino Sans","Noto Sans JP","Yu Gothic",system-ui,sans-serif;
  --f-num:"IBM Plex Mono",ui-monospace,Menlo,monospace;
  --r:12px;
  color-scheme:light;
}
@media (prefers-color-scheme: dark){ :root:not([data-theme="light"]){
  --bg:#11151f; --surface:#1a2030; --sunk:#232a3c; --ink:#e9ecf4; --muted:#9aa3b8; --line:#2d3549;
  --accent:#8fa8f0; --accent-ink:#10162a; --accent-soft:#25304d;
  --c-food:#f08a52; --c-shop:#c58ae6; --c-sight:#f06a6a; --c-station:#69aef0; --c-other:#9aa3b8;
  --ok:#5cc184; --warn:#e2b04f; --bad:#f06a6a; color-scheme:dark; } }
:root[data-theme="dark"]{
  --bg:#11151f; --surface:#1a2030; --sunk:#232a3c; --ink:#e9ecf4; --muted:#9aa3b8; --line:#2d3549;
  --accent:#8fa8f0; --accent-ink:#10162a; --accent-soft:#25304d;
  --c-food:#f08a52; --c-shop:#c58ae6; --c-sight:#f06a6a; --c-station:#69aef0; --c-other:#9aa3b8;
  --ok:#5cc184; --warn:#e2b04f; --bad:#f06a6a; color-scheme:dark; }

*{box-sizing:border-box}
html,body{height:100%;margin:0}
body{background:var(--bg);color:var(--ink);font:15px/1.5 var(--f-body);display:flex;flex-direction:column;overflow:hidden;-webkit-tap-highlight-color:transparent}
[hidden]{display:none!important}
button,input,select,textarea{font:inherit;color:inherit}
button{cursor:pointer}
a{color:var(--accent)}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.jp{font-family:var(--f-jp);color:var(--muted);font-size:12px}
.num{font-family:var(--f-num);font-variant-numeric:tabular-nums}

/* Header */
header{background:var(--surface);border-bottom:1px solid var(--line);padding-top:env(safe-area-inset-top,0px);padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));flex:none;z-index:5}
.top{display:flex;align-items:center;gap:8px;padding-block:10px 6px}
.brand{font-weight:700;letter-spacing:.02em;font-size:15px;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.brand small{font-weight:500;color:var(--muted);font-size:12px;margin-left:6px}
.pill{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--line);background:var(--bg);border-radius:999px;padding:4px 10px;font-size:12px;white-space:nowrap}
.dot{width:8px;height:8px;border-radius:50%;background:var(--muted);flex:none}
.dot.on{background:var(--ok)} .dot.warn{background:var(--warn)} .dot.bad{background:var(--bad)}
.days{display:flex;gap:6px;overflow-x:auto;padding-block:4px 10px;scrollbar-width:none}
.days::-webkit-scrollbar{display:none}
.daybtn{flex:none;border:1px solid var(--line);background:var(--surface);border-radius:10px;padding:6px 12px;text-align:left;line-height:1.25}
.daybtn b{display:block;font-size:13px}
.daybtn span{font-size:11px;color:var(--muted)}
.daybtn[aria-pressed="true"]{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
.daybtn[aria-pressed="true"] span{color:inherit;opacity:.85}
.daybtn .today{display:inline-block;margin-left:4px;font-size:10px;padding:0 5px;border-radius:4px;background:var(--ok);color:#fff}

/* Main */
main{flex:1;min-height:0;position:relative}
.view{position:absolute;inset:0;overflow-y:auto;-webkit-overflow-scrolling:touch}
.pad{padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:14px 24px;display:flex;flex-direction:column;gap:14px;max-width:720px;margin:0 auto}
h2{font-size:18px;margin:0;text-wrap:balance;line-height:1.3}
h3{font-size:14px;margin:0;letter-spacing:.02em}
.sub{color:var(--muted);font-size:13px;margin:0}
.card{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:14px}
.label{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);font-weight:600}

/* Bottom nav */
nav.tabs{flex:none;display:grid;grid-template-columns:repeat(5,1fr);background:var(--surface);border-top:1px solid var(--line);padding-bottom:env(safe-area-inset-bottom,0px);padding-left:env(safe-area-inset-left,0px);padding-right:env(safe-area-inset-right,0px);z-index:5}
.tab{border:0;background:none;padding:8px 2px 7px;display:flex;flex-direction:column;align-items:center;gap:2px;font-size:11px;color:var(--muted)}
.tab svg{width:22px;height:22px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.tab[aria-selected="true"]{color:var(--accent);font-weight:600}

/* Map */
#map{position:absolute;inset:0;background:var(--sunk)}
.map-tools{position:absolute;z-index:500;top:10px;left:max(10px,env(safe-area-inset-left,0px));right:max(10px,env(safe-area-inset-right,0px));display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;pointer-events:none}
.map-tools>*{pointer-events:auto}
.chip{flex:none;border:1px solid var(--line);background:var(--surface);border-radius:999px;padding:5px 11px;font-size:12px;display:inline-flex;align-items:center;gap:6px;box-shadow:0 1px 3px rgba(0,0,0,.08)}
.chip[aria-pressed="false"]{opacity:.5}
.chip i{font-style:normal;font-family:var(--f-jp);font-size:11px;width:18px;height:18px;border-radius:50%;display:inline-grid;place-items:center;color:#fff}
.map-zones{position:absolute;z-index:500;bottom:12px;left:max(10px,env(safe-area-inset-left,0px));display:flex;gap:6px;flex-wrap:wrap;max-width:70%}
.fab{position:absolute;z-index:500;right:max(12px,env(safe-area-inset-right,0px));bottom:12px;width:46px;height:46px;border-radius:50%;border:1px solid var(--line);background:var(--surface);display:grid;place-items:center;box-shadow:0 2px 8px rgba(0,0,0,.15)}
.fab svg{width:22px;height:22px;stroke:var(--accent);fill:none;stroke-width:2}
.map-off{position:absolute;inset:0;display:grid;place-items:center;color:var(--muted);padding:24px;text-align:center}
.pin{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;color:#fff;font:600 12px/1 var(--f-jp);border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)}
.pin-f{background:var(--c-food)} .pin-s{background:var(--c-shop)} .pin-h{background:var(--c-sight)} .pin-t{background:var(--c-station)} .pin-o{background:var(--c-other)}
.bg-f{background:var(--c-food)} .bg-s{background:var(--c-shop)} .bg-h{background:var(--c-sight)} .bg-t{background:var(--c-station)} .bg-o{background:var(--c-other)}
.pin-stop{width:28px;height:28px;border-radius:8px;display:grid;place-items:center;background:var(--ink);color:var(--bg);font:600 13px/1 var(--f-num);border:2px solid var(--bg);box-shadow:0 1px 5px rgba(0,0,0,.4)}
.pin-stop.active{background:var(--accent);color:var(--accent-ink)}
.me{width:18px;height:18px;border-radius:50%;background:#2f7cf6;border:3px solid #fff;box-shadow:0 0 0 6px rgba(47,124,246,.25)}
.leaflet-popup-content-wrapper,.leaflet-popup-tip{background:var(--surface);color:var(--ink)}
.leaflet-popup-content{margin:12px 14px;font:13px/1.45 var(--f-body);min-width:200px}
.leaflet-container a.leaflet-popup-close-button{color:var(--muted)}
.leaflet-control-attribution{font-size:9px}
/* โหมดมืด: กลับสีภาพแผนที่ (เฉพาะพื้นแผนที่ หมุดไม่เปลี่ยน) */
@media (prefers-color-scheme: dark){ :root:not([data-theme="light"]) .leaflet-tile-pane{filter:invert(1) hue-rotate(180deg) brightness(.85) contrast(.9) saturate(.6)} }
:root[data-theme="dark"] .leaflet-tile-pane{filter:invert(1) hue-rotate(180deg) brightness(.85) contrast(.9) saturate(.6)}
.pop h4{margin:0 0 2px;font-size:14px}
.pop p{margin:6px 0}
.links{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;border:1px solid var(--line);background:var(--surface);border-radius:9px;padding:7px 12px;font-size:13px;text-decoration:none;color:var(--ink);font-weight:500}
.btn.pri{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
.btn.sm{padding:4px 9px;font-size:12px;border-radius:7px}
.btn.ghost{background:transparent}
.btn.danger{color:var(--bad);border-color:color-mix(in srgb,var(--bad) 40%,var(--line))}
.btn:disabled{opacity:.5}

/* Plan */
.dayhead{display:flex;flex-direction:column;gap:6px}
.facts{display:flex;gap:8px;flex-wrap:wrap}
.fact{background:var(--sunk);border-radius:8px;padding:6px 10px;font-size:12px}
.fact b{display:block;font-size:14px}
.next{display:flex;gap:12px;align-items:center;background:var(--accent-soft);border:1px solid color-mix(in srgb,var(--accent) 30%,transparent);border-radius:var(--r);padding:12px 14px}
.next .big{font:600 20px/1 var(--f-num);color:var(--accent)}
.timeline{list-style:none;margin:0;padding:0;display:flex;flex-direction:column}
.stop{display:grid;grid-template-columns:48px 20px 1fr;gap:0 10px}
.stop .t{font:600 13px/1.4 var(--f-num);color:var(--muted);padding-top:2px;text-align:right}
.rail{position:relative;display:flex;justify-content:center}
.rail::before{content:"";position:absolute;top:0;bottom:0;width:2px;background:var(--line)}
.stop:first-child .rail::before{top:10px}
.stop:last-child .rail::before{bottom:calc(100% - 10px)}
.rail span{position:relative;margin-top:4px;width:12px;height:12px;border-radius:50%;background:var(--surface);border:2px solid var(--muted)}
.stop.move .rail span{border-style:dashed;border-radius:3px}
.stop.done .rail span{background:var(--muted)}
.stop.active .rail span{background:var(--accent);border-color:var(--accent);box-shadow:0 0 0 4px var(--accent-soft)}
.stop .body{padding-bottom:18px;min-width:0}
.stop .body h4{margin:0;font-size:15px;line-height:1.35}
.stop.active .body h4{color:var(--accent)}
.stop .body p{margin:4px 0 0;font-size:13px;color:var(--muted)}
.stop .meta{font-size:12px;color:var(--muted);margin-top:4px}
.tips{margin:0;padding-left:18px;display:flex;flex-direction:column;gap:6px;font-size:13px}

/* Nearby */
.ctrl{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
select,input[type=text],input[type=number],input[type=url],input[type=date],input[type=password]{border:1px solid var(--line);background:var(--surface);border-radius:9px;padding:8px 10px;min-width:0;width:100%}
.seg{display:inline-flex;border:1px solid var(--line);border-radius:9px;overflow:hidden;background:var(--surface);flex:none}
.seg button{border:0;background:none;padding:7px 12px;font-size:13px}
.seg button[aria-pressed="true"]{background:var(--accent);color:var(--accent-ink);font-weight:600}
.cats{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding-bottom:2px}
.cats::-webkit-scrollbar{display:none}
.cats .chip{box-shadow:none}
.cats .chip[aria-pressed="true"]{border-color:var(--ink);opacity:1}
.cats .chip[aria-pressed="false"]{opacity:.75}
.count{font-family:var(--f-num);font-size:11px;color:var(--muted)}
.plist{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;background:var(--surface);border:1px solid var(--line);border-radius:var(--r);overflow:hidden}
.pitem{display:grid;grid-template-columns:30px 1fr auto;gap:10px;padding:12px;border-top:1px solid var(--line);align-items:start}
.pitem:first-child{border-top:0}
.pitem .ic{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;color:#fff;font:600 13px/1 var(--f-jp)}
.pitem h4{margin:0;font-size:14px;line-height:1.35}
.pitem p{margin:3px 0 0;font-size:12px;color:var(--muted)}
.pitem .d{text-align:right;font-size:12px;color:var(--muted);white-space:nowrap}
.pitem .d b{display:block;font:600 14px/1.2 var(--f-num);color:var(--ink)}
.pitem .links{margin-top:6px}
.tag{display:inline-flex;align-items:center;font-size:11px;font-weight:600;padding:2px 8px;border-radius:999px;background:var(--sunk);color:var(--muted);vertical-align:middle;white-space:nowrap}
.tag.on{background:var(--accent-soft);color:var(--accent)}
.btn.add{border-style:dashed;color:var(--accent);border-color:color-mix(in srgb,var(--accent) 45%,var(--line))}
.planbar{display:flex;justify-content:space-between;align-items:center;gap:10px}
.tin{width:auto;border:1px solid var(--line);background:var(--surface);border-radius:7px;padding:2px 4px;font:600 12px/1.4 var(--f-num)}
.stop .t:has(.tin){padding-top:0}
.stop{grid-template-columns:auto 20px 1fr}
.stop .t{min-width:44px}
.stop.added .rail span{border-color:var(--accent)}
.alts{display:flex;flex-direction:column;gap:10px}
.plist.flat{border:0;border-radius:0;background:transparent;margin-inline:-14px;margin-bottom:-14px;border-top:1px solid var(--line)}
.pin-alt{width:34px;height:20px;border-radius:10px;display:grid;place-items:center;background:var(--surface);color:var(--accent);font:600 10px/1 var(--f-body);border:2px dashed var(--accent);box-shadow:0 1px 4px rgba(0,0,0,.3)}
.empty{padding:18px;text-align:center;color:var(--muted);font-size:13px}
.banner{display:flex;gap:10px;align-items:center;justify-content:space-between;background:var(--sunk);border-radius:var(--r);padding:10px 12px;font-size:13px}

/* Expenses */
.sum{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.sum .k{font-size:12px;color:var(--muted)}
.sum .v{font:600 22px/1.2 var(--f-num)}
.sum .v small{font-size:13px;color:var(--muted);font-weight:500}
.bar{height:8px;background:var(--sunk);border-radius:4px;overflow:hidden}
.bar i{display:block;height:100%;background:var(--accent);border-radius:4px}
.bar i.over{background:var(--bad)}
.brk{display:flex;flex-direction:column;gap:8px}
.brk .row{display:grid;grid-template-columns:88px 1fr 92px;gap:8px;align-items:center;font-size:13px}
.brk .row .num{text-align:right;font-size:12px}
form.exp{display:flex;flex-direction:column;gap:10px}
.amt{display:grid;grid-template-columns:1fr auto;gap:8px}
.amt input{font:600 22px/1.2 var(--f-num);padding:10px 12px}
.choice{display:flex;gap:6px;flex-wrap:wrap}
.choice button{border:1px solid var(--line);background:var(--surface);border-radius:8px;padding:6px 10px;font-size:13px}
.choice button[aria-pressed="true"]{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.elist{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;background:var(--surface);border:1px solid var(--line);border-radius:var(--r);overflow:hidden}
.eday{padding:8px 12px;background:var(--sunk);font-size:12px;display:flex;justify-content:space-between;color:var(--muted);font-weight:600}
.eitem{display:grid;grid-template-columns:1fr auto;gap:8px;padding:10px 12px;border-top:1px solid var(--line);align-items:center}
.eitem h4{margin:0;font-size:14px;font-weight:500}
.eitem p{margin:2px 0 0;font-size:12px;color:var(--muted)}
.eitem .a{text-align:right}
.eitem .a b{font:600 15px/1.2 var(--f-num);display:block}
.eitem .a span{font-size:11px;color:var(--muted)}
.sync{display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:5px;vertical-align:middle}
.sync.y{background:var(--ok)} .sync.n{background:var(--warn)}
.confirm{display:flex;gap:6px;margin-top:6px}

/* Settings */
.field{display:flex;flex-direction:column;gap:5px}
.field label{font-size:13px;font-weight:600}
.field .hint{font-size:12px;color:var(--muted)}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.switch{display:flex;align-items:center;justify-content:space-between;gap:12px}
.switch input{width:44px;height:26px;accent-color:var(--accent)}
ol.steps{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:6px;font-size:13px}
pre.code{margin:0;max-height:240px;overflow:auto;background:var(--sunk);border-radius:9px;padding:10px;font:11px/1.5 var(--f-num);white-space:pre}
.msg{font-size:12px;color:var(--muted);min-height:1em}
.toast{position:fixed;left:50%;bottom:calc(76px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);background:var(--ink);color:var(--bg);padding:9px 16px;border-radius:999px;font-size:13px;z-index:1000;max-width:calc(100% - 32px);text-align:center}
@media (prefers-reduced-motion: no-preference){ .toast{animation:up .2s ease-out} @keyframes up{from{transform:translate(-50%,8px);opacity:0}} }
</style>
</head>
<body>
<header>
  <div class="top">
    <div class="brand">Tokyo Trip<small>5 วัน</small></div>
    <button class="pill" id="gpsPill" type="button"><span class="dot" id="gpsDot"></span><span id="gpsTxt">GPS ปิด</span></button>
    <button class="pill" id="syncPill" type="button"><span class="dot" id="syncDot"></span><span id="syncTxt">Sheet</span></button>
  </div>
  <div class="days" id="days" role="tablist" aria-label="เลือกวัน"></div>
</header>

<main>
  <section class="view" id="v-map" style="overflow:hidden">
    <div id="map"></div>
    <div class="map-tools" id="mapCats"></div>
    <div class="map-zones" id="mapZones"></div>
    <button class="fab" id="locate" type="button" aria-label="ไปที่ตำแหน่งฉัน"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg></button>
  </section>

  <section class="view" id="v-plan" hidden><div class="pad" id="planPad"></div></section>
  <section class="view" id="v-near" hidden><div class="pad" id="nearPad"></div></section>
  <section class="view" id="v-exp" hidden><div class="pad" id="expPad"></div></section>
  <section class="view" id="v-set" hidden><div class="pad" id="setPad"></div></section>
</main>

<nav class="tabs" role="tablist">
  <button class="tab" data-tab="map" aria-selected="true"><svg viewBox="0 0 24 24"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/></svg>แผนที่</button>
  <button class="tab" data-tab="plan" aria-selected="false"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="17" rx="2"/><path d="M8 2v4M16 2v4M8 11h8M8 15h5"/></svg>แผนวัน</button>
  <button class="tab" data-tab="near" aria-selected="false"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>รอบตัว</button>
  <button class="tab" data-tab="exp" aria-selected="false"><svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h4"/></svg>รายจ่าย</button>
  <button class="tab" data-tab="set" aria-selected="false"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>ตั้งค่า</button>
</nav>

<script type="text/plain" id="gsCode">/**
 * Trip Dashboard – Google Sheet sync
 * วิธีใช้: Google Sheet > ส่วนขยาย > Apps Script > วางโค้ดนี้ > บันทึก
 *        > ทำให้ใช้งานได้ > การทำให้ใช้งานได้รายการใหม่ > เว็บแอป
 *          ดำเนินการในฐานะ: ฉัน | ผู้มีสิทธิ์เข้าถึง: ทุกคน
 * แล้วนำ URL ที่ลงท้ายด้วย /exec ไปวางในหน้า "ตั้งค่า" ของแอป
 */

// รหัสลับ (ต้องตรงกับช่อง "รหัสลับ" ในแอป) ปล่อยว่างได้ถ้าไม่ต้องการ
const SECRET = '';

const EXP = 'Expenses';
const LOC = 'Locations';
const EXP_HEAD = ['id', 'วันที่-เวลา', 'วันที่ทริป', 'จำนวนเงิน', 'สกุลเงิน', 'เทียบบาท', 'หมวด', 'ชำระด้วย', 'รายละเอียด', 'lat', 'lng', 'อัปเดตล่าสุด'];
const LOC_HEAD = ['เวลา', 'วันที่ทริป', 'lat', 'lng', 'ความแม่นยำ (ม.)', 'แผนที่'];

function sheet_(name, head) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(head);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, head.length).setFontWeight('bold').setBackground('#e8ecf6');
  }
  return sh;
}

function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function ids_(sh) {
  const n = sh.getLastRow() - 1;
  return n > 0 ? sh.getRange(2, 1, n, 1).getValues().map(function (r) { return String(r[0]); }) : [];
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (SECRET && d.key !== SECRET) return out_({ ok: false, error: 'รหัสลับไม่ถูกต้อง' });

    if (d.action === 'upsert') {
      const sh = sheet_(EXP, EXP_HEAD);
      const ids = ids_(sh);
      d.items.forEach(function (x) {
        const row = [x.id, new Date(x.ts), x.day, x.amount, x.cur, x.thb, x.cat, x.pay, x.note, x.lat || '', x.lng || '', new Date()];
        const i = ids.indexOf(String(x.id));
        if (i >= 0) sh.getRange(i + 2, 1, 1, row.length).setValues([row]);
        else { sh.appendRow(row); ids.push(String(x.id)); }
      });
      return out_({ ok: true, n: d.items.length });
    }

    if (d.action === 'delete') {
      const sh = sheet_(EXP, EXP_HEAD);
      const ids = ids_(sh);
      for (let i = ids.length - 1; i >= 0; i--) {
        if (d.ids.indexOf(ids[i]) >= 0) sh.deleteRow(i + 2);
      }
      return out_({ ok: true });
    }

    if (d.action === 'loc') {
      const sh = sheet_(LOC, LOC_HEAD);
      const rows = d.items.map(function (p) {
        return [new Date(p.ts), p.day, p.lat, p.lng, Math.round(p.acc || 0), 'https://maps.google.com/?q=' + p.lat + ',' + p.lng];
      });
      if (rows.length) sh.getRange(sh.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
      return out_({ ok: true, n: rows.length });
    }

    return out_({ ok: false, error: 'unknown action' });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  if (SECRET && (!e.parameter || e.parameter.key !== SECRET)) return out_({ ok: false, error: 'รหัสลับไม่ถูกต้อง' });
  const sh = sheet_(EXP, EXP_HEAD);
  const n = sh.getLastRow() - 1;
  const vals = n > 0 ? sh.getRange(2, 1, n, EXP_HEAD.length).getValues() : [];
  const items = vals.map(function (r) {
    return {
      id: String(r[0]), ts: new Date(r[1]).getTime(), day: r[2], amount: Number(r[3]), cur: r[4],
      thb: Number(r[5]), cat: r[6], pay: r[7], note: r[8], lat: r[9], lng: r[10]
    };
  });
  return out_({ ok: true, items: items });
}</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
<script>
/* ============ DATA ============ */
const CAT = {
  f:{label:'ร้านอาหาร', glyph:'食', g:'restaurants'},
  s:{label:'ช็อปปิ้ง', glyph:'買', g:'shopping'},
  h:{label:'ไฮไลท์/เที่ยว', glyph:'見', g:'tourist attractions'},
  t:{label:'สถานี/รถบัส', glyph:'駅', g:'train station'},
  o:{label:'อื่นๆ', glyph:'他', g:'convenience store'}
};
const CAT_KEYS = ['f','s','h','t','o'];
const ZONES = { nrt:'นาริตะ', tyo:'โตเกียว', kmk:'คามากุระ' };

// [cat, area, name, japanese name (ใช้ค้นใน Google Maps), lat, lng, note]
const RAW = [
// --- Narita Airport
['t','nrt_ap','สถานี Narita Airport (อาคาร 1)','成田空港駅',35.7643,140.3863,'Access Express ไปอาซากุซะตรง ~65 นาที ใช้ Suica ได้ ไม่ต้องจอง'],
['t','nrt_ap','สถานี Airport Terminal 2·3','空港第2ビル駅',35.7731,140.3870,'ถ้าเครื่องลงอาคาร 2 หรือ 3 ขึ้นรถไฟที่นี่'],
['o','nrt_ap','เคาน์เตอร์ Keisei (ตั๋ว / Welcome Suica)','京成 成田空港駅 チケットカウンター',35.7645,140.3860,'ซื้อบัตร IC สำหรับนักท่องเที่ยวได้ที่สนามบิน'],
['o','nrt_ap','JR EAST Travel Service Center','JR東日本 成田空港 びゅうプラザ',35.7644,140.3866,'แลก JR Pass / ซื้อตั๋ว N\'EX'],
['h','nrt_ap','จุดชมวิวเครื่องบิน อาคาร 1','成田空港 第1ターミナル 展望デッキ',35.7653,140.3858,'ถ้าเหลือเวลาวันกลับ'],
['h','nrt_ap','จุดชมวิวเครื่องบิน อาคาร 2','成田空港 第2ターミナル 展望デッキ',35.7735,140.3877,''],
// --- Harajuku / Omotesando
['h','harajuku','ถนนทาเคชิตะ','竹下通り',35.6714,139.7047,'แฟชั่นวัยรุ่น เครป ของน่ารัก คนแน่นช่วงบ่าย'],
['h','harajuku','ศาลเจ้าเมจิ','明治神宮',35.6764,139.6993,'ทางเข้าห่างสถานีฮาราจูกุ ~300 ม. เดินในป่าอีก ~800 ม. (เกินแผน 2 กม.)'],
['h','harajuku','ถนนโอโมเตะซันโด','表参道',35.6670,139.7085,'ถนนแบรนด์เนม ต้นไม้ร่มรื่น'],
['h','harajuku','แคทสตรีท','キャットストリート',35.6650,139.7060,'ทางเดินเชื่อมฮาราจูกุ → ชิบูย่า ร้านแบรนด์สตรีท'],
['s','harajuku','Omotesando Hills','表参道ヒルズ',35.6673,139.7090,''],
['s','harajuku','Tokyu Plaza Omokado (ดาดฟ้า)','東急プラザ表参道オモカド',35.6687,139.7055,'ดาดฟ้าขึ้นฟรี + ทางเข้ากระจกเงาถ่ายรูป'],
['s','harajuku','KIDDY LAND Harajuku','キデイランド原宿店',35.6684,139.7071,'ของเล่นและคาแรกเตอร์หลายชั้น'],
['s','harajuku','DAISO Harajuku','ダイソー原宿店',35.6712,139.7043,'ร้าน 100 เยนบนถนนทาเคชิตะ'],
['f','harajuku','Marion Crêpes','マリオンクレープ 原宿竹下通り店',35.6712,139.7051,'เครปต้นตำรับทาเคชิตะ'],
['f','harajuku','AFURI Harajuku','AFURI 原宿',35.6720,139.7076,'ราเมงซุปยูซุ'],
['f','harajuku','Harajuku Gyoza-ro','原宿餃子楼',35.6680,139.7095,'เกี๊ยวซ่าราคาประหยัด คิวเดินเร็ว'],
['t','harajuku','สถานี Omotesando (สาย Ginza)','表参道駅',35.6653,139.7123,'จากอาซากุซะสาย Ginza ตรง ~30 นาที'],
['t','harajuku','สถานี JR Harajuku','原宿駅',35.6702,139.7027,''],
['t','harajuku','สถานี Meiji-jingumae','明治神宮前駅',35.6686,139.7053,''],
// --- Shibuya
['h','shibuya','SHIBUYA SKY','渋谷スカイ',35.6584,139.7022,'จุดชมวิวดาดฟ้าชั้น 47 จองรอบออนไลน์ล่วงหน้า'],
['h','shibuya','ทางม้าลาย Shibuya Scramble','渋谷スクランブル交差点',35.6595,139.7005,''],
['h','shibuya','รูปปั้นฮาจิโกะ','ハチ公像',35.6591,139.7006,''],
['h','shibuya','Shibuya Center Gai','渋谷センター街',35.6603,139.6988,''],
['h','shibuya','MIYASHITA PARK','ミヤシタパーク',35.6620,139.7020,'สวนบนดาดฟ้า + ห้าง'],
['s','shibuya','Shibuya PARCO (Nintendo / Pokémon Center)','渋谷パルコ',35.6621,139.6986,'ชั้น 6: Nintendo TOKYO, Pokémon Center, Capcom'],
['s','shibuya','MEGA Don Quijote Shibuya','MEGAドン・キホーテ渋谷本店',35.6608,139.6976,'เปิด 24 ชม. ของฝาก ขนม เครื่องสำอาง Tax-free'],
['s','shibuya','SHIBUYA 109','渋谷109',35.6595,139.6988,''],
['s','shibuya','Loft Shibuya','渋谷ロフト',35.6619,139.6988,'เครื่องเขียน ของใช้'],
['s','shibuya','Tokyu Food Show','東急フードショー 渋谷',35.6587,139.7012,'ขนมของฝาก เบนโตะ ใต้สถานี'],
['s','shibuya','Shibuya Hikarie ShinQs','渋谷ヒカリエ ShinQs',35.6591,139.7036,''],
['s','shibuya','Matsumoto Kiyoshi Center Gai','マツモトキヨシ 渋谷センター街',35.6603,139.6995,'ร้านยา/เครื่องสำอาง Tax-free'],
['f','shibuya','Ichiran Shibuya','一蘭 渋谷店',35.6617,139.7010,'ราเมงทงคตสึ เปิด 24 ชม.'],
['f','shibuya','Uobei Shibuya Dogenzaka','魚べい 渋谷道玄坂店',35.6587,139.6979,'ซูชิสายพานสั่งทางจอ ราคาประหยัด'],
['f','shibuya','Sushi no Midori (Mark City)','梅丘寿司の美登利 渋谷店',35.6580,139.6990,'ซูชิคุ้มค่า คิวยาวช่วงเย็น'],
['f','shibuya','Shibuya Yokocho','渋谷横丁',35.6626,139.7022,'ซอยร้านอาหารสไตล์อิซากายะ ใต้ Miyashita Park'],
['f','shibuya','Starbucks Shibuya Tsutaya','スターバックス SHIBUYA TSUTAYA',35.6597,139.7006,'มองลงทางม้าลาย'],
['t','shibuya','สถานี Shibuya (JR / สาย Ginza)','渋谷駅',35.6580,139.7016,'สาย Ginza กลับอาซากุซะตรง ~33 นาที'],
['t','shibuya','จุดขึ้นรถ Airport Limousine (Mark City)','渋谷マークシティ バスターミナル',35.6578,139.6983,''],
['o','shibuya','ล็อกเกอร์หยอดเหรียญ สถานี Shibuya','渋谷駅 コインロッカー',35.6585,139.7010,'มีหลายจุดรอบสถานี จ่ายด้วย Suica ได้'],
// --- Asakusa
['h','asakusa','ประตูคามินาริมง','雷門',35.7111,139.7964,'จุดถ่ายรูปหลัก มาตอนเช้าคนน้อย'],
['h','asakusa','วัดเซ็นโซจิ (วิหารหลัก)','浅草寺 本堂',35.7148,139.7967,'วิหารเปิด 6:30–17:00 (ต.ค.–มี.ค.) ลานวัดเข้าได้ตลอด เปิดไฟถึงราว 23:00'],
['h','asakusa','ประตูโฮโซมง','浅草寺 宝蔵門',35.7139,139.7966,''],
['h','asakusa','เจดีย์ห้าชั้น','浅草寺 五重塔',35.7144,139.7958,'สวยตอนเปิดไฟกลางคืน'],
['h','asakusa','ศาลเจ้าอาซากุซะ','浅草神社',35.7152,139.7977,''],
['h','asakusa','Asakusa Culture Tourist Info Center (ชั้น 8)','浅草文化観光センター',35.7107,139.7965,'จุดชมวิวฟรี เห็นคามินาริมงกับสกายทรี มีห้องน้ำ'],
['h','asakusa','สะพานอาซึมะบาชิ / วิวอาคาร Asahi','吾妻橋',35.7105,139.7993,''],
['h','asakusa','สวนสุมิดะ ริมแม่น้ำ','隅田公園',35.7128,139.8018,''],
['h','asakusa','Hanayashiki สวนสนุกเก่าแก่','浅草花やしき',35.7155,139.7947,''],
['h','asakusa','Tokyo Skytree','東京スカイツリー',35.7101,139.8107,'~1.3 กม. จากคามินาริมง ข้ามแม่น้ำเดินได้'],
['s','asakusa','ถนนนากามิเสะ','仲見世通り',35.7128,139.7965,'ของฝาก ขนม ร้านส่วนใหญ่ปิดราว 17:00–18:00'],
['s','asakusa','Denboin-dori','伝法院通り',35.7120,139.7950,'ถนนสไตล์เอโดะ ร้านของเก่า'],
['s','asakusa','Shin-Nakamise (ทางเดินมีหลังคา)','新仲見世通り',35.7123,139.7955,'เดินได้แม้ฝนตก'],
['s','asakusa','Don Quijote Asakusa','ドン・キホーテ浅草店',35.7136,139.7931,'เปิด 24 ชม. ของฝาก Tax-free'],
['s','asakusa','ถนนคัปปะบาชิ (เครื่องครัว)','かっぱ橋道具街',35.7135,139.7882,'มีด เครื่องครัว อาหารจำลอง ส่วนใหญ่ปิดวันอาทิตย์'],
['s','asakusa','Tokyo Solamachi','東京ソラマチ',35.7104,139.8098,'ห้างใต้สกายทรี ของฝาก/ร้านคาแรกเตอร์'],
['s','asakusa','Asakusa EKIMISE','浅草エキミセ',35.7117,139.7982,'ห้างบนสถานี Tobu ดาดฟ้าเห็นสกายทรี'],
['s','asakusa','Tokiwado (ขนมคามินาริ โอโกชิ)','常盤堂 雷おこし本舗',35.7110,139.7960,'ของฝากขึ้นชื่อของอาซากุซะ'],
['s','asakusa','Funawa (โยกังมันหวาน)','舟和 本店',35.7109,139.7968,''],
['f','asakusa','Asakusa Kagetsudo (เมล่อนปัง)','浅草 花月堂 本店',35.7142,139.7953,''],
['f','asakusa','Asakusa Menchi','浅草メンチ',35.7139,139.7955,'เมนจิคัตสึทอดร้อนๆ'],
['f','asakusa','Kibi-dango Azuma','浅草 きびだんご あづま',35.7125,139.7963,'บนนากามิเสะ'],
['f','asakusa','Daikokuya Tempura','大黒家天麩羅',35.7123,139.7946,'เทนดงต้นตำรับ คิวช่วงเที่ยง'],
['f','asakusa','Asakusa Gyukatsu','浅草 牛かつ',35.7121,139.7956,'เนื้อชุบทอด ย่างต่อเองบนหินร้อน'],
['f','asakusa','Sometaro (โอโคโนมิยากิ)','染太郎 浅草',35.7124,139.7922,'ทำเองที่โต๊ะ บ้านไม้เก่า'],
['f','asakusa','Asakusa Imahan (สุกียากิ)','浅草今半 国際通り本店',35.7130,139.7926,''],
['f','asakusa','Hoppy Street (อิซากายะ)','ホッピー通り',35.7133,139.7930,'ร้านนั่งริมถนน เหมาะมื้อเย็นหลังเที่ยววัด'],
['f','asakusa','Kamiya Bar','神谷バー',35.7108,139.7976,'บาร์เก่าแก่ เครื่องดื่ม Denki Bran'],
['f','asakusa','Suzukien (เจลาโต้มัทฉะ)','壽々喜園 浅草本店',35.7171,139.7950,'เลือกความเข้มมัทฉะได้ 7 ระดับ'],
['t','asakusa','สถานี Asakusa (สาย Ginza)','浅草駅 銀座線',35.7110,139.7975,'ไปชิบูย่า / อุเอโนะ / ชิมบาชิ'],
['t','asakusa','สถานี Asakusa (สาย Toei Asakusa)','都営浅草線 浅草駅',35.7097,139.7972,'Access Express ตรงไป/กลับนาริตะ'],
['t','asakusa','สถานี Tobu Asakusa','東武 浅草駅',35.7117,139.7983,'ไปสกายทรี 1 สถานี'],
['t','asakusa','สถานี Asakusa (Tsukuba Express)','つくばエクスプレス 浅草駅',35.7134,139.7920,''],
['t','asakusa','ท่าเรือ Water Bus อาซากุซะ','浅草 水上バス乗り場',35.7101,139.7995,'เรือล่องแม่น้ำสุมิดะ ไปฮามาริคิว/โอไดบะ'],
['o','asakusa','ร้านเช่ากิโมโน (ย่านคามินาริมง)','浅草 着物レンタル',35.7114,139.7952,'จองล่วงหน้า ถ่ายรูปในวัดสวยมาก'],
// --- Shinagawa
['t','shinagawa','สถานี JR Shinagawa','品川駅',35.6285,139.7387,'Yamanote ไปฮาราจูกุ/ชิบูย่า ~15 นาที · Yokosuka line ไปคามากุระตรง ~50 นาที · N\'EX ไปนาริตะ'],
['t','shinagawa','สถานี Keikyu Shinagawa','京急 品川駅',35.6278,139.7381,'Keikyu/สาย Toei Asakusa ไปอาซากุซะตรงบางขบวน ~25 นาที (หรือเปลี่ยนที่ Sengakuji)'],
['t','shinagawa','สถานี Takanawa Gateway','高輪ゲートウェイ駅',35.6355,139.7407,''],
['o','shinagawa','ล็อกเกอร์หยอดเหรียญ สถานี Shinagawa','品川駅 コインロッカー',35.6287,139.7389,'มีทั้งฝั่งทางออก Takanawa และ Konan'],
['s','shinagawa','ecute Shinagawa (ในสถานี)','エキュート品川',35.6287,139.7393,'ขนมของฝาก เบนโตะรถไฟ (เอกิเบ็น)'],
['s','shinagawa','atré Shinagawa','アトレ品川',35.6291,139.7401,'ห้างติดสถานีฝั่ง Konan'],
['s','shinagawa','Wing Takanawa','ウィング高輪',35.6272,139.7376,'ห้างฝั่ง Takanawa ร้านยา/ของใช้'],
['f','shinagawa','Shinatatsu (ซอยราเมง)','品達 品川',35.6266,139.7372,'รวมร้านราเมงดังใต้ทางรถไฟ Keikyu'],
['f','shinagawa','ร้านอาหาร atré Shinagawa ชั้น 4','アトレ品川 レストラン',35.6291,139.7401,'หลายร้าน เปิดถึงดึก'],
['f','shinagawa','Shinagawa Intercity (โซนร้านอาหาร)','品川インターシティ',35.6268,139.7428,'ร้านอาหารสำหรับคนทำงาน ราคาไม่แรง ฝั่ง Konan'],
['h','shinagawa','Maxell Aqua Park Shinagawa','マクセル アクアパーク品川',35.6262,139.7357,'อควาเรียมในโรงแรม Shinagawa Prince เปิดถึงค่ำ'],
['h','shinagawa','วัดเซ็นงาคุจิ (47 โรนิน)','泉岳寺',35.6380,139.7384,'~1 กม. ทางเหนือ'],
// --- Kamakura
['h','kamakura','ศาลเจ้าซึรุงะโอกะ ฮาจิมังงู','鶴岡八幡宮',35.3260,139.5563,'ศาลเจ้าหลักของคามากุระ'],
['h','kamakura','ดังคาซึระ (ทางเดินกลางถนน)','段葛',35.3220,139.5532,''],
['h','kamakura','ศาลเจ้าเซนิอาไร เบ็นเท็น','銭洗弁財天',35.3253,139.5442,'ล้างเงินขอโชค เดินขึ้นเนิน ~1.2 กม.'],
['h','kamakura','วัดโฮโคคุจิ (ป่าไผ่)','報国寺',35.3196,139.5717,'~2 กม. นั่งบัสจากสถานี'],
['s','kamakura','ถนนโคมาจิ','小町通り',35.3203,139.5513,'ของกิน ของฝาก ทางเดินหลักจากสถานี'],
['s','kamakura','Toshimaya (บิสกิตนกพิราบ)','豊島屋 本店',35.3214,139.5528,'ของฝากขึ้นชื่อ Hato Sablé'],
['s','kamakura','Kamakura Beniya (Kurumicco)','鎌倉紅谷 八幡宮前本店',35.3240,139.5545,'ขนมวอลนัทคาราเมล'],
['f','kamakura','bowls donburi cafe','bowls donburi cafe 鎌倉',35.3201,139.5510,'ดงบุริ / ชิราสึ-ดง'],
['f','kamakura','Kamakura Chacha (เจลาโต้มัทฉะ)','鎌倉茶々 本店',35.3206,139.5516,''],
['f','kamakura','Starbucks Kamakura Onarimachi','スターバックス 鎌倉御成町店',35.3194,139.5490,'สาขามีสระน้ำและสวน ทางออกฝั่งตะวันตก'],
['t','kamakura','สถานี JR Kamakura','鎌倉駅',35.3190,139.5503,'JR Yokosuka line จากชิมบาชิ ~55 นาที'],
['t','kamakura','สถานี Enoden Kamakura','江ノ電 鎌倉駅',35.3188,139.5497,'ตั๋ววัน Noriorikun คุ้มถ้าลงหลายสถานี'],
['t','kamakura','ท่ารถบัส Kamakura (ทางออกตะวันออก)','鎌倉駅東口 バス乗り場',35.3195,139.5509,''],
['o','kamakura','ศูนย์ข้อมูลท่องเที่ยว Kamakura','鎌倉市観光総合案内所',35.3192,139.5506,'แผนที่ฟรี ล็อกเกอร์อยู่ใกล้ๆ'],
['h','hase','พระใหญ่คามากุระ (โคโตคุอิน)','鎌倉大仏 高徳院',35.3168,139.5357,'เดินจากสถานีฮาเสะ ~7 นาที'],
['h','hase','วัดฮาเสะเดระ','長谷寺 鎌倉',35.3125,139.5332,'วิวทะเลจากลานวัด ถ้ำเบ็นเท็น'],
['h','hase','หาดยุยกาฮามะ','由比ヶ浜',35.3093,139.5410,''],
['s','hase','ถนนฮาเสะ (ร้านของฝาก)','長谷通り 鎌倉',35.3142,139.5348,''],
['f','hase','Kaikoan (คาเฟ่ในวัดฮาเสะ)','長谷寺 海光庵',35.3127,139.5328,'ทานพร้อมวิวทะเล'],
['t','hase','สถานี Enoden Hase','江ノ電 長谷駅',35.3117,139.5353,''],
['h','enoshima','ทางข้ามรถไฟ คามากุระโคโคมาเอะ','鎌倉高校前踏切',35.3065,139.5004,'วิวทะเล+รถไฟ ถ่ายจากทางเท้า ห้ามยืนบนถนนหรือราง'],
['h','enoshima','เกาะเอโนชิมะ','江の島',35.2995,139.4805,'เดินข้ามสะพาน ~600 ม. จากฝั่ง'],
['h','enoshima','Enoshima Sea Candle (ประภาคาร)','江の島シーキャンドル',35.2994,139.4790,'วิวพระอาทิตย์ตก เห็นฟูจิในวันฟ้าใส'],
['s','enoshima','ถนนนากามิเสะ เอโนชิมะ','江の島 弁財天仲見世通り',35.2998,139.4812,''],
['f','enoshima','Tobicho (ชิราสึดง)','とびっちょ 本店',35.2999,139.4817,'ชิราสึ (ปลาข้าวสาร) ขึ้นชื่อ'],
['t','enoshima','สถานี Enoden Kamakurakokomae','江ノ電 鎌倉高校前駅',35.3068,139.5007,''],
['t','enoshima','สถานี Enoden Enoshima','江ノ電 江ノ島駅',35.3058,139.4880,''],
['t','enoshima','สถานี Katase-Enoshima (Odakyu)','片瀬江ノ島駅',35.3088,139.4836,'กลับทาง Odakyu ไปชินจูกุก็ได้'],
// --- Ueno
['h','ueno','สวนอุเอโนะ','上野恩賜公園',35.7146,139.7732,''],
['h','ueno','ศาลเจ้าโทโชงู อุเอโนะ','上野東照宮',35.7166,139.7710,''],
['h','ueno','บ่อชิโนบาซุ / เบ็นเท็นโด','不忍池弁天堂',35.7122,139.7703,''],
['h','ueno','Tokyo National Museum','東京国立博物館',35.7188,139.7765,'ปิดวันจันทร์ เปิด 9:30'],
['s','ueno','ตลาดอาเมโยโกะ','アメ横商店街',35.7105,139.7745,'ขนม ผลไม้ ของถูก ร้านเปิดราว 10:00'],
['s','ueno','Niki no Kashi (ขนมราคาส่ง)','二木の菓子 第1営業所',35.7092,139.7748,''],
['s','ueno','Yamashiroya (ของเล่น)','ヤマシロヤ 上野',35.7121,139.7748,'ตรงข้ามสถานี 6 ชั้น'],
['s','ueno','Takeya (ดิสเคานต์สโตร์)','多慶屋',35.7071,139.7744,''],
['f','ueno','Minatoya (ข้าวหน้าปลาดิบ)','みなとや 上野',35.7095,139.7744,'ไคเซ็นดงราคาประหยัด'],
['f','ueno','Nikuno Ohyama','肉の大山 上野',35.7079,139.7735,'เมนจิคัตสึ/สเต็ก'],
['f','ueno','Ueno Yabu Soba','上野藪そば',35.7106,139.7743,''],
['t','ueno','สถานี Keisei Ueno','京成上野駅',35.7113,139.7737,'Skyliner ไปสนามบิน ~41 นาที / Limited Express ไป Keisei Narita'],
['t','ueno','สถานี JR Ueno','上野駅',35.7138,139.7770,''],
['t','ueno','สถานี Ueno (สาย Ginza)','上野駅 銀座線',35.7116,139.7765,'จากอาซากุซะ 3 สถานี ~5 นาที'],
['o','ueno','ล็อกเกอร์ สถานี Keisei Ueno','京成上野駅 コインロッカー',35.7112,139.7739,'ฝากกระเป๋าใหญ่ก่อนเดินเที่ยว'],
// --- Narita city
['h','narita','วัดนาริตะซัง ชินโชจิ','成田山新勝寺',35.7860,140.3185,'วัดใหญ่อายุกว่า 1,000 ปี อาคารด้านในปิดราว 16:00 ลานวัดเข้าได้'],
['h','narita','สวนนาริตะซัง','成田山公園',35.7868,140.3207,''],
['s','narita','ถนนโอโมเตะซันโด นาริตะ','成田山表参道',35.7818,140.3172,'ร้านของฝาก ส่วนใหญ่ปิดราว 17:00–18:00'],
['s','narita','AEON MALL Narita','イオンモール成田',35.7603,140.2944,'~3 กม. นั่งบัสหรือแท็กซี่ เปิดถึงค่ำ'],
['f','narita','Kawatoyo (ปลาไหลย่าง)','川豊 本店 成田',35.7844,140.3179,'ร้านดังที่สุด ปิดช่วงเย็น ควรไปก่อน 16:00'],
['f','narita','Kikuya','菊屋 成田',35.7812,140.3171,'อาหารญี่ปุ่น/ปลาไหล บรรยากาศดั้งเดิม'],
['f','narita','Surugaya (ปลาไหล)','駿河屋 成田',35.7832,140.3176,''],
['f','narita','The Barge Inn (ผับ)','バージイン 成田',35.7787,140.3170,'ผับสไตล์อังกฤษ เปิดดึก'],
['f','narita','โซนอิซากายะหน้าสถานีนาริตะ','成田駅 居酒屋',35.7768,140.3183,'ร้านเปิดดึกรอบสถานี JR/Keisei'],
['t','narita','สถานี JR Narita','JR成田駅',35.7763,140.3186,''],
['t','narita','สถานี Keisei Narita','京成成田駅',35.7768,140.3173,'จาก Keisei Ueno ~70–80 นาที (Limited Express)'],
['o','narita','Narita Tourist Pavilion','成田観光館',35.7815,140.3170,'ข้อมูลท่องเที่ยว เข้าฟรี']
];
const P = RAW.map((r,i)=>({id:'p'+i,cat:r[0],area:r[1],name:r[2],ja:r[3],ll:[r[4],r[5]],note:r[6]||''}));

const L_ = { // shortcuts for stop coordinates
  nrt:[35.7643,140.3863], shina:[35.6285,139.7387], shinaK:[35.6278,139.7381], hara:[35.6702,139.7027], asaG:[35.7110,139.7975], asaT:[35.7097,139.7972], omo:[35.6653,139.7123],
  take:[35.6714,139.7047], cat:[35.6650,139.7060], scr:[35.6595,139.7005], sky:[35.6584,139.7022], shibF:[35.6610,139.6995],
  kmk:[35.3190,139.5503], koma:[35.3203,139.5513], hachi:[35.3260,139.5563], hase:[35.3117,139.5353], buddha:[35.3168,139.5357],
  hasedera:[35.3125,139.5332], koko:[35.3065,139.5004], eno:[35.2995,139.4805], enoSt:[35.3058,139.4880],
  kami:[35.7111,139.7964], culture:[35.7107,139.7965], kappa:[35.7135,139.7882], lunch3:[35.7123,139.7950], sky3:[35.7101,139.8107],
  naka:[35.7128,139.7965], senso:[35.7148,139.7967], hoppy:[35.7133,139.7930], donki:[35.7136,139.7931],
  keiU:[35.7113,139.7737], uenoP:[35.7146,139.7732], ame:[35.7105,139.7745], keiN:[35.7768,140.3173],
  shin:[35.7860,140.3185], omoN:[35.7818,140.3172], barge:[35.7787,140.3170]
};

const DAYS = [
 { title:'นาริตะ → ชินากาวะ → ฮาราจูกุ–ชิบูย่า', short:'ชิบูย่า', areas:['nrt_ap','shinagawa','harajuku','shibuya'], zone:'tyo',
   facts:[['เดินรวม','~2 กม.'],['ตั๋วที่ต้องจอง','N\'EX + SHIBUYA SKY'],['ที่พัก','ชินากาวะ']],
   stops:[
    {t:'12:00', z:'nrt', n:'ออกจากสนามบินนาริตะ', ll:L_.nrt, mv:1, note:'N\'EX ไปสถานีชินากาวะตรง ~75 นาที (ที่นั่งจอง มีที่วางกระเป๋า) หรือ Keisei Access Express ขบวนที่ไปถึงชินากาวะ ~90 นาที ถูกกว่า ใช้ Suica ได้'},
    {t:'13:20', z:'tyo', n:'ที่พักย่านสถานีชินากาวะ: ฝากกระเป๋า', ll:L_.shina, note:'เช็คอินได้ 15:00 แต่โรงแรมรับฝากกระเป๋าก่อนได้ จะได้เดินตัวเปล่า'},
    {t:'13:45', z:'tyo', n:'JR Yamanote → สถานีฮาราจูกุ', ll:L_.hara, mv:1, note:'สายเดียวตรง ~17 นาที'},
    {t:'14:15', z:'tyo', n:'ถนนทาเคชิตะ → โอโมเตะซันโด', ll:L_.take, note:'เครปทาเคชิตะ แล้วเลี้ยวเข้าโอโมเตะซันโด ผ่านดาดฟ้า Omokado, Omotesando Hills (~1 กม.)'},
    {t:'15:15', z:'tyo', n:'แคทสตรีท → Miyashita Park', ll:L_.cat, note:'ทางเดินร้านแบรนด์สตรีทสู่ชิบูย่า (~1 กม.)'},
    {t:'16:00', z:'tyo', n:'ทางม้าลาย Scramble + ฮาจิโกะ', ll:L_.scr, note:'ถ่ายรูปทางม้าลาย แล้วเดินเข้าอาคาร Shibuya Scramble Square'},
    {t:'16:30', z:'tyo', n:'SHIBUYA SKY (รอบพระอาทิตย์ตก)', ll:L_.sky, q:'渋谷スカイ', note:'จองรอบ 30–40 นาทีก่อนพระอาทิตย์ตก (กลาง ต.ค. ตกราว 17:05, พ.ย. ราว 16:35) อยู่บนดาดฟ้าประมาณ 1 ชม.'},
    {t:'18:00', z:'tyo', n:'มื้อเย็น + ช็อปชิบูย่า', ll:L_.shibF, note:'Parco (Nintendo/Pokémon), MEGA Don Quijote, Shibuya Yokocho — ดูแท็บ "รอบตัว"'},
    {t:'20:00', z:'tyo', n:'JR Yamanote กลับชินากาวะ → เช็คอิน', ll:L_.shina, mv:1, note:'จากชิบูย่าสายเดียวตรง ~13 นาที'}
   ],
   tips:['ถ้าอยากเช็คอินก่อนออกเที่ยว ให้สลับ: ถึงโรงแรม ~13:20 พักถึง 15:00 แล้วค่อยไปชิบูย่า (ยังทันรอบพระอาทิตย์ตก)',
         'ซื้อตั๋ว N\'EX ที่เคาน์เตอร์ JR ในสนามบิน หรือจองออนไลน์ล่วงหน้า (มีโปรตั๋วไป–กลับสำหรับนักท่องเที่ยว)',
         'ซื้อ Welcome Suica หรือเติม Suica ในมือถือ ใช้ได้ทั้งรถไฟ ร้านสะดวกซื้อ และล็อกเกอร์',
         'SHIBUYA SKY ดาดฟ้าปิดเมื่อฝนตกหรือลมแรง ตรวจสภาพอากาศก่อนจอง']
 },
 { title:'คามากุระ ไป–กลับ ทั้งวัน', short:'คามากุระ', areas:['kamakura','hase','enoshima','shinagawa'], zone:'kmk',
   facts:[['เดินทาง','~50 นาที/เที่ยว'],['ตั๋ววันแนะนำ','Enoden Noriorikun'],['เดินรวม','~5–6 กม.']],
   stops:[
    {t:'08:20', z:'tyo', n:'ออกจากชินากาวะ: JR Yokosuka line → Kamakura', ll:L_.shina, mv:1, note:'สายเดียวตรง ~50 นาที ไม่ต้องเปลี่ยนรถ ใช้ Suica'},
    {t:'09:20', z:'kmk', n:'ถึงสถานี JR Kamakura', ll:L_.kmk, note:'แวะศูนย์ข้อมูลท่องเที่ยวรับแผนที่ ฝากของที่ล็อกเกอร์ได้'},
    {t:'09:30', z:'kmk', n:'ถนนโคมาจิ', ll:L_.koma, note:'ร้านเปิดราว 10:00 ขาไปเดินดูก่อน ขากลับค่อยซื้อ'},
    {t:'10:00', z:'kmk', n:'ศาลเจ้าซึรุงะโอกะ ฮาจิมังงู', ll:L_.hachi, q:'鶴岡八幡宮'},
    {t:'11:30', z:'kmk', n:'มื้อกลางวัน: ชิราสึดง ย่านโคมาจิ', ll:L_.koma, note:'ชิราสึ (ปลาข้าวสาร) คืออาหารประจำถิ่น'},
    {t:'12:45', z:'kmk', n:'รถไฟ Enoden → สถานีฮาเสะ', ll:L_.hase, mv:1, note:'~5 นาที ซื้อตั๋ว 1 วันที่สถานี Enoden ถ้าจะลงหลายจุด'},
    {t:'13:00', z:'kmk', n:'พระใหญ่คามากุระ (โคโตคุอิน)', ll:L_.buddha, q:'鎌倉大仏 高徳院'},
    {t:'14:00', z:'kmk', n:'วัดฮาเสะเดระ', ll:L_.hasedera, q:'長谷寺 鎌倉', note:'ลานชมวิวทะเล คาเฟ่ Kaikoan'},
    {t:'15:30', z:'kmk', n:'ทางข้ามรถไฟคามากุระโคโคมาเอะ', ll:L_.koko, note:'Enoden จากฮาเสะ ~10 นาที ถ่ายรูปรถไฟกับทะเล'},
    {t:'16:15', z:'kmk', n:'เกาะเอโนชิมะ (ชมพระอาทิตย์ตก)', ll:L_.eno, q:'江の島', note:'ไม่บังคับ ถ้าเหนื่อยกลับจากฮาเสะได้เลย'},
    {t:'18:00', z:'kmk', n:'กลับโตเกียว', ll:L_.enoSt, mv:1, note:'Enoden → Fujisawa (~10 นาที) แล้ว JR Tokaido line → ชินากาวะ ~45 นาที (รวม ~1 ชม. 10 นาที)'},
    {t:'19:15', z:'tyo', n:'ถึงชินากาวะ + มื้อเย็น', ll:L_.shina, note:'ซอยราเมง Shinatatsu หรือร้านใน atré Shinagawa ใกล้ที่พัก'}
   ],
   tips:['วันหยุดเสาร์–อาทิตย์ รถไฟ Enoden แน่นมาก ควรออกเช้า',
         'ถ้ามี JR Pass ใช้กับ JR Yokosuka/Tokaido ได้ แต่ Enoden ต้องจ่ายแยก',
         'ทางข้ามรถไฟโคโคมาเอะ คนในพื้นที่ขอให้ไม่ยืนบนถนน ถ่ายจากทางเท้าเท่านั้น']
 },
 { title:'อาซากุซะทั้งวัน: ช็อปของฝาก + เซ็นโซจิยามค่ำ', short:'อาซากุซะ', areas:['shinagawa','asakusa'], zone:'tyo',
   facts:[['ย้ายที่พัก','ชินากาวะ → อาซากุซะ'],['ซื้อของฝาก','ก่อน 17:00'],['Tax-free','พกพาสปอร์ต']],
   stops:[
    {t:'08:00', z:'tyo', n:'เช็คเอาท์ชินากาวะ → อาซากุซะ', ll:L_.shinaK, mv:1, note:'Keikyu/สาย Toei Asakusa ขบวนที่วิ่งต่อถึงอาซากุซะ ~25 นาที (ถ้าไม่ถึง เปลี่ยนที่ Sengakuji ชานชาลาเดียวกัน)'},
    {t:'08:45', z:'tyo', n:'ฝากกระเป๋าที่พักอาซากุซะ', ll:L_.asaT, note:'เช็คอินได้ 15:00 ฝากกระเป๋าไว้ก่อน'},
    {t:'09:00', z:'tyo', n:'คามินาริมง + นากามิเสะ ตอนเช้า', ll:L_.kami, note:'คนยังน้อย ถ่ายรูปสวย ร้านเริ่มเปิดราว 9:30–10:00'},
    {t:'09:45', z:'tyo', n:'จุดชมวิวฟรี Asakusa Culture Tourist Info Center', ll:L_.culture, q:'浅草文化観光センター', note:'ชั้น 8 เห็นนากามิเสะและสกายทรี'},
    {t:'10:30', z:'tyo', n:'ถนนคัปปะบาชิ (เครื่องครัว / มีด)', ll:L_.kappa, q:'かっぱ橋道具街', note:'ร้านส่วนใหญ่ปิดวันอาทิตย์'},
    {t:'12:00', z:'tyo', n:'มื้อกลางวัน', ll:L_.lunch3, note:'เทนดง Daikokuya หรือ Asakusa Gyukatsu'},
    {t:'13:15', z:'tyo', n:'Tokyo Skytree / Solamachi (ช็อป)', ll:L_.sky3, q:'東京ソラマチ', note:'ข้ามสะพานเดิน ~1.3 กม. หรือ Tobu 1 สถานี ร้านของฝากและร้านคาแรกเตอร์เยอะ'},
    {t:'15:15', z:'tyo', n:'เช็คอินที่พักอาซากุซะ', ll:L_.asaT, note:'วางถุงของที่ช็อปมา พักสั้นๆ'},
    {t:'15:45', z:'tyo', n:'ช็อปของฝาก นากามิเสะ + Denboin-dori', ll:L_.naka, note:'ซื้อให้เสร็จก่อนราว 17:00 ร้านเริ่มปิด'},
    {t:'17:00', z:'tyo', n:'วัดเซ็นโซจิ ตอนเย็น (เปิดไฟ)', ll:L_.senso, q:'浅草寺', note:'วิหารหลักปิด 17:00 แต่ลานวัด ประตู เจดีย์เปิดไฟสวยถึงราว 23:00'},
    {t:'18:30', z:'tyo', n:'มื้อเย็น Hoppy Street', ll:L_.hoppy, q:'ホッピー通り'},
    {t:'20:00', z:'tyo', n:'Don Quijote Asakusa (ช็อปส่วนตัว)', ll:L_.donki, q:'ドン・キホーテ浅草店', note:'เปิด 24 ชม. ซื้อครบ ¥5,000 (ก่อน VAT) ขอ Tax-free ได้'}
   ],
   tips:['ระบบ Tax-free: ยอดซื้อร้านเดียวกันในวันเดียวกัน ¥5,000 ขึ้นไป (ไม่รวม VAT) ต้องแสดงพาสปอร์ต',
         'ถ้าอยากใส่กิโมโนถ่ายรูปในวัด จองร้านเช่าตอนเช้า คืนชุดก่อน 17:00–18:00',
         'ล่องเรือแม่น้ำสุมิดะจากท่าอาซากุซะเป็นทางเลือกช่วงบ่าย']
 },
 { title:'เช้าอุเอโนะ–อาเมโยโกะ → บ่ายนาริตะ + เที่ยวกลางคืน', short:'อุเอโนะ/นาริตะ', areas:['asakusa','ueno','narita'], zone:'tyo',
   facts:[['เช็คเอาท์','~08:30'],['รถไฟไปนาริตะ','Keisei จากอุเอโนะ'],['ที่พัก','นาริตะ']],
   stops:[
    {t:'08:30', z:'tyo', n:'เช็คเอาท์อาซากุซะ → สาย Ginza ไปอุเอโนะ', ll:L_.asaG, mv:1, note:'3 สถานี ~5 นาที ลากกระเป๋าไปด้วย'},
    {t:'08:50', z:'tyo', n:'ฝากกระเป๋าที่สถานี Keisei Ueno', ll:L_.keiU, q:'京成上野駅', note:'ล็อกเกอร์ในสถานี ใกล้ขบวนที่จะนั่งไปนาริตะตอนบ่าย'},
    {t:'09:10', z:'tyo', n:'สวนอุเอโนะ + ศาลเจ้าโทโชงู + บ่อชิโนบาซุ', ll:L_.uenoP, q:'上野恩賜公園', note:'เดินเล่นช่วงเช้า อากาศดี'},
    {t:'10:30', z:'tyo', n:'ตลาดอาเมโยโกะ', ll:L_.ame, q:'アメ横商店街', note:'ขนมราคาส่ง ผลไม้ ของฝากรอบสุดท้าย'},
    {t:'12:00', z:'tyo', n:'มื้อกลางวันที่อาเมโยโกะ', ll:L_.ame, note:'ไคเซ็นดง Minatoya / เมนจิคัตสึ Nikuno Ohyama'},
    {t:'13:30', z:'tyo', n:'Keisei Ueno → Keisei Narita', ll:L_.keiU, mv:1, note:'Limited Express ~75 นาที ใช้ Suica ได้ (หรือ Skyliner ไปสนามบินแล้วนั่งรถรับส่งโรงแรม)'},
    {t:'15:00', z:'nrt', n:'เช็คอินที่พักนาริตะ', ll:L_.keiN},
    {t:'15:40', z:'nrt', n:'วัดนาริตะซัง ชินโชจิ', ll:L_.shin, q:'成田山新勝寺', note:'ไปก่อน 16:00 อาคารด้านในยังเปิด'},
    {t:'16:40', z:'nrt', n:'ถนนโอโมเตะซันโด + ปลาไหลย่าง', ll:L_.omoN, q:'成田山表参道', note:'ร้านส่วนใหญ่ปิดราว 17:00–18:00'},
    {t:'19:00', z:'nrt', n:'เที่ยวกลางคืน: อิซากายะหน้าสถานี / The Barge Inn', ll:L_.barge, note:'นาริตะเป็นเมืองเล็ก กลางคืนเงียบกว่าโตเกียว ร้านเปิดดึกจะอยู่รอบสถานี'}
   ],
   tips:['ทางเลือกช่วงเช้า: ตลาดปลาสึกิจิ (นอก) — สาย Toei Asakusa จากอาซากุซะไป Higashi-ginza 10 นาที แล้วนั่ง Access Express จากสถานีเดิมไปนาริตะได้',
         'ถ้าที่พักอยู่ติดสนามบิน (มีรถรับส่ง) นั่ง Skyliner ไปสนามบินเร็วกว่า แล้วนั่งรถไฟ 10 นาทีเข้าเมืองนาริตะตอนเย็น',
         'เช็คเวลาร้าน Kawatoyo ก่อนไป ร้านปลาไหลส่วนใหญ่ปิดช่วงเย็น']
 },
 { title:'เข้าสนามบิน 09:00 บินกลับไทย', short:'บินกลับ', areas:['narita','nrt_ap'], zone:'nrt',
   facts:[['ถึงสนามบิน','09:00'],['เดินทาง','~10–15 นาที'],['เช็ค','อาคารผู้โดยสาร']],
   stops:[
    {t:'07:30', z:'nrt', n:'อาหารเช้า + เก็บกระเป๋า', ll:L_.keiN, note:'ใช้เหรียญเยนที่เหลือที่ร้านสะดวกซื้อ'},
    {t:'08:30', z:'nrt', n:'เช็คเอาท์ → สนามบิน', ll:L_.keiN, mv:1, note:'Keisei/JR จากสถานีนาริตะ ~10 นาที หรือรถรับส่งโรงแรม'},
    {t:'09:00', z:'nrt', n:'ถึงสนามบินนาริตะ', ll:L_.nrt, q:'成田国際空港', note:'ดูอาคาร (1/2/3) จากตั๋วเครื่องบิน เผื่อเวลาเช็คอินอย่างน้อย 2–3 ชม. ก่อนบิน'}
   ],
   tips:['ของเหลวเกิน 100 มล. (ซอส สาเก) ต้องโหลดใต้เครื่อง',
         'ของ Tax-free ที่ปิดผนึกในถุง ห้ามเปิดก่อนออกจากญี่ปุ่น',
         'เงินที่เหลือใน Welcome Suica คืนไม่ได้ ใช้ซื้อของในสนามบินให้หมด']
 }
];

const EXC = [['food','อาหาร'],['transport','เดินทาง'],['shop','ช็อปปิ้ง'],['gift','ของฝาก'],['ticket','ตั๋ว/เข้าชม'],['hotel','ที่พัก'],['other','อื่นๆ']];
const PAY = [['cash','เงินสด'],['card','บัตร'],['ic','Suica/IC']];
const lab = (arr,k)=> (arr.find(x=>x[0]===k)||[k,k])[1];
const keyOf = (arr,l)=> (arr.find(x=>x[1]===l||x[0]===l)||['other'])[0];

/* ============ STATE ============ */
const $ = (s,el=document)=>el.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function load(k,d){ try{ const v=localStorage.getItem(k); return v ? JSON.parse(v) : d; }catch(e){ return d; } }
function save(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }

const settings = Object.assign({url:'', key:'', start:'', rate:0.22, budget:0, gpsAuto:false, logLoc:false, logMin:10, wake:false}, load('jt.settings',{}));
let expenses = load('jt.exp', []);
let pendingDel = load('jt.del', []);
let locQ = load('jt.locq', []);
const S = { day: autoDay() || load('jt.day',1), tab: load('jt.tab','map'), anchor:'gps', radius:500, ncat:'f',
            mapCats:new Set(CAT_KEYS), pos:null, watchId:null, lastLog:0, syncing:false, syncErr:'', fitted:false, delAsk:null,
            form:{cat:'food', pay:'cash', cur:'JPY'} };

function dist(a,b){ const R=6371000, r=x=>x*Math.PI/180; const dLa=r(b[0]-a[0]), dLo=r(b[1]-a[1]);
  const h=Math.sin(dLa/2)**2 + Math.cos(r(a[0]))*Math.cos(r(b[0]))*Math.sin(dLo/2)**2; return 2*R*Math.asin(Math.sqrt(h)); }
const fmtD = m => m < 1000 ? (Math.round(m/10)*10)+' ม.' : (m/1000).toFixed(m<10000?1:0)+' กม.';
const walk = m => Math.max(1, Math.round(m/75));
const yen = n => '¥' + Math.round(n).toLocaleString('en-US');
const baht = n => '฿' + Math.round(n).toLocaleString('en-US');
const gq = p => p.ja || p.name;
const gSearch = q => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
const gDir = (dest, mode='walking') => 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(dest) + '&travelmode=' + mode;
const gNear = (g, ll) => 'https://www.google.com/maps/search/' + encodeURIComponent(g) + '/@' + ll[0] + ',' + ll[1] + ',17z';

function tripDate(n){ if(!settings.start) return null; const d=new Date(settings.start+'T00:00:00'); d.setDate(d.getDate()+n-1); return d; }
function autoDay(){ const st = load('jt.settings',{}).start; if(!st) return 0; const s=new Date(st+'T00:00:00'), t=new Date(); t.setHours(0,0,0,0);
  const n = Math.round((t-s)/86400000)+1; return (n>=1 && n<=5) ? n : 0; }
function isToday(n){ const d=tripDate(n); if(!d) return false; const t=new Date(); return d.toDateString()===t.toDateString(); }
function activeIdx(day){ if(!isToday(day.n)) return -1; const now=new Date(), hm=now.getHours()*60+now.getMinutes(); let a=0;
  day.stops.forEach((s,i)=>{ const [h,m]=s.t.split(':').map(Number); if(h*60+m<=hm) a=i; }); return a; }
DAYS.forEach((d,i)=>{ d.n=i+1; d.stops.forEach((s,j)=>s.id='d'+d.n+'s'+j); });

/* ============ EDITABLE PLAN (แผนหลัก + แผนรอง) ============ */
const AREA_ZONE = {nrt_ap:'nrt', narita:'nrt', kamakura:'kmk', hase:'kmk', enoshima:'kmk'};
const zoneOf = p => AREA_ZONE[p.area] || 'tyo';
const ALT_SEED = { // แผนรองตั้งต้นที่แนะนำไว้ (สลับเข้าแผนหลักได้)
  1:['明治神宮','渋谷パルコ','MEGAドン・キホーテ渋谷本店','渋谷横丁'],
  2:['銭洗弁財天','報国寺','江の島シーキャンドル','鎌倉紅谷 八幡宮前本店'],
  3:['浅草 水上バス乗り場','浅草花やしき','浅草 着物レンタル','壽々喜園 浅草本店'],
  4:['東京国立博物館','ヤマシロヤ 上野','成田山公園','イオンモール成田'],
  5:['成田空港 第1ターミナル 展望デッキ','成田空港 第2ターミナル 展望デッキ']
};
function poiStop(p,t,id){ return {id:id||('c'+Date.now().toString(36)+Math.random().toString(36).slice(2,5)), t:t||'', z:zoneOf(p), n:p.name, ll:p.ll, q:p.ja, note:p.note, poi:p.id, cat:p.cat}; }
let custom = load('jt.plan', {});
function plan(n){ return custom[n] || { stops:DAYS[n-1].stops,
  alts:(ALT_SEED[n]||[]).map(j=>P.find(p=>p.ja===j)).filter(Boolean).map(p=>poiStop(p,'','a'+n+p.id)) }; }
function editPlan(n){ if(!custom[n]) custom[n]=JSON.parse(JSON.stringify(plan(n))); return custom[n]; }
function savePlan(){ save('jt.plan',custom); }
const hhmm = d => String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
function addMin(t,m){ const [h,mi]=t.split(':').map(Number); const x=Math.min(23*60+59, Math.max(0,h*60+mi+m)); return String(Math.floor(x/60)).padStart(2,'0')+':'+String(x%60).padStart(2,'0'); }
function timeOpts(cur){ const set=new Set([cur]); for(let m=5*60;m<24*60;m+=15) set.add(String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0'));
  return [...set].sort().map(t=>`<option${t===cur?' selected':''}>${t}</option>`).join(''); }
function sortStops(st){ st.sort((a,b)=>a.t.localeCompare(b.t)); }
function findStop(id){ const p=plan(S.day); return p.stops.find(s=>s.id===id) || p.alts.find(s=>s.id===id); }
function suggestTime(n, ll){
  const st=plan(n).stops;
  if(isToday(n)){ const d=new Date(); d.setMinutes(Math.ceil(d.getMinutes()/15)*15,0,0); return hhmm(d); }
  const a = S.anchor!=='gps' && st.find(s=>s.id===S.anchor);
  if(a) return addMin(a.t,30);
  const land = st.filter(s=>!s.mv);  // ไม่ได้อยู่ในวันนั้น: ต่อท้ายจุดในแผนที่ใกล้สถานที่นี้ที่สุด
  if(ll && land.length){ const near = land.reduce((b,s)=> dist(s.ll,ll) < dist(b.ll,ll) ? s : b); return addMin(near.t,30); }
  return st.length ? addMin(st[st.length-1].t,30) : '10:00';
}
const inPlan = (pid)=>{ const p=plan(S.day); return p.stops.some(s=>s.poi===pid) ? 'main' : p.alts.some(s=>s.poi===pid) ? 'alt' : ''; };
function addToPlan(pid, mode){
  const p=P.find(x=>x.id===pid); if(!p) return; const ep=editPlan(S.day);
  if(mode==='alt'){ if(ep.alts.some(s=>s.poi===pid)){ toast('อยู่ในแผนรองแล้ว'); return; } ep.alts.push(poiStop(p,'')); toast('เพิ่ม "'+p.name+'" ในแผนรอง'); }
  else { const t=suggestTime(S.day,p.ll); ep.alts=ep.alts.filter(s=>s.poi!==pid); ep.stops.push(poiStop(p,t)); sortStops(ep.stops); toast('ใส่ "'+p.name+'" ในแผนเวลา '+t+' (แก้เวลาได้ที่แท็บแผนวัน)'); }
  savePlan(); S.fitted=true; renderTab();
}
function promote(id){ const ep=editPlan(S.day); const i=ep.alts.findIndex(s=>s.id===id); if(i<0) return; const s=ep.alts.splice(i,1)[0];
  s.t=suggestTime(S.day,s.ll); ep.stops.push(s); sortStops(ep.stops); savePlan(); toast('ย้าย "'+s.n+'" เข้าแผนเวลา '+s.t); renderTab(); }
function demote(id){ const ep=editPlan(S.day); const i=ep.stops.findIndex(s=>s.id===id); if(i<0) return; const s=ep.stops.splice(i,1)[0];
  ep.alts.unshift(s); if(S.anchor===id) S.anchor='gps'; savePlan(); toast('ย้าย "'+s.n+'" ไปแผนรอง'); renderTab(); }
function removeItem(id){ const ep=editPlan(S.day); ep.stops=ep.stops.filter(s=>s.id!==id); ep.alts=ep.alts.filter(s=>s.id!==id); if(S.anchor===id) S.anchor='gps'; savePlan(); renderTab(); }
function setTime(id,t){ if(!/^\d{2}:\d{2}$/.test(t)) return; const ep=editPlan(S.day); const s=ep.stops.find(x=>x.id===id); if(!s) return; s.t=t; sortStops(ep.stops); savePlan(); renderTab(); }
function resetPlan(){ delete custom[S.day]; savePlan(); S.resetAsk=false; S.anchor = S.pos?'gps':DAYS[S.day-1].stops[0].id; S.fitted=false; toast('คืนค่าแผนเดิมของวันที่ '+S.day+' แล้ว'); renderTab(); }

const curDay = ()=>{ const p=plan(S.day); return Object.assign({}, DAYS[S.day-1], {stops:p.stops, alts:p.alts, edited:!!custom[S.day]}); };
function toast(t){ document.querySelectorAll('.toast').forEach(x=>x.remove()); const el=document.createElement('div'); el.className='toast'; el.textContent=t; document.body.appendChild(el); setTimeout(()=>el.remove(),2400); }

/* ============ HEADER ============ */
function renderDays(){
  const el=$('#days');
  el.innerHTML = DAYS.map(d=>{ const dt=tripDate(d.n);
    const ds = dt ? dt.toLocaleDateString('th-TH',{day:'numeric',month:'short'}) : d.short;
    return `<button class="daybtn" role="tab" data-day="${d.n}" aria-pressed="${S.day===d.n}"><b>วัน ${d.n}${isToday(d.n)?'<span class="today">วันนี้</span>':''}</b><span>${esc(dt?ds+' · '+d.short:ds)}</span></button>`; }).join('');
}
function setDay(n){ S.day=n; save('jt.day',n); S.fitted=false; S.editMode=false; S.resetAsk=false; S.anchor = S.pos ? 'gps' : (plan(n).stops.find(s=>!s.mv)||{}).id || 'gps'; renderAll(); }
$('#days').addEventListener('click',e=>{ const b=e.target.closest('[data-day]'); if(b) setDay(+b.dataset.day); });

function renderStatus(){
  const gd=$('#gpsDot'), gt=$('#gpsTxt');
  if(S.watchId===null){ gd.className='dot'; gt.textContent='GPS ปิด'; }
  else if(!S.pos){ gd.className='dot warn'; gt.textContent='หาตำแหน่ง…'; }
  else { gd.className='dot on'; gt.textContent='GPS ±'+Math.round(S.pos.acc)+' ม.'; }
  const sd=$('#syncDot'), st=$('#syncTxt'); const n = expenses.filter(x=>!x.synced).length + pendingDel.length;
  if(!settings.url){ sd.className='dot'; st.textContent='Sheet ยังไม่ตั้งค่า'; }
  else if(S.syncing){ sd.className='dot warn'; st.textContent='กำลังซิงก์…'; }
  else if(S.syncErr){ sd.className='dot bad'; st.textContent='ซิงก์ไม่สำเร็จ'; }
  else if(n){ sd.className='dot warn'; st.textContent='รอซิงก์ '+n; }
  else { sd.className='dot on'; st.textContent='Sheet ซิงก์แล้ว'; }
}
$('#gpsPill').addEventListener('click',()=>{ S.watchId===null ? startGPS() : stopGPS(); });
$('#syncPill').addEventListener('click',()=>{ if(!settings.url){ go('set'); } else sync(true); });

/* ============ TABS ============ */
function go(tab){ S.tab=tab; save('jt.tab',tab);
  document.querySelectorAll('.tab').forEach(b=>b.setAttribute('aria-selected', b.dataset.tab===tab));
  ['map','plan','near','exp','set'].forEach(t=>$('#v-'+t).hidden = t!==tab);
  renderTab(); if(tab==='map' && map){ setTimeout(()=>map.invalidateSize(),0); } }
document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>go(b.dataset.tab)));
function renderTab(){ ({map:renderMap, plan:renderPlan, near:renderNear, exp:renderExp, set:renderSet})[S.tab](); }
function renderAll(){ renderDays(); renderStatus(); renderTab(); }

/* ============ GPS ============ */
let wakeLock=null;
async function keepAwake(on){ try{ if(on && 'wakeLock' in navigator && document.visibilityState==='visible'){ wakeLock = await navigator.wakeLock.request('screen'); }
  else if(!on && wakeLock){ await wakeLock.release(); wakeLock=null; } }catch(e){} }
document.addEventListener('visibilitychange',()=>{ if(document.visibilityState==='visible' && settings.wake && S.watchId!==null) keepAwake(true); });

function startGPS(){
  if(!('geolocation' in navigator)){ toast('อุปกรณ์นี้ไม่รองรับ GPS'); return; }
  S.watchId = navigator.geolocation.watchPosition(onPos, err=>{
    toast(err.code===1 ? 'ไม่ได้รับอนุญาตใช้ตำแหน่ง — เปิดสิทธิ์ Location ให้เบราว์เซอร์' : 'หาตำแหน่งไม่ได้ ลองออกไปที่โล่ง');
    if(err.code===1){ stopGPS(); }
  }, {enableHighAccuracy:true, maximumAge:10000, timeout:30000});
  settings.gpsAuto=true; save('jt.settings',settings); if(settings.wake) keepAwake(true); renderStatus();
}
function stopGPS(){ if(S.watchId!==null) navigator.geolocation.clearWatch(S.watchId); S.watchId=null; S.pos=null;
  settings.gpsAuto=false; save('jt.settings',settings); keepAwake(false); drawMe(); renderStatus(); if(S.tab!=='map') renderTab(); }
let lastRender=0;
function onPos(p){
  const first = !S.pos;
  S.pos = {lat:p.coords.latitude, lng:p.coords.longitude, acc:p.coords.accuracy, ts:p.timestamp};
  if(first && S.anchor!=='gps') S.anchor='gps';
  drawMe(first); renderStatus();
  if(settings.logLoc && settings.url && Date.now()-S.lastLog >= settings.logMin*60000){
    S.lastLog=Date.now(); locQ.push({ts:Date.now(), day:S.day, lat:+S.pos.lat.toFixed(6), lng:+S.pos.lng.toFixed(6), acc:S.pos.acc}); save('jt.locq',locQ); sync();
  }
  if(Date.now()-lastRender > 15000 || first){ lastRender=Date.now(); if(S.tab==='near' || (S.tab==='plan' && !S.editMode)) renderTab(); }
}

/* ============ MAP ============ */
let map=null, lyPOI, lyStops, meM, meAcc, meRad, tiles;
const dark = ()=> document.documentElement.dataset.theme ? document.documentElement.dataset.theme==='dark' : matchMedia('(prefers-color-scheme: dark)').matches;
function initMap(){
  if(!window.L){ $('#map').innerHTML='<div class="map-off">โหลดแผนที่ไม่ได้ ตรวจสอบอินเทอร์เน็ต แท็บอื่นยังใช้งานได้ตามปกติ</div>'; return; }
  map = L.map('map',{zoomControl:false, attributionControl:true}).setView([35.69,139.75],12);
  setTiles();
  lyStops=L.layerGroup().addTo(map); lyPOI=L.layerGroup().addTo(map);
}
// แผนที่ฟรีไม่ต้องใช้ API Key: OpenStreetMap เป็นหลัก ถ้าโหลดไม่ขึ้นสลับไป Esri อัตโนมัติ
const TILE_SRC = [
  {u:'https://tile.openstreetmap.org/{z}/{x}/{y}.png', a:'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>', max:19},
  {u:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', a:'Tiles © Esri', max:19}
];
let tileIdx=0, tileErr=0, tileOk=0;
function setTiles(){ if(!map) return; if(tiles) map.removeLayer(tiles);
  const src=TILE_SRC[tileIdx]; tileErr=0; tileOk=0;
  tiles = L.tileLayer(src.u,{maxZoom:20, maxNativeZoom:src.max, attribution:src.a});
  tiles.on('tileload',()=>{ tileOk++; });
  tiles.on('tileerror',()=>{ if(++tileErr>=4 && tileOk===0 && tileIdx<TILE_SRC.length-1){ tileIdx++; setTiles(); } });
  tiles.addTo(map); }

function poiPopup(p){ const d = S.pos ? dist([S.pos.lat,S.pos.lng],p.ll) : null;
  return `<div class="pop"><span class="label">${CAT[p.cat].label}</span><h4>${esc(p.name)}</h4><div class="jp">${esc(p.ja)}</div>${p.note?`<p>${esc(p.note)}</p>`:''}${d!==null?`<p class="num">${fmtD(d)} · เดิน ~${walk(d)} นาที</p>`:''}
  <div class="links"><a class="btn sm pri" target="_blank" rel="noopener" href="${gDir(gq(p))}">นำทาง</a><a class="btn sm" target="_blank" rel="noopener" href="${gSearch(gq(p))}">Google Maps</a></div>
  <div class="links">${planBtns(p.id)}</div></div>`; }
function planBtns(pid){ const st=inPlan(pid);
  if(st==='main') return `<span class="tag on">✓ อยู่ในแผนวันที่ ${S.day}</span>`;
  return `<button class="btn sm add" type="button" onclick="addToPlan('${pid}','main')">+ ใส่ในแผน</button>` +
    (st==='alt' ? `<span class="tag">อยู่ในแผนรอง</span>` : `<button class="btn sm add" type="button" onclick="addToPlan('${pid}','alt')">+ แผนรอง</button>`); }
function stopPopup(s,i){ const q = s.q || (s.ll[0]+','+s.ll[1]);
  return `<div class="pop"><span class="label">${s.t} · จุดที่ ${i+1}</span><h4>${esc(s.n)}</h4>${s.note?`<p>${esc(s.note)}</p>`:''}
  <div class="links"><a class="btn sm pri" target="_blank" rel="noopener" href="${gDir(q, s.mv?'transit':'walking')}">นำทาง</a>${s.mv?'':`<button class="btn sm" type="button" onclick="nearStop('${s.id}')">ดูรอบๆ</button><button class="btn sm" type="button" onclick="demote('${s.id}')">ย้ายไปแผนรอง</button>`}</div></div>`; }
function altPopup(s){ const q = s.q || (s.ll[0]+','+s.ll[1]);
  return `<div class="pop"><span class="label">แผนรอง</span><h4>${esc(s.n)}</h4>${s.note?`<p>${esc(s.note)}</p>`:''}
  <div class="links"><button class="btn sm pri" type="button" onclick="promote('${s.id}')">ใส่ในแผน</button><a class="btn sm" target="_blank" rel="noopener" href="${gDir(q)}">นำทาง</a></div></div>`; }

function renderMap(){
  if(!map) initMap(); if(!map) return;
  const d=curDay(), act=activeIdx(d);
  lyStops.clearLayers(); lyPOI.clearLayers();
  // route lines per zone
  let seg=[], segZ=null;
  const flush=()=>{ if(seg.length>1) L.polyline(seg,{color:getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#2c4aa0',weight:3,dashArray:'6 7',opacity:.75}).addTo(lyStops); };
  d.stops.forEach(s=>{ if(s.z!==segZ){ flush(); seg=[]; segZ=s.z; } seg.push(s.ll); }); flush();
  d.stops.forEach((s,i)=>{ L.marker(s.ll,{zIndexOffset:1000, icon:L.divIcon({className:'',html:`<div class="pin-stop${i===act?' active':''}">${i+1}</div>`,iconSize:[28,28],iconAnchor:[14,14],popupAnchor:[0,-12]})})
    .bindPopup(()=>stopPopup(s,i)).addTo(lyStops); });
  P.filter(p=>d.areas.includes(p.area) && S.mapCats.has(p.cat)).forEach(p=>{
    L.marker(p.ll,{icon:L.divIcon({className:'',html:`<div class="pin pin-${p.cat}">${CAT[p.cat].glyph}</div>`,iconSize:[24,24],iconAnchor:[12,12],popupAnchor:[0,-10]})})
      .bindPopup(()=>poiPopup(p)).addTo(lyPOI); });
  d.alts.forEach(s=>{ L.marker(s.ll,{zIndexOffset:900, icon:L.divIcon({className:'',html:'<div class="pin-alt">รอง</div>',iconSize:[34,20],iconAnchor:[17,10],popupAnchor:[0,-8]})})
    .bindPopup(()=>altPopup(s)).addTo(lyStops); });
  $('#mapCats').innerHTML = CAT_KEYS.map(k=>`<button class="chip" type="button" data-mc="${k}" aria-pressed="${S.mapCats.has(k)}"><i class="bg-${k}">${CAT[k].glyph}</i>${CAT[k].label}</button>`).join('');
  const zs=[...new Set(d.stops.map(s=>s.z))];
  $('#mapZones').innerHTML = zs.map(z=>`<button class="chip" type="button" data-zone="${z}">${ZONES[z]}</button>`).join('');
  if(!S.fitted){ S.fitted=true; const z = act>=0 ? d.stops[act].z : d.zone; fitZone(z); }
  drawMe();
}
function fitZone(z){ const d=curDay(); const pts=d.stops.filter(s=>s.z===z).map(s=>s.ll);
  if(pts.length===1) map.setView(pts[0],15); else if(pts.length) map.fitBounds(pts,{padding:[50,50], maxZoom:16}); }
$('#mapCats').addEventListener('click',e=>{ const b=e.target.closest('[data-mc]'); if(!b) return; const k=b.dataset.mc;
  S.mapCats.has(k) ? S.mapCats.delete(k) : S.mapCats.add(k); renderMap(); });
$('#mapZones').addEventListener('click',e=>{ const b=e.target.closest('[data-zone]'); if(b) fitZone(b.dataset.zone); });
$('#locate').addEventListener('click',()=>{ if(S.watchId===null){ startGPS(); toast('กำลังหาตำแหน่ง…'); return; }
  if(S.pos && map) map.setView([S.pos.lat,S.pos.lng],16); });
function drawMe(center){
  if(!map) return;
  [meM,meAcc,meRad].forEach(l=>l && map.removeLayer(l)); meM=meAcc=meRad=null;
  if(!S.pos) return; const ll=[S.pos.lat,S.pos.lng];
  meRad = L.circle(ll,{radius:500, color:'#2f7cf6', weight:1, dashArray:'4 6', fill:false, interactive:false}).addTo(map);
  meAcc = L.circle(ll,{radius:S.pos.acc, color:'#2f7cf6', weight:0, fillOpacity:.12, interactive:false}).addTo(map);
  meM = L.marker(ll,{zIndexOffset:2000, icon:L.divIcon({className:'',html:'<div class="me"></div>',iconSize:[18,18],iconAnchor:[9,9]})}).addTo(map);
  if(center && S.tab==='map') map.setView(ll,16);
}

/* ============ PLAN ============ */
function renderPlan(){
  const d=curDay(), act=activeIdx(d), me = S.pos ? [S.pos.lat,S.pos.lng] : null;
  const dt=tripDate(d.n);
  let next='';
  if(me){ const ni = act>=0 ? Math.min(act+ (d.stops[act] && dist(me,d.stops[act].ll)<150 ? 1:0), d.stops.length-1) : 0; const s=d.stops[ni]; const m=dist(me,s.ll);
    next = `<div class="next"><div style="flex:1;min-width:0"><div class="label">จุดถัดไป · ${s.t}</div><div style="font-weight:600">${esc(s.n)}</div><div class="sub">${m>3000?'ใช้รถไฟ':'เดิน ~'+walk(m)+' นาที'}</div></div><div class="big">${fmtD(m)}</div>
      <a class="btn pri sm" target="_blank" rel="noopener" href="${gDir(s.q||s.ll.join(','), m>2000?'transit':'walking')}">นำทาง</a></div>`; }
  $('#planPad').innerHTML = `
    <div class="dayhead"><span class="label">วันที่ ${d.n}${dt?' · '+dt.toLocaleDateString('th-TH',{weekday:'long',day:'numeric',month:'long'}):''}</span><h2>${esc(d.title)}</h2>
      <div class="facts">${d.facts.map(f=>`<div class="fact">${esc(f[0])}<b>${esc(f[1])}</b></div>`).join('')}</div></div>
    ${next}
    <div class="planbar"><div><h3>แผนหลัก${d.edited?' <span class="tag">ปรับแล้ว</span>':''}</h3><p class="sub" style="font-size:12px">${S.editMode?'แก้เวลาเพื่อเรียงลำดับใหม่ · ย้ายจุดไปแผนรองหรือลบได้':'เพิ่มจุดได้จากแท็บ "รอบตัว" หรือหมุดบนแผนที่'}</p></div>
      <button class="btn sm ${S.editMode?'pri':''}" type="button" id="editToggle">${S.editMode?'เสร็จ':'แก้ไขแผน'}</button></div>
    <ol class="timeline">${d.stops.map((s,i)=>{ const cls=['stop', s.mv?'move':'', act>=0&&i<act?'done':'', i===act?'active':'', s.poi?'added':''].join(' ');
      const dm = me ? dist(me,s.ll) : null;
      const time = S.editMode ? `<select class="tin" data-time="${s.id}" aria-label="เวลา ${esc(s.n)}">${timeOpts(s.t)}</select>` : s.t;
      const tools = S.editMode
        ? `<div class="links">${s.mv?'':`<button class="btn sm" type="button" onclick="demote('${s.id}')">ย้ายไปแผนรอง</button>`}<button class="btn sm danger" type="button" onclick="removeItem('${s.id}')">ลบ</button></div>`
        : `<div class="links"><a class="btn sm" target="_blank" rel="noopener" href="${gDir(s.q||s.ll.join(','), s.mv?'transit':'walking')}">นำทาง</a>${s.mv?'':`<button class="btn sm ghost" type="button" onclick="nearStop('${s.id}')">ดูรอบๆ 500 ม.</button>`}</div>`;
      return `<li class="${cls}"><div class="t">${time}</div><div class="rail"><span></span></div><div class="body">
        <h4>${esc(s.n)}${s.poi?' <span class="tag">เพิ่มเอง</span>':''}</h4>${s.note?`<p>${esc(s.note)}</p>`:''}${dm!==null?`<div class="meta num">ห่าง ${fmtD(dm)}</div>`:''}
        ${tools}</div></li>`; }).join('')}</ol>

    <div class="card alts"><div class="planbar"><h3>แผนรอง <span class="count">${d.alts.length}</span></h3>
      <button class="btn sm ghost" type="button" onclick="S.anchor=curDay().stops.find(s=>!s.mv)?.id||'gps'; go('near')">หาที่ใกล้ๆ เพิ่ม</button></div>
      ${d.alts.length ? `<ul class="plist flat">${d.alts.map(s=>{ const dm = me ? dist(me,s.ll) : null;
        return `<li class="pitem"><div class="ic bg-${s.cat||'h'}">${CAT[s.cat||'h'].glyph}</div><div style="min-width:0"><h4>${esc(s.n)}</h4>${s.note?`<p>${esc(s.note)}</p>`:''}
          <div class="links"><button class="btn sm pri" type="button" onclick="promote('${s.id}')">ใส่ในแผน</button><a class="btn sm" target="_blank" rel="noopener" href="${gDir(s.q||s.ll.join(','))}">นำทาง</a><button class="btn sm ghost danger" type="button" onclick="removeItem('${s.id}')">ลบ</button></div></div>
          <div class="d">${dm!==null?`<b>${fmtD(dm)}</b>`:''}</div></li>`; }).join('')}</ul>`
        : `<p class="sub">ยังไม่มีแผนรอง กด "+ แผนรอง" ในแท็บรอบตัวหรือบนหมุดแผนที่</p>`}
    </div>
    ${d.edited ? (S.resetAsk
      ? `<div class="banner"><span>คืนค่าแผนวันที่ ${d.n} เป็นแบบเดิม? จุดที่เพิ่มเองจะหายไป</span><span class="links" style="margin:0"><button class="btn sm danger" type="button" onclick="resetPlan()">คืนค่า</button><button class="btn sm" type="button" onclick="S.resetAsk=false;renderPlan()">ยกเลิก</button></span></div>`
      : `<button class="btn ghost" type="button" onclick="S.resetAsk=true;renderPlan()">คืนค่าแผนเดิมของวันนี้</button>`) : ''}
    <div class="card"><h3>เคล็ดลับวันนี้</h3><ul class="tips" style="margin-top:8px">${d.tips.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></div>`;
  $('#editToggle').onclick=()=>{ S.editMode=!S.editMode; renderPlan(); };
  $('#planPad').querySelectorAll('[data-time]').forEach(inp=>inp.onchange=()=>setTime(inp.dataset.time, inp.value));
}
function nearStop(id){ S.anchor=id; go('near'); }

/* ============ NEARBY ============ */
function anchorInfo(){
  if(S.anchor==='gps') return S.pos ? {ll:[S.pos.lat,S.pos.lng], name:'ตำแหน่งปัจจุบัน'} : null;
  const s=findStop(S.anchor); return s ? {ll:s.ll, name:s.n} : null;
}
function renderNear(){
  const d=curDay(); if(S.anchor!=='gps' && !findStop(S.anchor)) S.anchor = S.pos ? 'gps' : (d.stops.find(s=>!s.mv)||{}).id || 'gps';
  const a=anchorInfo();
  const opt = (s,pre)=>`<option value="${s.id}"${S.anchor===s.id?' selected':''}>${pre}${esc(s.n)}</option>`;
  const opts = `<option value="gps"${S.anchor==='gps'?' selected':''}>📍 ตำแหน่งปัจจุบัน (GPS)</option>
    <optgroup label="แผนหลัก">${d.stops.filter(s=>!s.mv).map(s=>opt(s,s.t+' · ')).join('')}</optgroup>
    ${d.alts.length?`<optgroup label="แผนรอง">${d.alts.map(s=>opt(s,'รอง · ')).join('')}</optgroup>`:''}`;
  let body='';
  if(!a){ body = `<div class="banner"><span>เปิด GPS เพื่อดูสถานที่รอบตัว หรือเลือกจุดในแผนด้านบน</span><button class="btn sm pri" type="button" onclick="startGPS()">เปิด GPS</button></div>`; }
  else {
    const all = P.map(p=>({p, m:dist(a.ll,p.ll)}));
    const inR = all.filter(x=>x.m<=S.radius);
    const counts = Object.fromEntries(CAT_KEYS.map(k=>[k, inR.filter(x=>x.p.cat===k).length]));
    const list = inR.filter(x=>x.p.cat===S.ncat).sort((x,y)=>x.m-y.m);
    const more = all.filter(x=>x.p.cat===S.ncat && x.m>S.radius && x.m<=1200).sort((x,y)=>x.m-y.m);
    const item = x=>`<li class="pitem"><div class="ic bg-${x.p.cat}">${CAT[x.p.cat].glyph}</div><div style="min-width:0"><h4>${esc(x.p.name)}</h4><div class="jp">${esc(x.p.ja)}</div>${x.p.note?`<p>${esc(x.p.note)}</p>`:''}
        <div class="links"><a class="btn sm pri" target="_blank" rel="noopener" href="${gDir(gq(x.p))}">นำทาง</a><a class="btn sm" target="_blank" rel="noopener" href="${gSearch(gq(x.p))}">ดูรีวิว</a></div>
        <div class="links">${planBtns(x.p.id)}</div></div>
        <div class="d"><b>${fmtD(x.m)}</b>เดิน ${walk(x.m)} น.</div></li>`;
    body = `
      <div class="cats" id="ncats">${CAT_KEYS.map(k=>`<button class="chip" type="button" data-nc="${k}" aria-pressed="${S.ncat===k}"><i class="bg-${k}">${CAT[k].glyph}</i>${CAT[k].label} <span class="count">${counts[k]}</span></button>`).join('')}</div>
      ${list.length ? `<ul class="plist">${list.map(item).join('')}</ul>` : `<div class="card empty">ยังไม่มี${CAT[S.ncat].label}ที่คัดไว้ในระยะ ${S.radius} ม. จาก "${esc(a.name)}"</div>`}
      <a class="btn" target="_blank" rel="noopener" href="${gNear(CAT[S.ncat].g, a.ll)}">ค้นหา${CAT[S.ncat].label}เพิ่มใน Google Maps รอบจุดนี้</a>
      ${more.length ? `<div class="label">ไกลขึ้นอีกนิด (ไม่เกิน 1.2 กม.)</div><ul class="plist">${more.slice(0,8).map(item).join('')}</ul>` : ''}`;
  }
  $('#nearPad').innerHTML = `
    <div><h2>รอบตัว</h2><p class="sub">${a?'จาก: '+esc(a.name):'เลือกจุดอ้างอิง'}</p></div>
    <div class="ctrl"><select id="anchorSel" aria-label="จุดอ้างอิง" style="flex:1 1 200px">${opts}</select>
      <div class="seg" role="group" aria-label="รัศมี">${[300,500].map(r=>`<button type="button" data-r="${r}" aria-pressed="${S.radius===r}">${r} ม.</button>`).join('')}</div></div>
    ${body}`;
  $('#anchorSel').onchange = e=>{ S.anchor=e.target.value; if(S.anchor==='gps' && S.watchId===null) startGPS(); renderNear(); };
  $('#nearPad').querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{ S.radius=+b.dataset.r; renderNear(); });
  const nc=$('#ncats'); if(nc) nc.onclick=e=>{ const b=e.target.closest('[data-nc]'); if(b){ S.ncat=b.dataset.nc; renderNear(); } };
}

/* ============ EXPENSES ============ */
const toYen = x => x.cur==='JPY' ? +x.amount : +x.amount / (settings.rate||0.22);
function renderExp(){
  const rate = settings.rate||0.22;
  const totY = expenses.reduce((s,x)=>s+toYen(x),0);
  const dayY = expenses.filter(x=>x.day===S.day).reduce((s,x)=>s+toYen(x),0);
  const byCat = EXC.map(([k,l])=>[l, expenses.filter(x=>x.cat===k).reduce((s,x)=>s+toYen(x),0)]).filter(r=>r[1]>0).sort((a,b)=>b[1]-a[1]);
  const maxC = byCat.length ? byCat[0][1] : 1;
  const budY = settings.budget ? settings.budget/rate : 0; const pct = budY ? Math.min(100, totY/budY*100) : 0;
  const days = [...new Set(expenses.map(x=>x.day))].sort((a,b)=>b-a);
  const f=S.form;
  $('#expPad').innerHTML = `
    <div class="card">
      <div class="sum"><div><div class="k">รวมทั้งทริป</div><div class="v num">${yen(totY)}</div><div class="k num">≈ ${baht(totY*rate)}</div></div>
        <div><div class="k">วันที่ ${S.day}</div><div class="v num">${yen(dayY)}</div><div class="k num">≈ ${baht(dayY*rate)}</div></div></div>
      ${budY ? `<div style="margin-top:12px"><div class="k" style="display:flex;justify-content:space-between;font-size:12px;color:var(--muted)"><span>งบ ${baht(settings.budget)}</span><span class="num">${pct.toFixed(0)}%</span></div><div class="bar"><i class="${totY>budY?'over':''}" style="width:${pct}%"></i></div></div>`:''}
      ${byCat.length ? `<div class="brk" style="margin-top:14px">${byCat.map(([l,v])=>`<div class="row"><span>${esc(l)}</span><div class="bar"><i style="width:${v/maxC*100}%"></i></div><span class="num">${yen(v)}</span></div>`).join('')}</div>`:''}
    </div>

    <form class="card exp" id="expForm" autocomplete="off">
      <h3>บันทึกรายจ่าย · วันที่ ${S.day}</h3>
      <div class="amt"><input id="ex-amt" type="number" inputmode="decimal" min="0" step="any" placeholder="0" aria-label="จำนวนเงิน" required>
        <div class="seg" role="group" aria-label="สกุลเงิน">${['JPY','THB'].map(c=>`<button type="button" data-cur="${c}" aria-pressed="${f.cur===c}">${c==='JPY'?'¥ เยน':'฿ บาท'}</button>`).join('')}</div></div>
      <div class="choice" id="ex-cat">${EXC.map(([k,l])=>`<button type="button" data-k="${k}" aria-pressed="${f.cat===k}">${l}</button>`).join('')}</div>
      <div class="choice" id="ex-pay">${PAY.map(([k,l])=>`<button type="button" data-k="${k}" aria-pressed="${f.pay===k}">${l}</button>`).join('')}</div>
      <input id="ex-note" type="text" placeholder="รายละเอียด เช่น ราเมง Ichiran, ตั๋ว SHIBUYA SKY" aria-label="รายละเอียด">
      <button class="btn pri" type="submit">บันทึก${S.pos?' (แนบตำแหน่ง)':''}</button>
    </form>

    ${expenses.length ? `<ul class="elist">${days.map(dn=>{ const xs=expenses.filter(x=>x.day===dn).sort((a,b)=>b.ts-a.ts); const t=xs.reduce((s,x)=>s+toYen(x),0);
      return `<li class="eday"><span>วันที่ ${dn}</span><span class="num">${yen(t)} · ≈ ${baht(t*rate)}</span></li>` + xs.map(x=>`<li class="eitem"><div style="min-width:0">
        <h4><span class="sync ${x.synced?'y':'n'}" title="${x.synced?'ซิงก์แล้ว':'รอซิงก์'}"></span>${esc(x.note||lab(EXC,x.cat))}</h4>
        <p>${new Date(x.ts).toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'})} · ${esc(lab(EXC,x.cat))} · ${esc(lab(PAY,x.pay))}${x.lat?` · <a target="_blank" rel="noopener" href="https://maps.google.com/?q=${x.lat},${x.lng}">ตำแหน่ง</a>`:''}</p>
        ${S.delAsk===x.id?`<div class="confirm"><button class="btn sm danger" type="button" data-delyes="${x.id}">ลบรายการนี้</button><button class="btn sm" type="button" data-delno>ยกเลิก</button></div>`:''}</div>
        <div class="a"><b>${x.cur==='JPY'?yen(x.amount):baht(x.amount)}</b><span class="num">${x.cur==='JPY'?'≈ '+baht(x.amount*rate):'≈ '+yen(toYen(x))}</span><br><button class="btn sm ghost" type="button" data-del="${x.id}" aria-label="ลบ" style="margin-top:4px;padding:2px 8px">ลบ</button></div></li>`).join(''); }).join('')}</ul>`
      : `<div class="card empty">ยังไม่มีรายจ่าย ใส่จำนวนเงินด้านบนแล้วกดบันทึก รายการจะถูกส่งไป Google Sheet อัตโนมัติเมื่อตั้งค่าแล้ว</div>`}
    <div class="ctrl"><button class="btn" type="button" id="syncNow">ซิงก์ตอนนี้</button><button class="btn ghost" type="button" id="pullNow">ดึงข้อมูลจาก Sheet</button></div>
    <p class="msg" id="expMsg">${settings.url ? (S.syncErr?esc(S.syncErr):'') : 'ยังไม่ได้ตั้งค่า Google Sheet ข้อมูลเก็บในเครื่องนี้ไว้ก่อน'}</p>`;

  const fm=$('#expForm');
  fm.querySelectorAll('[data-cur]').forEach(b=>b.onclick=()=>{ f.cur=b.dataset.cur; fm.querySelectorAll('[data-cur]').forEach(x=>x.setAttribute('aria-pressed',x===b)); });
  ['ex-cat','ex-pay'].forEach(id=>$('#'+id).onclick=e=>{ const b=e.target.closest('[data-k]'); if(!b) return; f[id==='ex-cat'?'cat':'pay']=b.dataset.k; $('#'+id).querySelectorAll('[data-k]').forEach(x=>x.setAttribute('aria-pressed',x===b)); });
  fm.onsubmit = e=>{ e.preventDefault(); const amt=parseFloat($('#ex-amt').value); if(!(amt>0)){ toast('ใส่จำนวนเงินก่อน'); return; }
    const x={ id:'x'+Date.now().toString(36)+Math.random().toString(36).slice(2,6), ts:Date.now(), day:S.day, amount:amt, cur:f.cur, cat:f.cat, pay:f.pay,
      note:$('#ex-note').value.trim(), lat:S.pos?+S.pos.lat.toFixed(6):'', lng:S.pos?+S.pos.lng.toFixed(6):'', synced:false };
    expenses.push(x); save('jt.exp',expenses); toast('บันทึกแล้ว '+(f.cur==='JPY'?yen(amt):baht(amt))); renderExp(); renderStatus(); sync(); };
  $('#expPad').onclick = e=>{ const t=e.target;
    if(t.dataset.del){ S.delAsk=t.dataset.del; renderExp(); }
    else if(t.hasAttribute('data-delno')){ S.delAsk=null; renderExp(); }
    else if(t.dataset.delyes){ const id=t.dataset.delyes; const x=expenses.find(e=>e.id===id); expenses=expenses.filter(e=>e.id!==id); if(x&&x.synced){ pendingDel.push(id); save('jt.del',pendingDel); }
      save('jt.exp',expenses); S.delAsk=null; renderExp(); renderStatus(); sync(); }
  };
  $('#syncNow').onclick=()=>sync(true); $('#pullNow').onclick=pull;
}

/* ============ SYNC (Google Apps Script) ============ */
async function post(body){
  const r = await fetch(settings.url,{method:'POST', body:JSON.stringify(Object.assign({key:settings.key},body))}); // text/plain → no CORS preflight
  const j = await r.json(); if(!j.ok) throw new Error(j.error||'ผิดพลาด'); return j;
}
async function sync(manual){
  if(!settings.url || S.syncing) { if(manual && !settings.url){ toast('ตั้งค่า URL ของ Google Sheet ก่อน'); go('set'); } return; }
  if(!navigator.onLine){ if(manual) toast('ออฟไลน์อยู่ จะซิงก์เมื่อมีเน็ต'); return; }
  const up = expenses.filter(x=>!x.synced);
  if(!up.length && !pendingDel.length && !locQ.length){ if(manual) toast('ข้อมูลตรงกับ Sheet แล้ว'); S.syncErr=''; renderStatus(); return; }
  S.syncing=true; S.syncErr=''; renderStatus();
  try{
    if(up.length){ await post({action:'upsert', items:up.map(x=>({id:x.id, ts:x.ts, day:x.day, amount:x.amount, cur:x.cur,
        thb:Math.round((x.cur==='JPY'? x.amount*(settings.rate||0.22) : x.amount)*100)/100, cat:lab(EXC,x.cat), pay:lab(PAY,x.pay), note:x.note, lat:x.lat, lng:x.lng}))});
      const ids=new Set(up.map(x=>x.id)); expenses.forEach(x=>{ if(ids.has(x.id)) x.synced=true; }); save('jt.exp',expenses); }
    if(pendingDel.length){ await post({action:'delete', ids:pendingDel}); pendingDel=[]; save('jt.del',pendingDel); }
    if(locQ.length){ const q=locQ.slice(); await post({action:'loc', items:q}); locQ=locQ.slice(q.length); save('jt.locq',locQ); }
    if(manual) toast('ซิงก์กับ Google Sheet แล้ว');
  }catch(err){ S.syncErr='ซิงก์ไม่สำเร็จ: '+(err.message||err)+' — ตรวจ URL / สิทธิ์ "ทุกคน" ในการ Deploy'; if(manual) toast('ซิงก์ไม่สำเร็จ'); }
  S.syncing=false; renderStatus(); if(S.tab==='exp') renderExp();
}
async function pull(){
  if(!settings.url){ toast('ตั้งค่า URL ก่อน'); go('set'); return; }
  try{ const r=await fetch(settings.url + (settings.url.includes('?')?'&':'?') + 'key=' + encodeURIComponent(settings.key)); const j=await r.json(); if(!j.ok) throw new Error(j.error);
    const have=new Set(expenses.map(x=>x.id)); let n=0;
    j.items.forEach(it=>{ if(!it.id || have.has(it.id) || pendingDel.includes(it.id)) return; n++;
      expenses.push({id:it.id, ts:it.ts||Date.now(), day:+it.day||1, amount:+it.amount, cur:it.cur==='THB'?'THB':'JPY', cat:keyOf(EXC,it.cat), pay:keyOf(PAY,it.pay), note:it.note||'', lat:it.lat||'', lng:it.lng||'', synced:true}); });
    save('jt.exp',expenses); toast(n ? `ดึงมา ${n} รายการ` : 'ไม่มีรายการใหม่ใน Sheet'); renderExp(); renderStatus();
  }catch(err){ toast('ดึงข้อมูลไม่สำเร็จ'); }
}
window.addEventListener('online',()=>sync());
setInterval(()=>sync(),60000);

/* ============ SETTINGS ============ */
function renderSet(){
  const code = $('#gsCode').textContent.trim();
  $('#setPad').innerHTML = `
    <h2>ตั้งค่า</h2>
    <div class="card" style="display:flex;flex-direction:column;gap:12px">
      <h3>ทริป</h3>
      <div class="row2"><div class="field"><label for="s-start">วันแรกของทริป</label><input id="s-start" type="date" value="${esc(settings.start)}"><span class="hint">เลือกวันอัตโนมัติ + ไฮไลต์จุดตามเวลา</span></div>
        <div class="field"><label for="s-rate">เรท 1 เยน = ? บาท</label><input id="s-rate" type="number" step="0.0001" inputmode="decimal" value="${settings.rate}"><span class="hint">อัปเดตตามเรทจริงก่อนเดินทาง</span></div></div>
      <div class="field"><label for="s-bud">งบทั้งทริป (บาท)</label><input id="s-bud" type="number" inputmode="numeric" value="${settings.budget||''}" placeholder="เช่น 30000"></div>
    </div>
    <div class="card" style="display:flex;flex-direction:column;gap:12px">
      <h3>ตำแหน่ง</h3>
      <div class="switch"><div><b style="font-size:14px">ส่งตำแหน่งลง Sheet</b><div class="hint" style="font-size:12px;color:var(--muted)">บันทึกลงแท็บ Locations ระหว่างที่แอปเปิดอยู่</div></div><input id="s-log" type="checkbox" ${settings.logLoc?'checked':''}></div>
      <div class="field"><label for="s-min">ส่งทุกกี่นาที</label><select id="s-min">${[5,10,15,30].map(m=>`<option ${settings.logMin==m?'selected':''} value="${m}">${m} นาที</option>`).join('')}</select></div>
      <div class="switch"><div><b style="font-size:14px">กันหน้าจอดับ</b><div class="hint" style="font-size:12px;color:var(--muted)">เบราว์เซอร์หยุด GPS เมื่อจอดับ เปิดไว้ถ้าต้องการติดตามต่อเนื่อง (กินแบต)</div></div><input id="s-wake" type="checkbox" ${settings.wake?'checked':''}></div>
    </div>
    <div class="card" style="display:flex;flex-direction:column;gap:12px">
      <h3>เชื่อม Google Sheet</h3>
      <div class="field"><label for="s-url">Web app URL (ลงท้าย /exec)</label><input id="s-url" type="url" value="${esc(settings.url)}" placeholder="https://script.google.com/macros/s/…/exec"></div>
      <div class="field"><label for="s-key">รหัสลับ (ถ้าตั้งใน SECRET)</label><input id="s-key" type="password" value="${esc(settings.key)}"></div>
      <div class="ctrl"><button class="btn pri" type="button" id="s-save">บันทึกการตั้งค่า</button><button class="btn" type="button" id="s-test">ทดสอบการเชื่อมต่อ</button></div>
      <p class="msg" id="s-msg"></p>
      <ol class="steps">
        <li>สร้าง Google Sheet ใหม่ → เมนู <b>ส่วนขยาย → Apps Script</b></li>
        <li>ลบโค้ดเดิม วางโค้ดด้านล่าง แล้วกดบันทึก</li>
        <li><b>ทำให้ใช้งานได้ → การทำให้ใช้งานได้รายการใหม่</b> → ประเภท <b>เว็บแอป</b> · ดำเนินการในฐานะ <b>ฉัน</b> · ผู้มีสิทธิ์เข้าถึง <b>ทุกคน</b></li>
        <li>กดอนุญาตสิทธิ์ แล้วคัดลอก URL ที่ลงท้าย <b>/exec</b> มาวางด้านบน → ทดสอบ</li>
      </ol>
      <div class="ctrl" style="justify-content:space-between"><span class="label">Code.gs</span><button class="btn sm" type="button" id="s-copy">คัดลอกโค้ด</button></div>
      <pre class="code" id="s-code">${esc(code)}</pre>
    </div>
    <p class="sub">ข้อมูลทั้งหมดเก็บในเครื่องนี้ก่อนเสมอ ออฟไลน์ก็บันทึกได้ แล้วจะซิงก์เมื่อมีเน็ต · พิกัดสถานที่เป็นค่าประมาณ ปุ่ม "นำทาง" จะค้นชื่อจริงใน Google Maps</p>`;
  const saveSet=()=>{ settings.start=$('#s-start').value; settings.rate=parseFloat($('#s-rate').value)||0.22; settings.budget=parseFloat($('#s-bud').value)||0;
    settings.url=$('#s-url').value.trim(); settings.key=$('#s-key').value; settings.logLoc=$('#s-log').checked; settings.logMin=+$('#s-min').value; settings.wake=$('#s-wake').checked;
    save('jt.settings',settings); keepAwake(settings.wake && S.watchId!==null); const ad=autoDay(); if(ad) S.day=ad; renderDays(); renderStatus(); };
  ['s-start','s-rate','s-bud','s-url','s-key','s-log','s-min','s-wake'].forEach(id=>$('#'+id).addEventListener('change',saveSet));
  $('#s-save').onclick=()=>{ saveSet(); toast('บันทึกการตั้งค่าแล้ว'); sync(); };
  $('#s-test').onclick=async()=>{ saveSet(); const m=$('#s-msg'); if(!settings.url){ m.textContent='ใส่ URL ก่อน'; return; } m.textContent='กำลังทดสอบ…';
    try{ const r=await fetch(settings.url+(settings.url.includes('?')?'&':'?')+'key='+encodeURIComponent(settings.key)); const j=await r.json();
      m.textContent = j.ok ? `เชื่อมต่อสำเร็จ · ใน Sheet มี ${j.items.length} รายการ` : 'เชื่อมต่อได้แต่: '+j.error; if(j.ok) sync(); }
    catch(e){ m.textContent='เชื่อมต่อไม่ได้ — ตรวจว่า URL ลงท้าย /exec และตั้งสิทธิ์ "ทุกคน"'; } };
  $('#s-copy').onclick=async()=>{ try{ await navigator.clipboard.writeText(code); toast('คัดลอกโค้ดแล้ว'); }
    catch(e){ const r=document.createRange(); r.selectNodeContents($('#s-code')); const s=getSelection(); s.removeAllRanges(); s.addRange(r); toast('เลือกข้อความแล้ว กดคัดลอกเอง'); } };
}

/* ============ BOOT ============ */
if(!DAYS[S.day-1]) S.day=1;
S.anchor = (plan(S.day).stops.find(s=>!s.mv)||{}).id || 'gps';
go(['map','plan','near','exp','set'].includes(S.tab) ? S.tab : 'map');
renderDays(); renderStatus();
if(settings.gpsAuto) startGPS();
setInterval(()=>{ if(S.tab==='plan' && !S.editMode) renderPlan(); }, 60000);
sync();
</script>
</body>
</html>
