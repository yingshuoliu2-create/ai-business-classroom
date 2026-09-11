/* Enhancements to the original classroom: all exercises run locally. */
(() => {
  const q = (s) => document.querySelector(s);
  const all = (s) => [...document.querySelectorAll(s)];
  const section = (i) => q(`[data-slide="${i}"]`);
  const add = (parent, html, position = 'beforeend') => parent.insertAdjacentHTML(position, html);
  const set = (selector, html) => { const el = q(selector); if (el) el.innerHTML = html; };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  // Native glass geometry keeps the three ideas readable and individually selectable.
  const icons = [
    '<circle cx="12" cy="7" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3"/>',
    '<path d="M5 20V12m7 8V7m7 13V3"/>',
    '<path d="m12 2 9 5v10l-9 5-9-5V7l9-5Zm0 10 9-5M12 12 3 7m9 5v10"/>'
  ];
  const labels = ['人的创造力', '营销与表达', '商业落地'];
  const captions = ['从一个灵感到更多可能', '让好内容被看见', '从创意到真实价值'];
  all('[data-orbit]').forEach((button, i) => {
    button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[i]}</svg><span>${labels[i]}</span><small>${captions[i]}</small>`;
  });
  set('.visual-footer', '<span>点击探索 · 拖动旋转</span><button class="orbit-reset" id="resetOrbit">复位</button>');
  const orbit = q('.orbit');
  orbit.setAttribute('aria-label', '拖动旋转 AI 价值模型，也可直接点击三个关键词');
  let drag = null, x = 0, y = 0;
  const orient = () => { orbit.style.setProperty('--orbit-x', `${x}deg`); orbit.style.setProperty('--orbit-y', `${y}deg`); };
  orbit.addEventListener('pointerdown', (event) => {
    if (event.target.closest('button') || reduced.matches) return;
    event.preventDefault();
    drag = { sx: event.clientX, sy: event.clientY, x, y };
    orbit.setPointerCapture(event.pointerId); orbit.classList.add('dragging');
  });
  orbit.addEventListener('pointermove', (event) => {
    if (!drag) return;
    y = Math.max(-24, Math.min(24, drag.y + (event.clientX - drag.sx) * .15));
    x = Math.max(-12, Math.min(12, drag.x - (event.clientY - drag.sy) * .1)); orient();
  });
  const release = () => { drag = null; orbit.classList.remove('dragging'); };
  orbit.addEventListener('pointerup', release); orbit.addEventListener('pointercancel', release);
  q('#resetOrbit').onclick = () => { x = y = 0; orient(); };

  // Chapter 02 — ideas first, one familiar example through three lenses.
  set('#title-1', 'AI 的三个角色，<em>一次看懂。</em>');
  set('[data-slide="1"] .section-head p', '先用三个生活比喻理解 AI，再看它怎样帮我们完成工作。');
  const rows = [
    ['LLM', '大语言模型 · 知识很多的实习生', '会理解、写作和推理，需要清晰指导，也可能答错。'],
    ['AIGC', '生成内容 · 交付出来的作品', '一段文案、一张图或一份代码，是 AI 帮你做出的初稿。'],
    ['Agent', '智能体 · 专岗智能员工', '有岗位、目标和工具，能安排步骤、执行任务并反馈。']
  ];
  rows.forEach((row, i) => set(`[data-concept="${i}"]`, `<strong>${row[0]}</strong><span><b>${row[1]}</b>${row[2]}</span>`));
  conceptData.splice(0, 3,
    ['LLM', '“帮我写三个活动标题。”', '模型负责理解与生成，结果由人判断。就像指导实习生，需求越具体，初稿越接近目标。', '给清楚：它是谁、你是谁、要做什么、交付标准、哪些事不能做。'],
    ['AIGC', '“这是活动海报的文案初稿。”', '标题、图片、脚本和代码都是可能的产物。你可以把 AI 的生成能力与自己的审美、表达结合起来。', '软件例子：豆包、DeepSeek 等助手辅助文案，再配合相应图像或视频工具完成创作。'],
    ['AI Agent', '“按流程，准备一套活动内容。”', '智能体查资料、写初稿、调用工具检查，再把成果交给你确认。目标驱动的工作，需要工具和流程支持。', '搭建例子：扣子可编排智能体与工作流；WorkBuddy 可结合 Skills 和连接工具组织任务。']
  );
  q('[data-concept="0"]').click();
  q('[data-slide="1"] .callout').remove();
  add(q('[data-slide="1"] .two-col'), '<div class="concept-support"><div><strong>Token</strong><span>模型处理的信息颗粒</span></div><div><strong>Context</strong><span>本次对话的临时工作台</span></div><div><strong>Knowledge Base</strong><span>可以检索的资料柜</span></div></div>', 'afterend');
  set('[data-slide="1"] > .fineprint', 'WorkBuddy、豆包、扣子等产品提供使用模型与工具的入口。模型、软件和智能体是不同概念，同一产品也可能包含多种能力。');
  add(section(1), '<details class="workshop"><summary>给听众一个小问题<small>点击回答：什么让 AI 从聊天走向行动？</small></summary><div class="scenario-tabs" aria-label="概念小测"><button data-check="0">只换一个更大的模型</button><button data-check="1">目标 + 工具 + 流程 + 反馈</button><button data-check="2">让 AI 永远不找人确认</button></div><p class="question-result" id="conceptCheck" aria-live="polite">选一个答案，说说你的理由。</p></details>');
  all('[data-check]').forEach(button => button.onclick = () => {
    all('[data-check]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    q('#conceptCheck').textContent = ['模型能力很重要，还需要连接工具、定义任务和执行流程。', '答对了。把目标、工具、流程与反馈连起来，AI 才能推进具体工作；关键节点由人判断。', '还需要人的判断。事实核验、权限与重要决定，应设置人工审核节点。'][Number(button.dataset.check)];
  });

  // Chapter 03 — repeatable methods, with a genuinely editable prompt exercise.
  set('[data-slide="2"] .section-head p', '学习 → 理解 → 判断 → 执行 → 反馈。把一次对话，连接成一项可交付的工作。');
  all('[data-level] > b').forEach((b, i) => b.textContent = `0${i + 1}`);
  set('[data-slide="2"] .level-result > strong', '同一任务 · 公司周报');
  levelTexts.splice(0, 4,
    '“一份公司周报应该包括什么？”\nAI 提供思路，人继续整理资料。',
    '“根据这份业务记录，按指定模板写一页周报。”\n给出身份、目标、资料、标准和约束，获得更清楚的交付。',
    '授权数据 → 校验整理 → 周报初稿 → 人工审核。\n固定重复的工作，优先用稳定的工作流串起来。',
    '数据 Agent 整理、分析 Agent 找变化、内容 Agent 写周报。\n按任务分工，人负责验收和处理异常。'
  );
  q('[data-level="0"]').click();
  q('[data-slide="2"] .callout').remove();
  add(q('[data-slide="2"] .level-result'), '<div class="method-strip"><div><b>Skill</b><span>保存可复用的方法</span></div><div><b>Workflow</b><span>安排稳定的步骤</span></div><div><b>Agent</b><span>围绕目标行动</span></div><div><b>MCP / API</b><span>连接外部软件</span></div></div>', 'afterend');
  set('[data-slide="2"] > .fineprint', '任务越稳定，越适合明确的工作流；复杂任务可引入智能体分工。按业务需要选择组合。');
  add(section(2), `<details class="workshop"><summary>现场试一试：给 AI 一份清楚的任务<small>填写后生成可复制的指令模板</small></summary><form class="prompt-form" id="promptForm"><label>AI 的岗位<select id="promptRole"><option>公司数据分析助理</option><option>内容营销策划</option><option>客户服务助理</option></select></label><label>我的身份<input id="promptUser" maxlength="80" value="公司运营负责人" required></label><label class="wide">这次要完成什么？<input id="promptTask" maxlength="200" value="根据本周业务数据，整理一页周报" required></label><label>交付标准<input id="promptStandard" maxlength="160" value="列出三个关键变化、原因和下一步建议" required></label><label>约束与禁忌<input id="promptLimit" maxlength="160" value="不编造数据；缺少资料时先向我提问" required></label><div class="actions wide"><button class="primary" type="submit">生成任务指令</button><button class="secondary" type="button" id="copyPrompt" disabled>复制指令</button></div></form><div class="prompt-result" id="promptResult" hidden aria-live="polite"></div></details>`);
  q('#promptForm').onsubmit = (event) => {
    event.preventDefault();
    const value = id => q(`#${id}`).value.trim();
    if (['promptUser','promptTask','promptStandard','promptLimit'].some(id => !value(id))) { toast('请把任务信息填写完整。'); return; }
    q('#promptResult').textContent = `你是一名${value('promptRole')}。\n我的身份：${value('promptUser')}。\n\n任务：${value('promptTask')}。\n交付标准：${value('promptStandard')}。\n约束：${value('promptLimit')}。\n\n先确认所需资料和执行步骤，再完成任务。区分事实与推测，提交结果供我审核。`;
    q('#promptResult').hidden = false; q('#copyPrompt').disabled = false;
  };
  q('#copyPrompt').onclick = async () => {
    try { await navigator.clipboard.writeText(q('#promptResult').textContent); toast('任务指令已复制，可以粘贴到你使用的 AI 工具。'); }
    catch { const range = document.createRange(); range.selectNodeContents(q('#promptResult')); getSelection().removeAllRanges(); getSelection().addRange(range); toast('已选中指令，请按复制快捷键。'); }
  };

  set('.quote-block blockquote', '当 AI 讲师，<br>是把“会用”，<br>变成“有用、<br>有人买单”。');
  const principles = [
    ['先使用，做出结果', '从选题、设计或数据整理开始。做出一个能展示的结果，讲清自己的方法与经验。'],
    ['用创新，解决需求', '把审美、表达和行业经验变成产品。先服务一类人、解决一个具体问题。'],
    ['用营销，建立信任', '营销自己，是建立可信的个人品牌；营销产品，是让客户看懂你解决的问题。']
  ];
  all('.principle').forEach((el,i) => { el.querySelector('h3').textContent = principles[i][0]; el.querySelector('p').textContent = principles[i][1]; });
  set('[data-slide="3"] .callout', '先借助应用开发工具做一个客户愿意用的小产品，再用使用反馈与付费意愿验证商业价值。');

  // Company scenarios are illustrative, with separate examples and a human review step.
  const scenarios = [
    { name:'数据分析', title:'公司周报 · 任务链', stages:['读取授权业务数据','校验与整理口径','生成周报与建议','人工审核','记录结果与反馈'], details:['示例业务记录','去重 / 标记缺失字段','趋势摘要 / 待确认事项','确认事实与业务判断','积累模板与规则'], logs:['选择了一份虚构的周业务记录，准备整理。','检查重复记录、缺失字段与统计口径，异常单独列出。','已形成周报草稿：本周变化、可能原因与下一步建议。','停在人审节点：核对关键数字和建议依据，再继续。','审核结果已记录，可以据此完善下一次的 Skill。','五步演示完成：从资料进入系统，到产出可审核的周报。'], output:'周报草稿\n① 本周关键变化\n② 数据异常与待确认项\n③ 下周行动建议' },
    { name:'客户服务', title:'客户咨询 · 任务链', stages:['读取授权咨询记录','检索公司知识库','准备答复草稿','人工审核','归档与更新知识'], details:['虚构咨询 / 无个人信息','产品资料 / 服务流程','依据资料组织回答','确认承诺与特殊情况','沉淀常见问题'], logs:['选取一条虚构咨询：“你们的服务如何开始？”','从公司知识库查找服务范围、准备资料和交付流程。','形成答复草稿，并注明仍需确认的项目条件。','停在人审节点：核实服务承诺，特殊情况交给业务人员。','已记录审核意见，常见问答可以更新回知识库。','演示完成：让常见咨询更快得到有依据的答复。'], output:'答复草稿\n您好，我们先确认您的业务需求，再约定试点范围与验收标准。具体交付安排由服务人员确认。' },
    { name:'营销内容', title:'营销内容 · 任务链', stages:['整理客户真实问题','匹配授权案例资料','生成内容初稿','人工审核','记录发布反馈'], details:['客户需求 / 选题方向','案例事实 / 品牌表达','图文提纲 / 视频脚本','核验事实与表达','询盘 / 线索 / 转化'], logs:['从虚构客户问题中选择：“AI 可以怎样减少重复整理？”','整理公司可使用的案例资料，提取可查证信息。','生成一份内容提纲，包含问题、方法、例子与行动建议。','停在人审节点：确认事实、版权和表达后再安排发布。','记录内容版本与复盘项目，为后续内容积累方法。','演示完成：从客户问题到内容初稿，再回到业务反馈。'], output:'内容提纲\n开场：你的周报，每周花多少时间？\n方法：资料整理 → AI 初稿 → 人工复核\n收尾：选一个重复任务，先做小试点。' }
  ];
  let scene = 0, stage = -1;
  add(q('[data-slide="4"] .case-grid'), '<div class="scenario-tabs" role="group" aria-label="选择公司场景">'+scenarios.map((s,i)=>`<button data-scenario="${i}" aria-pressed="${i===0}">${s.name}</button>`).join('')+'</div>', 'beforebegin');
  add(q('[data-slide="4"] .console-bottom'), '<div class="scenario-output" id="scenarioOutput" hidden><p></p></div>', 'beforebegin');
  function renderScenario() {
    const s = scenarios[scene];
    q('.console-head > span:first-child').textContent = s.title;
    q('#processSteps').innerHTML = s.stages.map((name,i) => `<div class="process-step ${stage>i?'done':''} ${stage===i?'current':''}"><span class="process-number">${stage>i?'✓':i+1}</span><div><h3>${name}</h3><p>${s.details[i]}</p></div><span class="process-state">${stage>i?'已完成':stage===i?(i===3?'待人审核':'当前步骤'):'待运行'}</span></div>`).join('');
    q('#processLog').textContent = stage<0 ? `选择“${s.name}”，点击按钮走一遍公司任务流程。` : s.logs[stage];
    q('#processBtn').textContent = stage<0 ? '运行课堂示例 →' : stage===3 ? '我已审核，继续 →' : stage===5 ? '重新演示 ↻' : '下一步 →';
    q('#scenarioOutput').hidden = stage<2; q('#scenarioOutput p').textContent=s.output;
  }
  all('[data-scenario]').forEach(button => button.onclick=()=>{ scene=Number(button.dataset.scenario);stage=-1;all('[data-scenario]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderScenario(); });
  q('#processBtn').onclick=()=>{stage=stage===5?-1:stage+1;renderScenario();};renderScenario();

  // Chapter 06 — selectable stages show a concrete piece of the same content workflow.
  const marketingExamples = [
    '听懂客户：先收集一句真实问题，例如“每周做报表太慢，AI 能帮到哪一步？”它就是内容的起点。',
    '生成初稿：把问题、已授权的案例与品牌语气交给 AI，生成标题、图文提纲或短视频口播稿。',
    '人审发布：确认案例事实和表达，补上你的判断，通过合适的渠道发布。让客户知道你能解决什么问题。',
    '数据反馈：看有没有带来有效询问、合格线索和转化，把有效方法更新进 Skill，再进入下一轮。'
  ];
  all('.workflow-part').forEach((el,i)=>{
    const button=document.createElement('button');button.className=el.className;button.innerHTML=el.innerHTML;button.dataset.marketing=i;button.setAttribute('aria-pressed',String(i===0));button.style.textAlign='left';button.style.borderTop='0';button.style.borderLeft='0';el.replaceWith(button);
  });
  add(q('.workflow'), '<div class="workflow-detail" id="marketingDetail" aria-live="polite"></div>', 'afterend');
  all('[data-marketing]').forEach(button=>button.onclick=()=>{all('[data-marketing]').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button));});q('#marketingDetail').textContent=marketingExamples[Number(button.dataset.marketing)];});
  q('[data-marketing="0"]').click();
  set('[data-slide="5"] .callout', '营销自己，是建立信任；营销产品，是讲清价值。内容的反馈，最终要回到客户需求。');

  // Chapter 07 — presets and a synchronized input make live comparison easy.
  const presets = [
    {name:'小规模试点', values:[100,60,30,10,500,200]},
    {name:'公司常规业务', values:[300,60,30,8,1800,800]},
    {name:'加入审核返工', values:[300,60,30,25,1800,800]}
  ];
  const ids=['volume','hourly','before','after','subscription','other'];
  add(q('.calculator .inputs'), '<div class="preset-tabs" aria-label="测算假设">'+presets.map((p,i)=>`<button data-preset="${i}" aria-pressed="false">${p.name}</button>`).join('')+'</div>', 'beforebegin');
  add(q('.calculator .inputs'), '<div class="range-row"><label for="afterRange">拖动：AI 后单件耗时（含审核）</label><output id="afterRangeValue" for="afterRange"></output><input id="afterRange" type="range" min="0" max="60" step="0.5" value="10"></div>', 'afterend');
  const syncRange=()=>{const v=Number(q('#after').value);q('#afterRange').max=String(Math.max(60,Number.isFinite(v)?v:60));q('#afterRange').value=String(v);q('#afterRangeValue').textContent=q('#after').value===''?'待填写':`${v} 分钟`;};
  all('[data-preset]').forEach(button=>button.onclick=()=>{const p=presets[Number(button.dataset.preset)];ids.forEach((id,i)=>q('#'+id).value=p.values[i]);all('[data-preset]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));syncRange();calculate();});
  all('.inputs input').forEach(input=>input.addEventListener('input',()=>{all('[data-preset]').forEach(b=>b.setAttribute('aria-pressed','false'));syncRange();}));
  q('#afterRange').addEventListener('input',()=>{q('#after').value=q('#afterRange').value;q('#after').dispatchEvent(new Event('input',{bubbles:true}));});
  q('[data-preset="0"]').click();

  // Teaching notes stay aligned with the visible examples and ten-minute pacing.
  scripts[1]='先记三个比喻：大模型像知识很多的实习生，AIGC 是交出来的作品，智能体像专岗员工。我们点击三个概念，看同一个营销任务怎么从标题、文案，走向完整的执行流程。\n\n王明远老师笔记里最有用的提醒，是用大白话讲清楚：Token 是信息颗粒，上下文是临时工作台，知识库是资料柜。WorkBuddy、豆包和扣子等产品，是调用模型与工具的入口。\n\n智能体要有明确的身份、任务、流程与工具，重要结果仍然由人审核。如果时间允许，展开小问题，让听众选出目标、工具、流程与反馈。';
  scripts[2]='从聊天到工作，关键是让需求具体起来。只问“周报怎么写”，AI 提供思路；说清岗位、我的身份、任务、交付标准和约束，就更容易得到可用的初稿。可以现场展开任务指令模板，用一句自己的需求做演示。\n\n扣子笔记帮助我们区分工作流和多智能体：固定业务优先把步骤写清楚，复杂任务再做角色分工。Skill 存方法，Workflow 定步骤，Agent 围绕目标行动，MCP 或 API 连接外部软件。我们要的是学习、理解、判断、执行、反馈能够接得起来。';
  scripts[4]='现在把这些概念放进公司。我的想法是：借助 WorkBuddy 辅助开发，把资料、知识库、Skills 和 Agents 组织成公司的工作系统。\n\n这里可以选择数据分析、客户服务、营销内容三个场景。我们选一个演示：先读取授权资料，再做整理，生成周报或内容草稿，到了关键节点由人审核，最后记录反馈。这个网页演示的是流程逻辑，不会发送真实消息。\n\n我的小规模试点设想，是两名运营者协作：一人负责业务和审核，一人负责系统与质量。目标是把人从重复整理中释放出来，把时间放在判断、沟通和客户服务上。是否能减少多少成本，需要公司自己做试点验证。\n\n系统可以按客户需求定制，长期提供更新、维护和优化，再通过持续服务建立订阅价值。';
  scripts[5]='营销自己，是用真实经历建立信任；营销产品，是把价值讲清楚。点击四个阶段，就能看到同一条内容如何从客户问题走向生成初稿、人审发布和数据反馈。\n\n我希望公司形成持续的内容产线：每天整理选题，准备图文和视频脚本，经过审核发布，再用业务结果复盘。重点是客户有没有理解、询问和选择，而不是生成了多少条。\n\nGEO 提醒我，把资料做真实、清楚、一致，让可靠内容更容易被查找和引用。具体视频制作与发布，需要再接入对应工具。';
  scripts[6]='商业化可以从设计或小应用开始，再走向公司定制与持续订阅。订阅的价值来自更新、维护、培训和稳定交付。\n\n右边我们先用小规模试点：每月一百个任务，每个从三十分钟降到十分钟，按每小时六十元折算，再扣五百元订阅和两百元其他成本，得到一千三百元的净时间价值。它不是现金利润。\n\n现场可以点“加入审核返工”，或者拖动耗时滑块，看看为什么算上审核后结果会变化。只有质量、时间和全成本一起比较，客户才知道这套系统是否值得持续订阅。';
  tips[1]='先点击三个概念切换例子；有时间再展开小问题。';
  tips[2]='点击工作流查看周报例子；指令模板作为可选现场互动。';
  tips[4]='选一个公司场景，逐步演示并在人审节点停一下；30 秒即可。';
  tips[5]='点击四个内容阶段，展示同一个客户问题如何进入营销流程。';
  tips[6]='切换“加入审核返工”，再拖动耗时滑块，观察净值变化。';
  terms.push(['AI 工作台','基础','WorkBuddy 等产品提供使用模型、资料和外部工具的工作入口。产品可能组合多种能力，工作台与底层模型不是同一层概念。']);
  renderTerms();
  add(q('#sourcesDialog .source-list'), '<li><b>9.10 下午王明远老师笔记</b>：采用实习生、专岗员工、工作台与资料柜的类比，以及五项任务指令和人工审核的方法。</li><li><b>9.10 上午扣子笔记</b>：采用知识库、工作流、多智能体的选型，以及通过 API 把 AI 接入公司系统的思路。</li><li><a href="https://www.codebuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Skills-Market" target="_blank" rel="noopener noreferrer">WorkBuddy 官方：Skills 与工具能力</a>；<a href="https://docs.coze.cn/guides_agent_workflow" target="_blank" rel="noopener noreferrer">扣子官方：智能体工作流</a>。</li>');

  // Small depth changes only on non-interactive parts of panels; touch stays scrollable.
  all('.concept-panel,.console,.calculator,.question-box').forEach(el=>{
    el.classList.add('tilt-surface');
    el.addEventListener('pointermove',event=>{
      if(reduced.matches||event.pointerType==='touch'||event.target.closest('input,button,select,textarea,summary'))return;
      const r=el.getBoundingClientRect();el.style.setProperty('--tilt-x',`${-(event.clientY-r.top-r.height/2)/r.height*3}deg`);el.style.setProperty('--tilt-y',`${(event.clientX-r.left-r.width/2)/r.width*3}deg`);
    });
    el.addEventListener('pointerleave',()=>{el.style.setProperty('--tilt-x','0deg');el.style.setProperty('--tilt-y','0deg');});
  });
  // Prevent classroom keyboard shortcuts from intercepting select controls in the exercise.
  document.addEventListener('keydown',event=>{if(event.target.closest('textarea,select'))event.stopImmediatePropagation();},true);
  hashSlide();
})();
