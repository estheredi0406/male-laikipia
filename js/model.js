/* Male Ranch Conservancy — driver-based 5-year model.
   Every input carries a type: "sourced" (taken from a cited reference), "estimate" (a judgement, explained),
   or "placeholder" (a fact still to be collected). Edit values here or live in the Model page. */
var MR = window.MR = window.MR || {};
MR.SOURCES = {
  mpala:   {label:"Mpala Research Centre fees 2025", url:"https://mpala.org/wp-content/uploads/2025/08/MRC-fees-structure-2025-1.pdf"},
  olpejeta:{label:"Ol Pejeta Tariff Guide 2026", url:"https://www.olpejetaconservancy.org/wp-content/uploads/2025/11/OPC-Tariff-Guide-2026.pdf"},
  porini:  {label:"Porini Safari Camps 2026 rates", url:"https://www.porini.com/wp-content/uploads/2026/01/2026-Resident-Rates-Porini-Safari-Camps.pdf"},
  lpc:     {label:"The Standard: Laikipia Permaculture Centre cactus products", url:"https://www.standardmedia.co.ke/farmkenya/crop/article/2001332120/farmers-in-arid-laikipia-find-fortune-in-cactus-plant"},
  beef:    {label:"Selina Wamucii: Kenya beef unit value (UN Comtrade)", url:"https://www.selinawamucii.com/insights/prices/kenya/beef/"},
  carbon:  {label:"Regreener: carbon credit prices 2026", url:"https://www.regreener.earth/blog/carbon-credit-prices-today-trends-and-forecasts-for-2026"},
  wage:    {label:"K24: Kenya minimum wage 2026", url:"https://k24.digital/lifestyle/money/12-salary-increase-takes-effect-how-much-entry-level-workers-will-earn/amp"},
  fx:      {label:"ValutaFX USD/KES", url:"https://www.valutafx.com/convert/usd-kes"}
};
/* ramp inputs are arrays for Years 1–5 */
MR.INPUTS = [
  {g:"Tourism", id:"resBeds", label:"Research & student camp beds", v:12, unit:"beds", t:"estimate", note:"Four eco-research tents of three; sized for one university group at a time."},
  {g:"Tourism", id:"resOcc", label:"Research camp occupancy", v:[0.15,0.25,0.35,0.40,0.45], unit:"% of bed-nights", t:"estimate", note:"Slow ramp: a new site needs time to win university partners such as Mpala's network."},
  {g:"Tourism", id:"resRate", label:"Research rate, full board", v:40, unit:"$/person-night", t:"sourced", src:"mpala", note:"Mpala dorms: $30 (East African) to $45 (international) full board."},
  {g:"Tourism", id:"resFee", label:"Conservation fee, students", v:10, unit:"$/person-night", t:"sourced", src:"olpejeta", note:"Ol Pejeta student entry: KES 500 (EA) to $32 (non-resident)."},
  {g:"Tourism", id:"ecoBeds", label:"Eco-camp beds (starbeds, bush camps)", v:8, unit:"beds", t:"estimate", note:"Small, low-impact footprint as in the 2025 plan."},
  {g:"Tourism", id:"ecoOcc", label:"Eco-camp occupancy", v:[0.10,0.20,0.30,0.35,0.40], unit:"% of bed-nights", t:"estimate", note:"Below established Laikipia camps; Laikipia has a long rainy-season low."},
  {g:"Tourism", id:"ecoRate", label:"Eco-camp rate, full board", v:150, unit:"$/person-night", t:"sourced", src:"porini", note:"Between Ol Pejeta camping (~$27, no meals) and Porini Rhino Camp (KES 21,450–32,450, ~$165–250)."},
  {g:"Tourism", id:"ecoFee", label:"Conservation fee, eco-travellers", v:40, unit:"$/person-night", t:"sourced", src:"olpejeta", note:"Ol Pejeta: KES 3,500 resident, $110 non-resident. Set low for a lesser-known site."},
  {g:"Tourism", id:"culture", label:"Cultural activity spend", v:15, unit:"$/guest-night", t:"estimate", note:"Manyatta visits, cooking and crafts; taken up by about a third of guests (below)."},
  {g:"Tourism", id:"cultureUptake", label:"Guests joining cultural activities", v:0.3, unit:"share", t:"estimate", note:""},
  {g:"Tourism", id:"tourVar", label:"Direct cost of tourism", v:0.40, unit:"% of tourism revenue", t:"estimate", note:"Food, consumables, laundry, guiding."},
  {g:"Opuntia", id:"opUnits", label:"Units sold per week (jam, juice)", v:[100,180,260,320,380], unit:"units/week", t:"estimate", note:"Laikipia Permaculture Centre makes ~100 L juice + ~100 L wine a week (~500+ units); Male Ranch starts below that."},
  {g:"Opuntia", id:"opWeeks", label:"Selling weeks per year", v:48, unit:"weeks", t:"estimate", note:""},
  {g:"Opuntia", id:"opPrice", label:"Price per unit (250 g jar / 250 ml bottle)", v:1.94, unit:"$/unit", t:"sourced", src:"lpc", note:"KES 250 per jar or bottle at the Laikipia Permaculture Centre."},
  {g:"Opuntia", id:"opFruitKg", label:"Fruit needed per unit", v:0.6, unit:"kg/unit", t:"estimate", note:"Allows for peel and waste."},
  {g:"Opuntia", id:"opFruitPrice", label:"Price paid to harvesters", v:0.31, unit:"$/kg", t:"sourced", src:"lpc", note:"KES 1,000 per 25 kg crate (KES 40/kg)."},
  {g:"Opuntia", id:"opPack", label:"Packaging and processing", v:0.45, unit:"$/unit", t:"estimate", note:"Jars, labels, gas, labour."},
  {g:"Livestock", id:"lsHead", label:"Cattle sold per year", v:[10,18,26,32,38], unit:"head", t:"estimate", note:"Grows as rotational grazing restores pasture."},
  {g:"Livestock", id:"lsKg", label:"Meat per animal", v:180, unit:"kg", t:"estimate", note:"Typical for zebu-cross steers; verify with a local buyer."},
  {g:"Livestock", id:"lsPrice", label:"Beef price", v:4.41, unit:"$/kg", t:"sourced", src:"beef", note:"Kenya export unit value (KES 613/kg). Local farm-gate is likely lower; test it."},
  {g:"Livestock", id:"lsVar", label:"Direct cost of livestock", v:0.45, unit:"% of livestock revenue", t:"estimate", note:"Vet, supplements, herding, transport."},
  {g:"Carbon (upside)", id:"cHa", label:"Area under restoration", v:5000, unit:"hectares", t:"placeholder", note:"Replace with Male Ranch's real area."},
  {g:"Carbon (upside)", id:"cRate", label:"Soil carbon gain", v:0.5, unit:"tCO₂e/ha/year", t:"estimate", note:"Conservative for rangeland soil carbon; needs a baseline survey."},
  {g:"Carbon (upside)", id:"cPrice", label:"Credit price", v:12, unit:"$/tCO₂e", t:"sourced", src:"carbon", note:"Nature-based credits trade around €2–45 depending on quality."},
  {g:"Carbon (upside)", id:"cStart", label:"First credit sales", v:4, unit:"year", t:"estimate", note:"Baseline, validation and first verification take years."},
  {g:"Carbon (upside)", id:"cSetup", label:"Project set-up cost (Years 1–2)", v:40000, unit:"$/year", t:"estimate", note:"Design document, validation, registry."},
  {g:"Carbon (upside)", id:"cShare", label:"Community share of carbon revenue", v:0.4, unit:"share", t:"estimate", note:"Kenya's 2023 climate law sets community benefit-sharing for land-based projects; confirm the exact rule."},
  {g:"Capital costs (Year 0)", id:"kRes", label:"Research camp", v:55000, unit:"$", t:"estimate", note:"Tents, ablutions, kitchen. Get quotes."},
  {g:"Capital costs (Year 0)", id:"kEco", label:"Eco-camp and starbeds", v:75000, unit:"$", t:"estimate", note:""},
  {g:"Capital costs (Year 0)", id:"kSolar", label:"Solar and water", v:40000, unit:"$", t:"estimate", note:""},
  {g:"Capital costs (Year 0)", id:"kOp", label:"Opuntia processing unit", v:20000, unit:"$", t:"estimate", note:"Low-tech start, as the 2025 plan proposed."},
  {g:"Capital costs (Year 0)", id:"kGraze", label:"Grazing fencing and water points", v:30000, unit:"$", t:"estimate", note:""},
  {g:"Capital costs (Year 0)", id:"kVeh", label:"Vehicle", v:35000, unit:"$", t:"estimate", note:"One used 4×4."},
  {g:"Running costs", id:"staff", label:"Staff", v:[8,10,12,14,15], unit:"people", t:"estimate", note:""},
  {g:"Running costs", id:"wage", label:"Average staff cost", v:2800, unit:"$/person/year", t:"estimate", src:"wage", note:"About KES 30,000 a month, roughly 3× Kenya's 2026 rural minimum wage (KES 9,268)."},
  {g:"Running costs", id:"mgr", label:"Manager", v:14000, unit:"$/year", t:"estimate", note:""},
  {g:"Running costs", id:"maint", label:"Maintenance", v:0.04, unit:"% of capital cost/year", t:"estimate", note:""},
  {g:"Running costs", id:"admin", label:"Insurance and admin", v:8000, unit:"$/year", t:"estimate", note:""},
  {g:"Running costs", id:"mkt", label:"Marketing", v:0.06, unit:"% of tourism revenue", t:"estimate", note:""},
  {g:"Running costs", id:"comm", label:"Community benefit share", v:0.10, unit:"% of tourism revenue", t:"estimate", note:"Paid to households, as the Theory of Change proposes."},
  {g:"Running costs", id:"monitor", label:"Ecological monitoring", v:5000, unit:"$/year", t:"estimate", note:"Biomass, soil health, groundwater, vegetation."},
  {g:"Grant-funded set-up", id:"gBase", label:"Baseline ecological survey (Year 0)", v:20000, unit:"$", t:"estimate", note:"Also the starting point any carbon project needs."},
  {g:"Grant-funded set-up", id:"gTrain", label:"Guide, hospitality and grazing training (Years 1–2)", v:15000, unit:"$/year", t:"estimate", note:"Prioritising women and youth."},
  {g:"Grant-funded set-up", id:"gGov", label:"Participatory mapping and governance (Year 0)", v:10000, unit:"$", t:"estimate", note:""},
  {g:"Finance", id:"loanShare", label:"Capital costs funded by a concessional loan", v:0.6, unit:"share", t:"estimate", note:"The rest from equity or a grant."},
  {g:"Finance", id:"loanRate", label:"Loan interest", v:0.05, unit:"per year", t:"estimate", note:"Concessional (below commercial Kenyan rates)."},
  {g:"Finance", id:"loanGrace", label:"Grace period before repayment", v:2, unit:"years", t:"estimate", note:"Interest only in Years 1–2; equal principal Years 3–5."},
  {g:"Finance", id:"disc", label:"Discount rate for NPV", v:0.10, unit:"per year", t:"estimate", note:""}
];
MR.SCENARIOS = {
  base:{label:"Base case", occ:1, op:1, ls:1, drought:false, carbon:false},
  low: {label:"Stress case", occ:0.7, op:0.7, ls:1, drought:true, carbon:false},
  up:  {label:"Upside with carbon", occ:1.15, op:1.1, ls:1, drought:false, carbon:true}
};
MR.get = id => MR.INPUTS.find(i=>i.id===id).v;
MR.run = function(sc){
  const g = MR.get, Y = 5, yrs = [0,1,2,3,4,5];
  const at = (v,y)=> Array.isArray(v) ? v[y-1] : v;
  const S = MR.SCENARIOS[sc];
  const rev = {Tourism:Array(6).fill(0), "Conservation fees":Array(6).fill(0), Cultural:Array(6).fill(0), Opuntia:Array(6).fill(0), Livestock:Array(6).fill(0), Carbon:Array(6).fill(0)};
  const cost = {"Direct costs":Array(6).fill(0), Staff:Array(6).fill(0), "Overheads":Array(6).fill(0), "Community share":Array(6).fill(0), "Grant-funded set-up":Array(6).fill(0), "Carbon set-up":Array(6).fill(0)};
  const guests = Array(6).fill(0);
  const capex = ["kRes","kEco","kSolar","kOp","kGraze","kVeh"].reduce((a,k)=>a+g(k),0);
  for (let y=1;y<=Y;y++){
    const dr = S.drought && y===2;
    const occF = S.occ * (dr?0.85:1);
    const resN = g("resBeds")*365*Math.min(1,at(g("resOcc"),y)*occF);
    const ecoN = g("ecoBeds")*365*Math.min(1,at(g("ecoOcc"),y)*occF);
    guests[y] = resN+ecoN;
    rev.Tourism[y] = resN*g("resRate") + ecoN*g("ecoRate");
    rev["Conservation fees"][y] = resN*g("resFee") + ecoN*g("ecoFee");
    rev.Cultural[y] = (resN+ecoN)*g("cultureUptake")*g("culture");
    const units = at(g("opUnits"),y)*g("opWeeks")*S.op;
    rev.Opuntia[y] = units*g("opPrice");
    const head = at(g("lsHead"),y)*S.ls*(dr?0.6:1);
    rev.Livestock[y] = head*g("lsKg")*g("lsPrice");
    if (S.carbon && y>=g("cStart")) rev.Carbon[y] = g("cHa")*g("cRate")*g("cPrice");
    const tourAll = rev.Tourism[y]+rev.Cultural[y];
    cost["Direct costs"][y] = tourAll*g("tourVar") + units*(g("opFruitKg")*g("opFruitPrice")+g("opPack")) + rev.Livestock[y]*g("lsVar");
    cost.Staff[y] = at(g("staff"),y)*g("wage") + g("mgr");
    cost.Overheads[y] = capex*g("maint") + g("admin") + rev.Tourism[y]*g("mkt") + g("monitor");
    cost["Community share"][y] = (rev.Tourism[y]+rev["Conservation fees"][y])*g("comm") + rev.Carbon[y]*g("cShare");
    cost["Grant-funded set-up"][y] = (y<=2? g("gTrain"):0);
    cost["Carbon set-up"][y] = (S.carbon && y<=2)? g("cSetup"):0;
  }
  cost["Grant-funded set-up"][0] = g("gBase")+g("gGov");
  const revenue = yrs.map(y=>Object.values(rev).reduce((a,r)=>a+r[y],0));
  const opex = yrs.map(y=>Object.values(cost).reduce((a,c)=>a+c[y],0));
  const ebitda = yrs.map(y=>revenue[y]-opex[y]);
  const capexArr = [capex,0,0,0,0,0];
  const fcf = yrs.map(y=>ebitda[y]-capexArr[y]);           // before financing
  const cum = []; fcf.reduce((a,v,i)=>(cum[i]=a+v),0);
  const need = Math.max(0,-Math.min(...cum));
  const pb = cum.findIndex((v,i)=>i>0 && v>=0);
  const npv = fcf.reduce((a,v,i)=>a+v/Math.pow(1+g("disc"),i),0);
  // grants: set-up programmes + carbon set-up; loan: share of capex
  const grants = yrs.reduce((a,y)=>a+cost["Grant-funded set-up"][y]+cost["Carbon set-up"][y],0);
  const loan = capex*g("loanShare");
  const debt = yrs.map(y=>{ if(y===0) return 0; const r=g("loanRate"), gr=g("loanGrace"), n=Y-gr;
    const paidBefore = y>gr ? loan/n*(y-gr-1) : 0; const bal = loan-paidBefore;
    return bal*r + (y>gr ? loan/n : 0); });
  const ebitdaEx = yrs.map(y=>ebitda[y] + cost["Grant-funded set-up"][y] + cost["Carbon set-up"][y]); // grant-funded items covered by grants
  const dscr = yrs.map(y=> y===0||debt[y]===0 ? null : ebitdaEx[y]/debt[y]);
  return {rev,cost,revenue,opex,ebitda,capex,fcf,cum,need,payback: pb>0? pb : null,npv,grants,loan,equity:capex-loan,debt,dscr,guests};
};
