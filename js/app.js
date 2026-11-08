(function(){
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const k = n => (n<0?"−":"") + "$" + (Math.abs(n)>=1e6 ? (Math.abs(n)/1e6).toFixed(2)+"m" : Math.round(Math.abs(n)/1000)+"k");

  /* ---------- routing ---------- */
  const VIEWS = ["home","plan","theory","model","about"];
  function route(){
    const v = VIEWS.includes(location.hash.slice(1)) ? location.hash.slice(1) : "home";
    VIEWS.forEach(n => $("#v-"+n).hidden = n!==v);
    $$("nav.menu a").forEach(a => a.dataset.v===v ? a.setAttribute("aria-current","page") : a.removeAttribute("aria-current"));
    window.scrollTo(0,0);
    requestAnimationFrame(drawContours);
  }
  addEventListener("hashchange", route);

  /* ---------- topographic contours (fallback for missing photos) ---------- */
  function noise(seed){
    const p = []; let s = seed*9301+49297;
    const r = ()=> (s = (s*9301+49297)%233280)/233280;
    const blobs = Array.from({length:7},()=>({x:r(),y:r(),a:.6+r(),sx:.15+r()*.35,sy:.15+r()*.35}));
    return (x,y)=> blobs.reduce((t,b)=>t + b.a*Math.exp(-(((x-b.x)/b.sx)**2+((y-b.y)/b.sy)**2)),0) + .15*Math.sin(x*9+seed)*Math.cos(y*7-seed);
  }
  function drawContours(){
    $$("canvas.contours").forEach(c=>{
      if (!c.offsetParent || c.dataset.done==="1" && c.width===Math.round(c.clientWidth*devicePixelRatio)) return;
      const W = c.width = Math.round(c.clientWidth*devicePixelRatio), H = c.height = Math.round(c.clientHeight*devicePixelRatio);
      if (!W||!H) return;
      const ctx = c.getContext("2d"), f = noise(+c.dataset.seed||1), N = 90, M = Math.round(N*H/W)||1;
      const hero = c.closest(".hero");
      ctx.fillStyle = hero ? "#1d2a22" : css("--tint"); ctx.fillRect(0,0,W,H);
      const grid = []; for(let j=0;j<=M;j++){grid[j]=[];for(let i=0;i<=N;i++)grid[j][i]=f(i/N,j/M*H/W);}
      ctx.lineWidth = Math.max(1,devicePixelRatio*.8);
      for(let lvl=0;lvl<22;lvl++){
        const t = .05+lvl*.09; const major = lvl%5===0;
        ctx.strokeStyle = hero ? `rgba(214,190,130,${major?.42:.2})` : (major? css("--gold") : css("--rule"));
        ctx.beginPath();
        for(let j=0;j<M;j++)for(let i=0;i<N;i++){
          const a=grid[j][i],b=grid[j][i+1],cc=grid[j+1][i+1],d=grid[j+1][i];
          const pts=[]; const e=(v1,v2,x1,y1,x2,y2)=>{ if((v1<t)!==(v2<t)){const u=(t-v1)/(v2-v1);pts.push([x1+(x2-x1)*u,y1+(y2-y1)*u]);} };
          e(a,b,i,j,i+1,j); e(b,cc,i+1,j,i+1,j+1); e(cc,d,i+1,j+1,i,j+1); e(d,a,i,j+1,i,j);
          for(let q=0;q+1<pts.length;q+=2){ctx.moveTo(pts[q][0]/N*W,pts[q][1]/M*H);ctx.lineTo(pts[q+1][0]/N*W,pts[q+1][1]/M*H);}
        }
        ctx.stroke();
      }
      c.dataset.done="1";
    });
  }
  addEventListener("resize", ()=>{ $$("canvas.contours").forEach(c=>c.dataset.done="0"); drawContours(); });

  /* ---------- photos: shown only if the file exists ---------- */
  $$("img[data-photo]").forEach(img=>{
    const probe = new Image();
    probe.onload = ()=>{ img.src = img.dataset.photo; img.hidden = false;
      const sib = img.parentElement.querySelector("canvas.contours, span"); if (sib) sib.hidden = true;
      const cr = img.closest(".hero")?.querySelector("[data-credit]"); if (cr) cr.hidden = false; };
    probe.src = img.dataset.photo;
  });

  /* ---------- theory of change ---------- */
  const CAP = {grant:["Grant","--acacia"],loan:["Concessional loan","--sky"],rev:["Own revenue","--gold"],out:["Outcome payment","--clay"]};
  const IMPACT = "A restored landscape where wildlife, livestock and people thrive, run by a conservancy that pays its own way.";
  const STREAMS = [
    {id:"grazing",name:"Regenerative grazing",c:"--acacia",
     p:["Degraded rangeland and invasive cactus; cattle and wildlife compete for grass.","Holistic grazing plan, rotating herds, mentoring local grazing managers.","Land under planned grazing; managers trained.","Grass and soil recover, water holds better, livestock income rises.",IMPACT],
     f:[null,["grant","Training and baseline soil and vegetation surveys"],["loan","Fencing and water points"],["rev","Meat and dairy sales"],["out","Carbon credits from measured soil gains"]],
     m:["Biomass estimates","Soil health index","Groundwater levels","Vegetation regrowth"],
     a:["Rainfall within the normal range","Local herders take part","Buyers for meat and dairy"],
     i:"The grant-funded baseline survey in Year 0 is what makes carbon credits possible later. One source of money unlocks the next."},
    {id:"tourism",name:"Eco & research tourism",c:"--sky",
     p:["Income relies on standard tourism, and few local people share in its value.","Build low-impact camps; train local guides, especially women and youth; partner with Mpala.","Camps open; guides trained; research partnerships signed.","Steady visitor income; local jobs; a name for research tourism.",IMPACT],
     f:[null,["grant","Guide and hospitality training"],["loan","Camp infrastructure"],["rev","Guest nights and conservation fees"],null],
     m:["Guest nights","Share of local, women and youth staff","Research groups hosted"],
     a:["Travel demand stays stable","Road access and security hold","Partners send students and researchers"],
     i:"Training cannot repay a loan, but camps can. Keeping grants for people and loans for assets is what makes the plan financeable."},
    {id:"opuntia",name:"Opuntia products",c:"--gold",
     p:["Invasive cactus spreads, shrinking grazing land and habitat.","Pay local people per crate collected; process it into jam, juice and biogas.","Cactus removed; products made; harvesters paid.","Cactus cover falls; new household income; product sales grow.",IMPACT],
     f:[null,["grant","Pilot equipment and market testing"],["loan","Scale-up once demand is proven"],["rev","Product sales"],null],
     m:["Area cleared","Income paid to harvesters","Units sold per week"],
     a:["Buyers pay around KES 250 a jar, as at the Laikipia Permaculture Centre","Paying for cactus does not encourage people to grow it"],
     i:"The riskiest assumption is a perverse incentive: if cactus becomes valuable, people may spread it. That is why it starts as a grant-funded pilot."},
    {id:"community",name:"Community & governance",c:"--clay",
     p:["Risk of land disputes, family disagreement and unequal benefits.","Cultural programmes with Twala; household benefit-sharing; women and youth in leadership; participatory mapping.","Programmes running; households receiving benefits; representation on committees.","Communities back the conservancy; fewer disputes; stable decisions.",IMPACT],
     f:[null,["grant","Mapping and governance set-up"],null,["rev","10% of tourism revenue to households"],["out","40% of any carbon revenue"]],
     m:["Households receiving benefits","Women and youth in leadership","Disputes resolved"],
     a:["Family owners agree on a shared vision","County and national policy stay supportive"],
     i:"This stream earns little on its own but protects every other one. A fixed share of revenue keeps it funded after the grants end."}
  ];
  const STAGES = ["Problem","Activities","Outputs","Outcomes","Impact"];
  let cur = "grazing";
  function toc(){
    $("#streams").innerHTML = STREAMS.map(s=>`<button type="button" data-s="${s.id}" aria-pressed="${s.id===cur}"><i style="background:var(${s.c})"></i>${s.name}</button>`).join("");
    const s = STREAMS.find(x=>x.id===cur);
    $("#toc").innerHTML =
      `<span class="label">Pathway</span><div class="chain">${s.p.map((t,i)=>`<div class="node ${i===4?"impact":""}"><span class="label">${STAGES[i]}</span><p>${t}</p></div>`).join("")}</div>`+
      `<span class="label">Who pays</span><div class="pay">${s.f.map(x=>x?`<div class="c" style="--c:var(${CAP[x[0]][1]})"><b>${CAP[x[0]][0]}</b><span>${x[1]}</span></div>`:`<div class="c none"><span>–</span></div>`).join("")}</div>`+
      `<div class="duo"><div><span class="label">How we measure it</span><ul>${s.m.map(x=>`<li>${x}</li>`).join("")}</ul></div><div><span class="label">What must hold true</span><ul>${s.a.map(x=>`<li>${x}</li>`).join("")}</ul></div></div>`;
    $("#insight").textContent = s.i;
    $$("#streams button").forEach(b=>b.onclick=()=>{cur=b.dataset.s;toc();});
  }

  /* ---------- model ---------- */
  const DEFAULTS = JSON.parse(JSON.stringify(MR.INPUTS.map(i=>i.v)));
  let scen = "base";
  const STREAM_COL = {Tourism:"--sky","Conservation fees":"--acacia",Cultural:"--clay",Opuntia:"--gold",Livestock:"--muted",Carbon:"--ink"};
  function scenarios(){
    $("#scen").innerHTML = Object.entries(MR.SCENARIOS).map(([id,s])=>`<button type="button" data-sc="${id}" aria-pressed="${id===scen}">${s.label}</button>`).join("");
    $$("#scen button").forEach(b=>b.onclick=()=>{scen=b.dataset.sc;scenarios();render();});
    $("#scenNote").textContent = {base:"Carbon excluded · plan as designed",low:"Occupancy and Opuntia −30% · drought in Year 2",up:"Occupancy +15% · Opuntia +10% · carbon from Year 4"}[scen];
  }
  function kpi(id,v,cls){const e=$(id);e.querySelector("b").textContent=v;e.classList.remove("good","bad");if(cls)e.classList.add(cls);}
  function chart(r){
    const W=760,H=300,L=56,R=12,T=14,B=30, yrs=[0,1,2,3,4,5];
    const stacks = yrs.map(y=>r.revenue[y]); const vals=[...stacks,...r.opex.map((o,y)=>o+(y===0?r.capex:0)),...r.cum,0];
    const step = 100000; const max=Math.ceil(Math.max(...vals)/step)*step||step, min=Math.floor(Math.min(...vals)/step)*step;
    const y=v=>T+(max-v)/(max-min)*(H-T-B), gw=(W-L-R)/6, bw=Math.min(34,gw*.42);
    let s="";
    for(let v=min;v<=max;v+=step) s+=`<line x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}" style="stroke:var(${v===0?"--muted":"--rule"})"/><text x="${L-8}" y="${y(v)+4}" text-anchor="end">${k(v)}</text>`;
    const cpts=[], pts=[];
    yrs.forEach(i=>{
      const cx=L+gw*i+gw/2; let base=0;
      Object.keys(r.rev).forEach(n=>{const v=r.rev[n][i]; if(v>0){s+=`<rect x="${cx-bw/2}" y="${y(base+v)}" width="${bw}" height="${y(base)-y(base+v)}" style="fill:var(${STREAM_COL[n]})"><title>${n}: ${k(v)}</title></rect>`; base+=v;}});
      const totalCost = r.opex[i]+(i===0?r.capex:0);
      cpts.push([cx,y(totalCost)]); pts.push([cx,y(r.cum[i])]);
      s+=`<text x="${cx}" y="${H-9}" text-anchor="middle">Year ${i}</text>`;
    });
    s+=cpts.map(p=>`<line x1="${p[0]-bw/2-6}" x2="${p[0]+bw/2+6}" y1="${p[1]}" y2="${p[1]}" style="stroke:var(--bad)" stroke-width="2.5"/>`).join("");
    s+=`<polyline points="${pts.map(p=>p.join(",")).join(" ")}" fill="none" style="stroke:var(--ink)" stroke-width="2" stroke-dasharray="5 4"/>`;
    pts.forEach((p,i)=>{s+=`<circle cx="${p[0]}" cy="${p[1]}" r="4" style="fill:var(--sheet);stroke:var(--ink)" stroke-width="2"/>`; if(i===0||i===5||r.cum[i]===Math.min(...r.cum)) s+=`<text x="${p[0]+8}" y="${p[1]+4}" style="fill:var(--ink)">${k(r.cum[i])}</text>`;});
    $("#chart").innerHTML=s;
    $("#chartLegend").innerHTML = Object.keys(r.rev).filter(n=>r.rev[n].some(v=>v>0)).map(n=>`<span><i style="background:var(${STREAM_COL[n]})"></i>${n}</span>`).join("")+`<span><i style="background:var(--bad);height:3px;vertical-align:3px"></i>Total costs (Year 0 incl. capital)</span><span><i style="border-top:2px dashed var(--ink);height:0;vertical-align:3px"></i>Cumulative cash</span>`;
  }
  function tables(r){
    const yrs=[0,1,2,3,4,5], row=(n,a,cls="")=>`<tr class="${cls}"><td>${n}</td>${a.map(v=>`<td>${k(v)}</td>`).join("")}</tr>`;
    let h=`<thead><tr><th>USD</th>${yrs.map(y=>`<th>Y${y}</th>`).join("")}</tr></thead><tbody>`;
    Object.entries(r.rev).forEach(([n,a])=>{ if(a.some(v=>v)) h+=row(n,a); });
    h+=row("Total revenue",r.revenue,"sum");
    Object.entries(r.cost).forEach(([n,a])=>{ if(a.some(v=>v)) h+=row(n,a.map(v=>-v)); });
    h+=row("Operating profit",r.ebitda,"sum")+row("Capital costs",[ -r.capex,0,0,0,0,0])+row("Cash flow",r.fcf,"sum")+row("Cumulative cash",r.cum);
    h+=`<tr><td>Guests per night (avg)</td>${r.guests.map(g=>`<td>${(g/365).toFixed(1)}</td>`).join("")}</tr></tbody>`;
    $("#pnlT").innerHTML=h;
    // funding
    const parts=[["Grants",r.grants,"--acacia"],["Concessional loan",r.loan,"--sky"],["Equity / impact investor",r.equity,"--gold"]];
    const op = Math.max(0, r.need - r.capex - r.grants); if(op>0) parts.push(["Working capital",op,"--clay"]);
    const tot=parts.reduce((a,p)=>a+p[1],0);
    $("#fundBar").innerHTML=parts.map(p=>`<div style="width:${p[1]/tot*100}%;background:var(${p[2]})">${p[1]/tot>.12?k(p[1]):""}</div>`).join("");
    $("#fundLegend").innerHTML=parts.map(p=>`<span><i style="background:var(${p[2]})"></i>${p[0]} ${k(p[1])}</span>`).join("");
    $("#dscrT").innerHTML=`<thead><tr><th></th><th>Y1</th><th>Y2</th><th>Y3</th><th>Y4</th><th>Y5</th></tr></thead><tbody><tr><td>Loan payments</td>${r.debt.slice(1).map(v=>`<td>${k(v)}</td>`).join("")}</tr><tr><td>Debt coverage</td>${r.dscr.slice(1).map(v=>`<td style="color:var(${v===null?"--muted":v>=1.2?"--acacia":"--bad"})">${v===null?"–":v.toFixed(1)+"×"}</td>`).join("")}</tr></tbody>`;
  }
  function render(){
    const r = MR.run(scen);
    const tot=r.revenue.reduce((a,b)=>a+b,0);
    kpi("#kRev",k(tot)); kpi("#kEb",k(r.ebitda[5]),r.ebitda[5]<0?"bad":"good");
    kpi("#kNeed",k(r.need),r.need>0?"bad":"good"); kpi("#kPb",r.payback?"Year "+r.payback:"After Y5",r.payback?"good":"bad");
    kpi("#kNpv",k(r.npv),r.npv<0?"bad":"good");
    chart(r); tables(r);
    const b=MR.run("base"); $("#fNeed").textContent=k(b.need); $("#fPay").textContent=b.payback?"Year "+b.payback:"After Y5";
  }
  MR.INPUTS.forEach(i=>{ i.pct = i.unit.startsWith("%")||i.unit==="share"||i.unit==="per year"; });
  function fmtVal(i){ return i.pct ? "pct" : "num"; }
  function assumptions(){
    const groups=[...new Set(MR.INPUTS.map(i=>i.g))];
    $("#assump").innerHTML = groups.map(g=>`<div><h3>${g}</h3><div class="scroll"><table><thead><tr><th>Input</th><th>Value</th><th>Unit</th><th>Type</th><th style="text-align:left">Source and reasoning</th></tr></thead><tbody>${
      MR.INPUTS.filter(i=>i.g===g).map(i=>{
        const pct = fmtVal(i)==="pct";
        const show = v => pct ? +(v*100).toFixed(1) : v;
        const input = Array.isArray(i.v) ? `<span class="ramps">${i.v.map((v,ix)=>`<input class="ramp" type="number" step="any" data-id="${i.id}" data-ix="${ix}" value="${show(v)}" aria-label="${i.label}, Year ${ix+1}">`).join("")}</span>` : `<input type="number" step="any" data-id="${i.id}" value="${show(i.v)}" aria-label="${i.label}">`;
        const src = i.src && MR.SOURCES[i.src] ? ` <a href="${MR.SOURCES[i.src].url}" target="_blank" rel="noopener">${MR.SOURCES[i.src].label}</a>` : "";
        const badge = {sourced:"Sourced",estimate:"Estimate",placeholder:"To collect"}[i.t];
        return `<tr><td>${i.label}${Array.isArray(i.v)?' <span class="label">Y1–Y5</span>':""}</td><td class="val">${input}</td><td style="text-align:left;color:var(--muted);font-size:13px">${pct?(i.unit==="share"?"%":i.unit==="per year"?"% per year":i.unit):i.unit}</td><td><span class="badge ${i.t}">${badge}</span></td><td class="note">${i.note}${src}</td></tr>`;
      }).join("")}</tbody></table></div></div>`).join("");
    $$("#assump input").forEach(el=>el.addEventListener("input",()=>{
      const i=MR.INPUTS.find(x=>x.id===el.dataset.id); const pct=fmtVal(i)==="pct"; let v=parseFloat(el.value); if(isNaN(v)) return; if(pct) v/=100;
      if(el.dataset.ix!==undefined) i.v[+el.dataset.ix]=v; else i.v=v; render();
    }));
  }
  $("#resetInputs").onclick=()=>{ MR.INPUTS.forEach((i,ix)=>i.v=JSON.parse(JSON.stringify(DEFAULTS[ix]))); assumptions(); render(); };

  toc(); scenarios(); assumptions(); render(); route();
})();
