/* One fictional asset, deterministic local matching, no network requests. */
(() => {
  const venue = {assetId:'DEMO-SHA-JA-001', district:'静安', pricePerDay:18000,
    capacity:{theater:100,standing:150,banquet:60},
    dates:{'2026-11-10':'available','2026-11-11':'available','2026-11-12':'available','2026-11-13':'unavailable','2026-11-14':'unknown'}};
  const layouts = {theater:'剧院式',standing:'站立式',banquet:'宴会式'};
  const parseDate = value => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
    const stamp = Date.parse(value + 'T00:00:00Z');
    return Number.isFinite(stamp) && new Date(stamp).toISOString().slice(0,10) === value ? stamp : NaN;
  };
  function match(brief) {
    const start = parseDate(brief.start), end = parseDate(brief.end);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) throw new Error('请填写有效日期，结束日期不能早于开始日期。');
    const days = (end-start)/86400000 + 1;
    if (days > 60) throw new Error('此演示最多比较连续60天，请缩短日期范围。');
    if (!Object.hasOwn(layouts,brief.layout) || !Number.isInteger(brief.people) || brief.people < 1 || brief.people > 10000) throw new Error('请检查人数与布置方式。');
    if (brief.budget !== null && (!Number.isFinite(brief.budget) || brief.budget < 0 || brief.budget > 100000000)) throw new Error('请填写有效预算或留空。');
    const dates = Array.from({length:days},(_,i)=>new Date(start+i*86400000).toISOString().slice(0,10));
    const states = dates.map(date=>venue.dates[date] || 'unknown');
    const cost = days * venue.pricePerDay;
    const checks = [
      {name:'区域',state:brief.district === venue.district || brief.district === '不限区域' ? 'meets':'fail',reason:`样本位于静安，你选择${brief.district}。`},
      {name:'活动用途',state:['新品发布','展览','拍摄'].includes(brief.purpose)?'meets':'pending',reason:['新品发布','展览','拍摄'].includes(brief.purpose)?'模拟使用范围包含此类活动，具体方案仍需确认。':'样本未明确此用途，需运营另行确认。'},
      {name:'人数与布置',state:brief.people <= venue.capacity[brief.layout]?'meets':'fail',reason:`${layouts[brief.layout]}模拟容量${venue.capacity[brief.layout]}人，你需要${brief.people}人。`},
      {name:'连续档期',state:states.includes('unavailable')?'fail':states.includes('unknown')?'pending':'meets',reason:states.includes('unavailable')?'包含模拟不可用日期，需调整档期。':states.includes('unknown')?'包含未记录或待确认的日期，不能默认可用。':'所选日期均在模拟可用窗口内，实际仍须人工复核。'},
      {name:'基础场租预算',state:brief.budget === null?'pending':cost <= brief.budget?'meets':'fail',reason:`${days}日参考场租${cost.toLocaleString('zh-CN')}元；${brief.budget === null?'预算尚未确定':`预算${brief.budget.toLocaleString('zh-CN')}元`}。不含额外费用。`}
    ];
    if (brief.loading) checks.push({name:'货车装卸',state:'pending',reason:'装卸时段为09:00–11:00，车辆尺寸与到达时间需补充确认。'});
    if (brief.audio) checks.push({name:'户外扩音',state:'pending',reason:'邻近居民，是否允许及声音限制需场地方确认。'});
    return {checks,cost,days,hasConflict:checks.some(x=>x.state==='fail')};
  }
  window.SpaceFourDemoMatch = match;
  const $ = id=>document.getElementById(id);
  const dialogs = ['brief-screen','result-screen','records-screen'].map($);
  const form = $('brief-form');
  const key = 'space-four-demo-requests-v1';
  let records = [], activeBrief = null, activeResult = null, draftId = null, savedId = null;
  let storageAvailable = true;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) throw new Error('Invalid records');
      records = parsed.filter(record=>{
        try{return typeof record.id==='string' && record.assetId===venue.assetId && record.isMock===true && typeof record.createdAt==='string' && !!match(record.brief);}catch{return false;}
      }).slice(0,20);
    }
  } catch {storageAvailable=false;}
  function open(id) {
    dialogs.forEach(dialog=>{if(dialog.open) dialog.close();});
    $(id).showModal();
    $(id).scrollTop = 0;
  }
  document.querySelectorAll('[data-close-flow]').forEach(button=>button.addEventListener('click',()=>dialogs.forEach(dialog=>{if(dialog.open)dialog.close();})));
  document.querySelectorAll('[data-open-brief]').forEach(button=>button.addEventListener('click',()=>{
    form.reset();$('brief-error').textContent='';draftId=null;savedId=null;open('brief-screen');
  }));
  document.querySelectorAll('[data-open-records]').forEach(button=>button.addEventListener('click',()=>{renderRecords();open('records-screen');}));
  form.addEventListener('submit', event=>{
    event.preventDefault();$('brief-error').textContent='';
    const values = new FormData(form);
    const brief = {purpose:String(values.get('purpose')),start:String(values.get('start')),end:String(values.get('end')),people:Number(values.get('people')),layout:String(values.get('layout')),district:String(values.get('district')),budget:values.get('budget')===''?null:Number(values.get('budget')),loading:values.has('loading'),audio:values.has('audio')};
    try {
      activeResult=match(brief);activeBrief=brief;draftId=crypto.randomUUID ? crypto.randomUUID():`demo-${Date.now()}-${Math.random().toString(16).slice(2)}`;savedId=null;
      renderResult();open('result-screen');
    }catch(error){$('brief-error').textContent=error.message;}
  });
  const make = (tag,text,className)=>{const node=document.createElement(tag);node.textContent=text;if(className)node.className=className;return node;};
  function renderResult() {
    const {checks,hasConflict,cost} = activeResult;
    const count = state=>checks.filter(x=>x.state===state).length;
    $('result-title').textContent=hasConflict?'先调整几个条件。':'值得进一步了解。';
    $('result-summary').textContent=`${activeBrief.purpose} · ${activeBrief.people}人 · ${layouts[activeBrief.layout]}\n${activeBrief.start} 至 ${activeBrief.end}`;
    $('result-conclusion').textContent=`${count('meets')}项符合 · ${count('pending')}项待确认${count('fail')?` · ${count('fail')}项不符合`:''}`;
    $('match-checks').replaceChildren();
    checks.forEach(check=>{
      const row=make('div','', 'match-item');
      row.append(make('h3',check.name),make('span',{meets:'模拟符合',pending:'待确认',fail:'不符合'}[check.state],`match-state ${check.state}`),make('p',check.reason));
      $('match-checks').append(row);
    });
    $('budget-visual').hidden=!(activeBrief.budget>0);
    if(activeBrief.budget>0){const ratio=cost/activeBrief.budget*100;$('budget-percent').textContent=`${ratio.toFixed(1)}%`;$('budget-fill').style.width=`${Math.min(ratio,100)}%`;$('budget-explanation').textContent=`${cost.toLocaleString('zh-CN')} ÷ ${activeBrief.budget.toLocaleString('zh-CN')}元。仅基础场租，不是活动总成本${ratio>100?'；已超预算':''}。`;}
    $('save-request').textContent=savedId?'已保存至演示需求':'保存演示需求';$('save-request').disabled=!!savedId;$('save-feedback').textContent='';
  }
  $('edit-brief').addEventListener('click',()=>open('brief-screen'));
  $('view-space').addEventListener('click',()=>{
    $('recommend-context').hidden=false;
    $('context-summary').textContent=`${activeBrief.purpose} · ${activeBrief.people}人 · ${activeResult.hasConflict?'存在条件冲突':'有待确认事项'}。查看结果了解具体依据。`;
    $('result-screen').close();window.scrollTo({top:0,behavior:'auto'});
  });
  $('return-results').addEventListener('click',()=>{if(activeBrief){renderResult();open('result-screen');}});
  $('save-request').addEventListener('click',()=>{
    if(!activeBrief||savedId)return;
    const record={id:`DEMO-${draftId}`,assetId:venue.assetId,isMock:true,createdAt:new Date().toISOString(),brief:activeBrief,status:'仅保存演示，未发送运营'};
    const updated=[record,...records].slice(0,20);
    try {localStorage.setItem(key,JSON.stringify(updated));storageAvailable=true;}
    catch {storageAvailable=false;}
    records=updated;savedId=record.id;renderRecords();open('records-screen');
  });
  function renderRecords() {
    $('storage-notice').textContent=storageAvailable?'清除浏览器数据后记录会丢失；文件地址与本地网页地址的记录不互通。':'浏览器无法持久保存，本次记录仅留在当前页面，刷新后可能丢失。';
    $('record-list').replaceChildren();
    if(!records.length){$('record-list').append(make('p','还没有演示需求。试着为白庭创建一份。','empty-records'));return;}
    records.forEach(record=>{
      const card=make('article','', 'record-card');
      const brief=record.brief;
      card.append(make('h2',`${brief.purpose} · ${brief.people}人`),make('p',`${brief.start} 至 ${brief.end}\n白庭 01 · ${layouts[brief.layout]}\n${record.status}`));
      const button=make('button','查看需求与模拟结果','secondary-action');button.type='button';
      button.addEventListener('click',()=>{
        activeBrief=brief;activeResult=match(brief);savedId=record.id;
        ['purpose','start','end','people','layout','district'].forEach(name=>{form.elements.namedItem(name).value=brief[name];});
        form.elements.namedItem('budget').value=brief.budget??'';
        ['loading','audio'].forEach(name=>{form.elements.namedItem(name).checked=brief[name];});
        renderResult();open('result-screen');
      });
      card.append(button);$('record-list').append(card);
    });
  }
  const params = new URLSearchParams(window.location.search);
  const entry = params.get('entry');
  if (entry === 'brief' && params.get('from') === 'discovery') {
    ['start','end','people','budget'].forEach(name => { form.elements.namedItem(name).value=''; });
    ['loading','audio'].forEach(name => { form.elements.namedItem(name).checked=false; });
    try {
      const draft = JSON.parse(sessionStorage.getItem('space-four-discovery-draft-v1') || 'null');
      if (draft?.isMock === true && draft.assetId === venue.assetId) {
        if (Number.isInteger(draft.people) && draft.people > 0 && draft.people <= 10000) form.elements.namedItem('people').value=draft.people;
        if (['新品发布','展览','拍摄'].includes(draft.purpose)) form.elements.namedItem('purpose').value=draft.purpose;
        ['start','end'].forEach(name => {if (Number.isFinite(parseDate(draft[name] || ''))) form.elements.namedItem(name).value=draft[name];});
      }
      sessionStorage.removeItem('space-four-discovery-draft-v1');
    } catch { /* Required fields remain empty when storage is unavailable. */ }
    document.querySelector('#brief-screen .flow-intro').textContent='从首页模拟对话进入。仅带入已识别字段，请核对并补齐；用途、布置方式和区域仍需你确认。';
  }
  if (entry === 'brief' && Number.isFinite(parseDate(params.get('start') || '')) && Number.isFinite(parseDate(params.get('end') || ''))) {
    ['start','end'].forEach(name => { form.elements.namedItem(name).value=params.get(name); });
  }
  if (entry === 'brief') open('brief-screen');
  if (entry === 'records') { renderRecords(); open('records-screen'); }
})();
