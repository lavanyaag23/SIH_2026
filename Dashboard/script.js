/* ============================================================
   DATA — mirrors the underlying planning model
   ============================================================ */
const ASSETS = [
  {job:"M001", asset:"Track A12",  risk:94, age:18, lastInsp:210, priority:"CRITICAL"},
  {job:"M002", asset:"Signal S07", risk:82, age:9,  lastInsp:45,  priority:"HIGH"},
  {job:"M003", asset:"OHE O21",    risk:68, age:12, lastInsp:90,  priority:"MEDIUM"},
  {job:"M004", asset:"Track B18",  risk:54, age:6,  lastInsp:30,  priority:"MEDIUM"},
  {job:"M005", asset:"Point P09",  risk:41, age:15, lastInsp:160, priority:"LOW"},
];

const BLOCKS = [
  {block:"B101", section:"A-B", start:"02:00", end:"04:00", success:91, impact:"LOW",    jobs:3},
  {block:"B102", section:"B-C", start:"01:00", end:"04:00", success:67, impact:"HIGH",   jobs:2},
  {block:"B103", section:"C-D", start:"03:00", end:"05:00", success:82, impact:"LOW",    jobs:3},
  {block:"B104", section:"D-E", start:"00:30", end:"03:30", success:76, impact:"MEDIUM", jobs:2},
];

const TIMELINE = [
  {task:"Train T101", start:"00:00", end:"01:30", type:"train"},
  {task:"Train T102", start:"02:00", end:"03:00", type:"train"},
  {task:"Train T205", start:"04:00", end:"05:30", type:"train"},
  {task:"Track Maintenance", start:"02:00", end:"04:00", type:"maint"},
  {task:"S&T Inspection",    start:"02:00", end:"03:00", type:"maint"},
  {task:"OHE Inspection",    start:"03:00", end:"04:00", type:"maint"},
];

const WEEKLY = [
  {day:"MON", time:"02–04 AM", section:"A-B", status:"ok"},
  {day:"TUE", time:"01–04 AM", section:"C-D", status:"ok"},
  {day:"WED", time:"02–03 AM", section:"B-C", status:"rev"},
  {day:"THU", time:"00–03 AM", section:"A-D", status:"conf"},
  {day:"FRI", time:"01–04 AM", section:"D-E", status:"ok"},
];

const IMPACT_PENALTY = {LOW:10, MEDIUM:40, HIGH:70};
const STATUS_LABEL = {ok:"Optimal", rev:"Review", conf:"Conflict"};
const STATUS_ICON = {ok:"🟢", rev:"🟡", conf:"🔴"};

/* ============================================================
   CORE LOGIC — explainable scoring + real conflict detection
   ============================================================ */
function toMinutes(t){ const [h,m] = t.split(":").map(Number); return h*60+m; }

function durationHrs(start,end){
  let s = toMinutes(start), e = toMinutes(end);
  if(e < s) e += 24*60; // overnight wrap
  return (e-s)/60;
}

function detectConflicts(timeline){
  const trains = timeline.filter(t=>t.type==="train");
  const maint  = timeline.filter(t=>t.type==="maint");
  const out = [];
  trains.forEach(t=>{
    maint.forEach(m=>{
      const s = Math.max(toMinutes(t.start), toMinutes(m.start));
      const e = Math.min(toMinutes(t.end), toMinutes(m.end));
      const overlap = e - s;
      if(overlap > 0){
        let sev = overlap>=60 ? "HIGH" : overlap>=20 ? "MEDIUM" : "LOW";
        out.push({maint:m.task, train:t.task, overlap, sev});
      }
    });
  });
  return out;
}

function scoreBlocks(blocks, w={success:.45, impact:.30, jobs:.25}){
  const maxJobs = Math.max(...blocks.map(b=>b.jobs));
  return blocks.map(b=>{
    const impactScore = 100 - IMPACT_PENALTY[b.impact];
    const jobsScore = Math.round((b.jobs/maxJobs)*1000)/10;
    const final = Math.round((b.success*w.success + impactScore*w.impact + jobsScore*w.jobs)*10)/10;
    return {...b, impactScore, jobsScore, final, duration: durationHrs(b.start,b.end), time: b.start+"–"+b.end};
  }).sort((a,b)=>b.final-a.final);
}

function computeKpis(assets, blocks, conflicts){
  const avgRisk = assets.reduce((s,a)=>s+a.risk,0)/assets.length;
  return {
    availability: Math.round((100 - avgRisk*0.3)*10)/10,
    critical: assets.filter(a=>a.priority==="CRITICAL").length,
    pending: assets.length,
    highPriority: assets.filter(a=>a.priority==="CRITICAL"||a.priority==="HIGH").length,
    windows: blocks.length,
    conflictCount: conflicts.length,
  };
}

const conflicts = detectConflicts(TIMELINE);
const scoredBlocks = scoreBlocks(BLOCKS);
const bestBlock = scoredBlocks[0];
const kpis = computeKpis(ASSETS, BLOCKS, conflicts);

/* approved log — persisted locally */
let approvedLog = JSON.parse(localStorage.getItem("blockplanner_log") || "[]");
function pushLog(entry){
  approvedLog.push(entry);
  localStorage.setItem("blockplanner_log", JSON.stringify(approvedLog));
  renderLog();
}
function renderLog(){
  const panel = document.getElementById("logPanel");
  const list = document.getElementById("logList");
  if(approvedLog.length===0){ panel.style.display="none"; return; }
  panel.style.display="block";
  list.innerHTML = approvedLog.slice(-6).reverse().map(e=>`<div class="log-entry">${e}</div>`).join("");
}

/* ============================================================
   NAV
   ============================================================ */
document.querySelectorAll(".rail-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".rail-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    const target = btn.dataset.page;
    document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
    document.getElementById("page-"+target).classList.add("active");
  });
});

/* clock */
function tickClock(){
  const d = new Date();
  document.getElementById("clockText").textContent = d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
}
tickClock(); setInterval(tickClock, 1000*30);

/* ============================================================
   RENDER: Command Center
   ============================================================ */
function sectionStatusFromBlock(b){
  if(b.impact==="HIGH") return "conf";
  if(b.impact==="MEDIUM") return "rev";
  return "ok";
}
const STATUS_COLOR = {ok:"#1f9d55", rev:"#b9770e", conf:"#d92b2b"};

function renderTrack(){
  const stations = ["A","B","C","D","E"];
  const svg = document.getElementById("trackSvg");
  const n = stations.length;
  const pad = 60, w = 900, usable = w - pad*2;
  const xs = stations.map((_,i)=> pad + (usable/(n-1))*i );
  const y = 55;
  let html = "";
  for(let i=0;i<n-1;i++){
    const sec = stations[i]+"-"+stations[i+1];
    const blockForSec = BLOCKS.find(b=>b.section===sec);
    const status = blockForSec ? sectionStatusFromBlock(blockForSec) : "ok";
    const color = STATUS_COLOR[status];
    const glow = status==="conf" ? `<animate attributeName="opacity" values="1;0.5;1" dur="1.8s" repeatCount="indefinite"/>` : "";
    html += `<line x1="${xs[i]}" y1="${y}" x2="${xs[i+1]}" y2="${y}" stroke="${color}" stroke-width="7" stroke-linecap="round">${glow}</line>`;
  }
  stations.forEach((s,i)=>{
    html += `<circle cx="${xs[i]}" cy="${y}" r="17" fill="#ffffff" stroke="#c7ccd4" stroke-width="2"/>`;
    html += `<text x="${xs[i]}" y="${y+5}" text-anchor="middle" fill="#1a1f27" font-size="14" font-weight="700" font-family="Space Grotesk">${s}</text>`;
  });
  svg.innerHTML = html;

  const sel = document.getElementById("sectionSelect");
  sel.innerHTML = BLOCKS.map(b=>`<option value="${b.section}">${b.section}</option>`).join("");
  sel.addEventListener("change", ()=>renderSectionDetail(sel.value));
  renderSectionDetail(BLOCKS[0].section);
}
function renderSectionDetail(section){
  const b = BLOCKS.find(x=>x.section===section);
  document.getElementById("sectionDetail").innerHTML =
    `<b>${b.section}</b> · Window ${b.start}–${b.end} · ${b.jobs} jobs · Train impact <b>${b.impact}</b>`;
}

function renderKpis(){
  const el = document.getElementById("kpiStrip");
  const items = [
    {t:"ASSET AVAILABILITY", v:kpis.availability+"%", s:"Derived from live risk index", lead:true},
    {t:"CRITICAL ASSETS", v:String(kpis.critical).padStart(2,"0"), s:"Requires attention", warn:true},
    {t:"PENDING JOBS", v:String(kpis.pending).padStart(2,"0"), s:kpis.highPriority+" high priority"},
    {t:"AVAILABLE WINDOWS", v:String(kpis.windows).padStart(2,"0"), s:"Next 7 days"},
    {t:"TRAIN CONFLICTS", v:String(kpis.conflictCount).padStart(2,"0"), s:"Live timeline overlap", bad: kpis.conflictCount>0},
  ];
  el.innerHTML = items.map(k=>`
    <div class="kpi ${k.lead?'lead':''}">
      <div class="kpi-t">${k.t}</div>
      <div class="kpi-v">${k.v}</div>
      <div class="kpi-s ${k.warn?'warn':''} ${k.bad?'bad':''}">${k.s}</div>
    </div>`).join("");
}

function renderReadout(){
  const b = bestBlock;
  document.getElementById("readoutPanel").innerHTML = `
    <div class="readout-top">
      <div class="readout-sec">Section ${b.section}</div>
      <div class="readout-time">${b.time} · ${b.duration.toFixed(1)} hrs</div>
    </div>
    <div class="readout-stats">
      <div class="rstat"><div class="rl">SUCCESS</div><div class="rv green">${b.success}%</div></div>
      <div class="rstat"><div class="rl">TRAIN IMPACT</div><div class="rv">${b.impact}</div></div>
      <div class="rstat"><div class="rl">JOBS</div><div class="rv">${b.jobs}</div></div>
      <div class="rstat"><div class="rl">AI SCORE</div><div class="rv">${b.final}/100</div></div>
    </div>
    <div class="score-row"><div class="score-label">Historical success</div><div class="score-track"><div class="score-fill" style="width:${b.success}%"></div></div><div class="score-val">${b.success}</div></div>
    <div class="score-row"><div class="score-label">Train-impact score</div><div class="score-track"><div class="score-fill" style="width:${b.impactScore}%"></div></div><div class="score-val">${b.impactScore}</div></div>
    <div class="score-row"><div class="score-label">Job coverage score</div><div class="score-track"><div class="score-fill" style="width:${b.jobsScore}%"></div></div><div class="score-val">${b.jobsScore}</div></div>
    <div class="formula">Final Score = 0.45 × Success + 0.30 × ImpactScore + 0.25 × JobsScore</div>
    <div class="btnrow">
      <button class="btn primary" id="approveBtn">✅ Approve block</button>
      <button class="btn" id="modifyBtn">✏️ Modify</button>
    </div>
    <div class="modify-panel" id="modifyPanel">
      <label>New start time</label>
      <input type="text" id="modStart" value="${b.start}">
      <label>New end time</label>
      <input type="text" id="modEnd" value="${b.end}">
      <button class="btn primary" id="saveModify" style="width:100%;">Save changes</button>
    </div>
  `;
  document.getElementById("approveBtn").addEventListener("click", ()=>{
    const t = new Date().toLocaleTimeString();
    pushLog(`${b.block} (${b.section}, ${b.time}) approved at ${t}`);
  });
  document.getElementById("modifyBtn").addEventListener("click", ()=>{
    document.getElementById("modifyPanel").classList.toggle("open");
  });
  document.getElementById("saveModify").addEventListener("click", ()=>{
    const s = document.getElementById("modStart").value;
    const e = document.getElementById("modEnd").value;
    document.getElementById("modifyPanel").classList.remove("open");
    alert(`Block window updated to ${s}–${e} (pending re-optimization).`);
  });
}

function renderConflicts(){
  const el = document.getElementById("conflictList");
  if(conflicts.length===0){ el.innerHTML = `<p class="empty-note">No overlapping train/maintenance windows detected.</p>`; return; }
  const icon = {HIGH:"🔴",MEDIUM:"🟠",LOW:"🟡"};
  el.innerHTML = conflicts.map(c=>`
    <div class="conflict-item ${c.sev==='MEDIUM'?'med':c.sev==='LOW'?'low':''}">
      <b>${c.maint}</b> ↔ <b>${c.train}</b> &nbsp; ${icon[c.sev]} ${c.sev}
      <span class="cm">${c.overlap} min overlap</span>
    </div>`).join("");
}

function renderGantt(){
  const el = document.getElementById("ganttChart");
  const allTimes = TIMELINE.flatMap(t=>[toMinutes(t.start), toMinutes(t.end)]);
  const min = Math.min(...allTimes), max = Math.max(...allTimes);
  const span = max-min;
  let html = "";
  TIMELINE.forEach(t=>{
    const left = ((toMinutes(t.start)-min)/span)*100;
    const width = ((toMinutes(t.end)-toMinutes(t.start))/span)*100;
    html += `<div class="gantt-row">
      <div class="gantt-label">${t.task}</div>
      <div class="gantt-track">
        <div class="gantt-bar ${t.type}" style="left:${left}%; width:${width}%;" title="${t.task} ${t.start}-${t.end}"></div>
      </div>
    </div>`;
  });
  html += `<div class="gantt-axis"><span>00:00</span><span>02:00</span><span>04:00</span><span>06:00</span></div>`;
  el.innerHTML = html;
}

function assetRowsHtml(assets){
  return assets.map(a=>`
    <tr>
      <td>${a.job}</td><td style="font-family:'Space Grotesk';">${a.asset}</td>
      <td><div class="barcell">${a.risk}<div class="bt"><div class="bf" style="width:${a.risk}%"></div></div></div></td>
      <td><span class="tag ${a.priority}">${a.priority}</span></td>
    </tr>`).join("");
}
function renderAssetTable(){
  const el = document.getElementById("assetTable");
  el.innerHTML = `<tr><th>Job</th><th>Asset</th><th>Risk</th><th>Priority</th></tr>${assetRowsHtml(ASSETS)}`;
}

function renderWeekly(){
  const el = document.getElementById("weeklyList");
  el.innerHTML = WEEKLY.map(w=>`
    <div class="weekly-row">
      <span class="day">${w.day}</span>
      <span class="time">${w.time}</span>
      <span class="sec">${w.section}</span>
      <span class="wstatus ${w.status}">${STATUS_ICON[w.status]} ${STATUS_LABEL[w.status]}</span>
    </div>`).join("");
}
document.getElementById("exportCsv").addEventListener("click", ()=>{
  const rows = [["Day","Time","Section","Status"], ...WEEKLY.map(w=>[w.day,w.time,w.section,STATUS_LABEL[w.status]])];
  const csv = rows.map(r=>r.join(",")).join("\n");
  const blob = new Blob([csv], {type:"text/csv"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "weekly_block_plan.csv";
  a.click();
});

/* ============================================================
   RENDER: Block Planning page
   ============================================================ */
function renderBlockTable(){
  const el = document.getElementById("blockTable");
  el.innerHTML = `<tr><th>Block</th><th>Section</th><th>Time</th><th>Hrs</th><th>Success</th><th>Impact</th><th>Jobs</th></tr>` +
    scoredBlocks.map(b=>`<tr>
      <td>${b.block}</td><td>${b.section}</td><td>${b.time}</td><td>${b.duration.toFixed(1)}</td>
      <td>${b.success}%</td><td><span class="tag ${b.impact}">${b.impact}</span></td><td>${b.jobs}</td>
    </tr>`).join("");
}

function runPlanner(){
  const maxDur = Number(document.getElementById("durSlider").value);
  const tolerance = document.getElementById("toleranceSelect").value;
  const minJobs = Number(document.getElementById("minJobs").value);
  const rank = {LOW:0, MEDIUM:1, HIGH:2};

  const eligible = BLOCKS.filter(b =>
    b.jobs >= minJobs &&
    durationHrs(b.start,b.end) <= maxDur &&
    rank[b.impact] <= rank[tolerance]
  );

  const el = document.getElementById("planResult");
  if(eligible.length===0){
    el.innerHTML = `<div class="banner err">No block windows match these criteria. Try relaxing duration, tolerance, or job count.</div>`;
    return;
  }
  const ranked = scoreBlocks(eligible);
  const best = ranked[0];
  el.innerHTML = `
    <div class="banner ok">Optimal block generated — ${ranked.length} window(s) matched your criteria.</div>
    <div class="readout-sec" style="margin-bottom:6px;">🚆 Recommended: ${best.block}</div>
    <div style="font-size:13px; line-height:1.9; color:var(--dim);" class="mono">
      Section: <b style="color:var(--text)">${best.section}</b><br>
      Time: <b style="color:var(--text)">${best.time}</b><br>
      Success Probability: <b style="color:var(--text)">${best.success}%</b><br>
      Train Impact: <b style="color:var(--text)">${best.impact}</b><br>
      Maintenance Jobs: <b style="color:var(--text)">${best.jobs}</b><br>
      AI Composite Score: <b style="color:var(--brass)">${best.final}/100</b>
    </div>
    <div class="score-track" style="margin-top:12px; height:8px;"><div class="score-fill" style="width:${best.success}%"></div></div>
    <details open style="margin-top:16px;">
      <summary>See all ranked candidates</summary>
      <table style="margin-top:8px;">
        <tr><th>Block</th><th>Section</th><th>Time</th><th>Success</th><th>Impact Score</th><th>Jobs Score</th><th>Final</th></tr>
        ${ranked.map(b=>`<tr><td>${b.block}</td><td>${b.section}</td><td>${b.time}</td><td>${b.success}%</td><td>${b.impactScore}</td><td>${b.jobsScore}</td><td><b>${b.final}</b></td></tr>`).join("")}
      </table>
    </details>
  `;
}
["durSlider","toleranceSelect","minJobs"].forEach(id=>{
  document.getElementById(id).addEventListener("input", ()=>{
    document.getElementById("durVal").textContent = document.getElementById("durSlider").value+"h";
    runPlanner();
  });
});

/* ============================================================
   RENDER: Asset Priority page
   ============================================================ */
let activePriorities = new Set(ASSETS.map(a=>a.priority));
function renderPriorityFilters(){
  const el = document.getElementById("priorityFilters");
  const priorities = [...new Set(ASSETS.map(a=>a.priority))];
  el.innerHTML = priorities.map(p=>`<button class="btn" data-p="${p}" style="flex:none; padding:7px 13px;">${p}</button>`).join("");
  el.querySelectorAll("button").forEach(btn=>{
    const p = btn.dataset.p;
    updateFilterBtnStyle(btn, activePriorities.has(p));
    btn.addEventListener("click", ()=>{
      if(activePriorities.has(p)) activePriorities.delete(p); else activePriorities.add(p);
      updateFilterBtnStyle(btn, activePriorities.has(p));
      renderAssetPage();
    });
  });
}
function updateFilterBtnStyle(btn, on){
  btn.style.background = on ? "var(--brass)" : "var(--panel-alt)";
  btn.style.color = on ? "#1a1108" : "var(--text)";
  btn.style.borderColor = on ? "var(--brass)" : "var(--border-soft)";
}

function renderAssetPage(){
  const filtered = ASSETS.filter(a=>activePriorities.has(a.priority));
  document.getElementById("assetTable2").innerHTML =
    `<tr><th>Job</th><th>Asset</th><th>Risk</th><th>Priority</th></tr>${assetRowsHtml(filtered)}`;

  const chartEl = document.getElementById("riskChart");
  chartEl.innerHTML = filtered.map(a=>`
    <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px; font-size:12px;">
      <div style="width:90px; color:var(--dim);">${a.asset}</div>
      <div style="flex:1; background:#0d1218; height:14px; border-radius:4px; overflow:hidden; border:1px solid var(--border);">
        <div style="height:100%; width:${a.risk}%; background:linear-gradient(90deg,${a.priority==='CRITICAL'?'#d92b2b':a.priority==='HIGH'?'#b9770e':a.priority==='MEDIUM'?'#a5720f':'#1f9d55'},#5fc98a00);"></div>
      </div>
      <div class="mono" style="width:34px; text-align:right;">${a.risk}%</div>
    </div>`).join("");

  const sel = document.getElementById("assetSelect");
  sel.innerHTML = filtered.map(a=>`<option value="${a.asset}">${a.asset}</option>`).join("");
  sel.onchange = ()=>renderAssetDetail(sel.value);
  if(filtered.length) renderAssetDetail(filtered[0].asset);
  else document.getElementById("assetDetail").innerHTML = "";
}
function renderAssetDetail(name){
  const a = ASSETS.find(x=>x.asset===name);
  if(!a) return;
  document.getElementById("assetDetail").innerHTML = `
    <div class="kpi"><div class="kpi-t">RISK SCORE</div><div class="kpi-v">${a.risk}%</div></div>
    <div class="kpi"><div class="kpi-t">PRIORITY</div><div class="kpi-v" style="font-size:18px;">${a.priority}</div></div>
    <div class="kpi"><div class="kpi-t">AGE</div><div class="kpi-v">${a.age}y</div></div>
  `;
}

/* ============================================================
   RENDER: What-if page
   ============================================================ */
function runSimulation(){
  const dur = Number(document.getElementById("simDur").value);
  const conf = Number(document.getElementById("simConf").value);
  const machine = document.getElementById("simMachine").checked;
  const crew = document.getElementById("simCrew").checked;

  document.getElementById("simDurVal").textContent = dur+"h";
  document.getElementById("simConfVal").textContent = conf;

  let success = 95;
  const durPenalty = (3-dur)*-12;
  const confPenalty = conf*-8;
  const machinePenalty = machine ? 0 : -15;
  const crewPenalty = crew ? 0 : -10;
  success += durPenalty + confPenalty + machinePenalty + crewPenalty;
  success = Math.max(20, Math.min(98, success));

  const impact = conf<=1 ? "LOW" : conf<=3 ? "MEDIUM" : "HIGH";
  const decision = success>=80 ? "RECOMMENDED" : success>=60 ? "REVIEW" : "NOT RECOMMENDED";

  document.getElementById("simResultStrip").innerHTML = `
    <div class="kpi"><div class="kpi-t">BLOCK SUCCESS</div><div class="kpi-v">${success}%</div></div>
    <div class="kpi"><div class="kpi-t">TRAIN IMPACT</div><div class="kpi-v" style="font-size:18px;">${impact}</div></div>
    <div class="kpi"><div class="kpi-t">AI DECISION</div><div class="kpi-v" style="font-size:15px;">${decision}</div></div>
  `;
  document.getElementById("simProgress").style.width = success+"%";

  const bannerCls = success>=80?"go":success>=60?"review":"no";
  const bannerMsg = success>=80 ? "AI recommends this block configuration."
    : success>=60 ? "AI recommends reviewing the block before approval."
    : "AI recommends selecting an alternative block.";
  const el = document.getElementById("simDecision");
  el.className = "decision-banner "+bannerCls;
  el.textContent = bannerMsg;

  const factors = [
    {l:"Duration", v:durPenalty},
    {l:"Conflicts", v:confPenalty},
    {l:"Machine", v:machinePenalty},
    {l:"Crew", v:crewPenalty},
  ];
  const maxAbs = Math.max(1, ...factors.map(f=>Math.abs(f.v)));
  document.getElementById("sensChart").innerHTML = factors.map(f=>{
    const pct = (Math.abs(f.v)/maxAbs)*50;
    const color = f.v<0 ? "#d92b2b" : "#1f9d55";
    const side = f.v<0 ? `left:50%; width:${pct}%;` : `right:50%; width:${pct}%;`;
    return `<div class="sens-bar-row">
      <div class="sens-label">${f.l}</div>
      <div class="sens-track"><div class="sens-fill" style="${side} background:${color};"></div></div>
      <div class="mono" style="width:34px; text-align:right;">${f.v}</div>
    </div>`;
  }).join("");
}
["simDur","simConf","simMachine","simCrew"].forEach(id=>{
  document.getElementById(id).addEventListener("input", runSimulation);
  document.getElementById(id).addEventListener("change", runSimulation);
});

/* ============================================================
   RENDER: Recovery page
   ============================================================ */
function runRecovery(){
  const planned = Number(document.getElementById("plannedHrs").value);
  const actual = Number(document.getElementById("actualHrs").value);
  const lost = Math.max(0, planned-actual);
  const el = document.getElementById("recoveryOutput");

  if(lost<=0){
    el.innerHTML = `
      <div class="kpi" style="margin:16px 0;"><div class="kpi-t">LOST MAINTENANCE OPPORTUNITY</div><div class="kpi-v">0.0 hours</div></div>
      <div class="banner ok" style="border-style:solid;">No recovery required. Planned maintenance was completed.</div>`;
    return;
  }

  let recovery = [
    {day:"Wednesday", window:"02:00–03:30", impact:"LOW", score:94},
    {day:"Thursday",  window:"01:00–02:30", impact:"MEDIUM", score:78},
    {day:"Friday",    window:"03:00–04:30", impact:"LOW", score:87},
  ].map(r=>({...r, score: Math.max(10, Math.round(r.score - Math.min(20, lost*3)))}))
   .sort((a,b)=>b.score-a.score);

  const best = recovery[0];

  el.innerHTML = `
    <div class="kpi" style="margin:16px 0;"><div class="kpi-t">LOST MAINTENANCE OPPORTUNITY</div><div class="kpi-v">${lost.toFixed(1)} hours</div></div>
    <div class="banner err" style="border-style:solid;">${lost.toFixed(1)} hours of planned maintenance was not completed.</div>
    <h3 style="margin:16px 0 10px;">🤖 AI Recovery Recommendation</h3>
    <table>
      <tr><th>Day</th><th>Window</th><th>Train Impact</th><th>Recovery Score</th></tr>
      ${recovery.map(r=>`<tr><td>${r.day}</td><td>${r.window}</td><td><span class="tag ${r.impact}">${r.impact}</span></td><td>${r.score}%</td></tr>`).join("")}
    </table>
    <div class="banner ok" style="margin-top:14px; border-style:solid;">Recommended Recovery: ${best.day} ${best.window} | Recovery Score: ${best.score}%</div>
    <button class="btn primary" id="acceptRecovery" style="margin-top:10px; width:100%;">✅ Accept recovery plan</button>
  `;
  document.getElementById("acceptRecovery").addEventListener("click", ()=>{
    pushLog(`Recovery: ${best.day} ${best.window} accepted at ${new Date().toLocaleTimeString()}`);
    alert("Recovery window added to the proposed block plan.");
  });
}
["plannedHrs","actualHrs"].forEach(id=>{
  document.getElementById(id).addEventListener("input", runRecovery);
});

/* ============================================================
   INIT
   ============================================================ */
renderTrack();
renderKpis();
renderReadout();
renderConflicts();
renderGantt();
renderAssetTable();
renderWeekly();
renderLog();
renderBlockTable();
runPlanner();
renderPriorityFilters();
renderAssetPage();
runSimulation();
runRecovery();