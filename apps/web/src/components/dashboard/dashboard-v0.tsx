"use client";

import { FormEvent, useState } from "react";

const portfolioMetrics = [
  {
    label: "面积出租率",
    value: "78.4%",
    detail: "目标 85% · 差 6.6 个百分点",
    tone: "warning",
  },
  {
    label: "60 天收入敞口",
    value: "¥31.8万",
    detail: "7 份租约 · 2,460 平方米",
    tone: "critical",
  },
  {
    label: "招商管线覆盖",
    value: "1.4×",
    detail: "加权需求 ÷ 空置与临期面积",
    tone: "positive",
  },
  {
    label: "关键数据完整度",
    value: "92%",
    detail: "11 个待补字段 · 3 项已过期",
    tone: "neutral",
  },
];

const operationLenses = [
  { key: "risk", label: "租赁风险", value: "7 份临期" },
  { key: "demand", label: "招商动能", value: "1.4× 覆盖" },
  { key: "usage", label: "空间效率", value: "62% 利用" },
  { key: "experience", label: "客户体验", value: "4.2 / 5" },
];

const lensCopy: Record<string, { title: string; detail: string }> = {
  risk: {
    title: "02 号楼是当前首要风险点",
    detail: "60 天内 4 份租约到期，月租金敞口 ¥18.6 万。",
  },
  demand: {
    title: "活动与办公需求可以覆盖大部分空置",
    detail: "31 条有效线索中，12 条已预约看场，5 份方案待推进。",
  },
  usage: {
    title: "北区工作室实际利用率偏低",
    detail: "近 30 天平均利用率 62%，低于园区均值 11 个百分点。",
  },
  experience: {
    title: "服务体验稳定，但响应速度下降",
    detail: "综合满意度 4.2 分，8 个工单仍未关闭，平均响应 3.6 小时。",
  },
};

const priorityActions = [
  {
    priority: "01",
    level: "高",
    title: "启动 02 号楼续租沟通",
    detail: "4 份租约进入 60 天窗口",
    impact: "保全月租 ¥18.6万",
  },
  {
    priority: "02",
    level: "高",
    title: "推进 A-103 报价审批",
    detail: "已空置 94 天 · 2 条匹配需求",
    impact: "预计缩短空置 21 天",
  },
  {
    priority: "03",
    level: "中",
    title: "补齐广告位客流数据",
    detail: "3 项资产缺少最近 30 天数据",
    impact: "解除方案推荐限制",
  },
];

const buildings = [
  { name: "01", className: "building building-one", status: "stable" },
  { name: "02", className: "building building-two", status: "risk" },
  { name: "03", className: "building building-three", status: "stable" },
  { name: "04", className: "building building-four", status: "vacant" },
];

const navItems = ["总览", "园区", "资产", "智能搜索", "方案"];

export function DashboardV0() {
  const [activeLens, setActiveLens] = useState("risk");
  const [horizon, setHorizon] = useState(60);
  const [selectedBuilding, setSelectedBuilding] = useState("02");
  const [command, setCommand] = useState("");
  const [commandStatus, setCommandStatus] =
    useState("可直接询问资产、租约和招商情况");

  function runCommand(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!command.trim()) {
      setCommandStatus("请输入问题，或使用示例：显示 60 天内到期租约");
      return;
    }

    setActiveLens("risk");
    setHorizon(60);
    setSelectedBuilding("02");
    setCommandStatus("已筛选 7 份临期租约，并定位到风险最高的 02 号楼");
  }

  return (
    <main className="app-shell">
      <aside className="side-rail" aria-label="主导航">
        <div className="brand-mark" aria-label="智能空间资产操作系统">
          <span>空</span>
          <i />
        </div>
        <nav className="rail-nav">
          {navItems.map((item, index) => (
            <button
              className={index === 0 ? "rail-item is-active" : "rail-item"}
              key={item}
              type="button"
              aria-label={item}
              title={item}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
            </button>
          ))}
        </nav>
        <button
          className="avatar-button"
          type="button"
          aria-label="打开账户菜单"
        >
          我
        </button>
      </aside>

      <section className="workspace">
        <header className="workspace-header">
          <div>
            <div className="context-row">
              <p className="context-line">上海 · 西岸创意园</p>
              <span className="demo-badge">演示数据</span>
            </div>
            <h1>经营决策中心</h1>
          </div>
          <div className="header-actions">
            <button className="text-button" type="button">
              数据更新于 09:30
            </button>
            <button className="primary-button" type="button">
              新增资产
            </button>
          </div>
        </header>

        <section className="metric-strip" aria-label="核心经营指标">
          {portfolioMetrics.map((metric, index) => (
            <article
              className={`metric metric-${metric.tone}`}
              key={metric.label}
            >
              <div className="metric-index">0{index + 1}</div>
              <p>{metric.label}</p>
              <div className="metric-value">{metric.value}</div>
              <span>{metric.detail}</span>
            </article>
          ))}
        </section>

        <section className="content-grid">
          <section className="spatial-panel" aria-labelledby="spatial-title">
            <div className="panel-heading spatial-heading">
              <div>
                <p className="section-label">资产经营视角</p>
                <h2 id="spatial-title">空间决策图</h2>
              </div>
              <div className="horizon-control" aria-label="风险观察周期">
                {[30, 60, 90].map((days) => (
                  <button
                    className={horizon === days ? "is-active" : ""}
                    key={days}
                    type="button"
                    onClick={() => setHorizon(days)}
                  >
                    {days} 天
                  </button>
                ))}
              </div>
            </div>

            <div className="lens-switch" aria-label="经营分析视角">
              {operationLenses.map((lens) => (
                <button
                  className={activeLens === lens.key ? "is-active" : ""}
                  key={lens.key}
                  type="button"
                  onClick={() => setActiveLens(lens.key)}
                >
                  <span>{lens.label}</span>
                  <strong>{lens.value}</strong>
                </button>
              ))}
            </div>

            <div className="spatial-stage">
              <div
                className="model-placeholder"
                aria-label="三维空间模型占位区域"
              >
                <div className="ground-grid" />
                {buildings.map((building) => (
                  <button
                    className={`${building.className} status-${building.status} ${selectedBuilding === building.name ? "is-selected" : ""}`}
                    type="button"
                    key={building.name}
                    onClick={() => setSelectedBuilding(building.name)}
                    aria-label={`选择 ${building.name} 号楼`}
                  >
                    <span>{building.name} 号楼</span>
                  </button>
                ))}
                <div className="model-caption">
                  <span>{lensCopy[activeLens].title}</span>
                  <p>{lensCopy[activeLens].detail}</p>
                </div>
              </div>

              <div className="stage-context">
                <span>当前选择</span>
                <strong>{selectedBuilding} 号楼</strong>
                <small>{horizon} 天观察周期</small>
              </div>

              <div className="legend" aria-label="资产状态图例">
                <span>
                  <i className="status occupied" />
                  经营稳定
                </span>
                <span>
                  <i className="status vacant" />
                  空置待租
                </span>
                <span>
                  <i className="status expiring" />
                  收入风险
                </span>
              </div>

              <form className="command-dock" onSubmit={runCommand}>
                <span className="command-prefix">智能</span>
                <div className="command-input-wrap">
                  <label className="sr-only" htmlFor="asset-command">
                    询问资产情况
                  </label>
                  <input
                    id="asset-command"
                    type="text"
                    value={command}
                    onChange={(event) => setCommand(event.target.value)}
                    placeholder="例如：显示 60 天内到期的租约"
                  />
                  <small aria-live="polite">{commandStatus}</small>
                </div>
                <button type="submit" aria-label="执行指令">
                  执行
                </button>
              </form>
            </div>

            <section className="decision-rail" aria-label="经营辅助指标">
              <article>
                <div className="decision-heading">
                  <span>招商漏斗</span>
                  <strong>31 条有效线索</strong>
                </div>
                <div className="funnel-line" aria-label="招商阶段分布">
                  <i style={{ width: "100%" }} />
                  <i style={{ width: "63%" }} />
                  <i style={{ width: "39%" }} />
                  <i style={{ width: "22%" }} />
                </div>
                <p>看场 12 · 方案 5 · 谈判 2</p>
              </article>
              <article>
                <div className="decision-heading">
                  <span>租金回收</span>
                  <strong>96.7%</strong>
                </div>
                <div className="progress-track">
                  <i style={{ width: "96.7%" }} />
                </div>
                <p>逾期 ¥8.4 万 · 其中 30 天以上 ¥2.1 万</p>
              </article>
              <article>
                <div className="decision-heading">
                  <span>空间利用</span>
                  <strong>62%</strong>
                </div>
                <div className="progress-track usage">
                  <i style={{ width: "62%" }} />
                </div>
                <p>较园区均值低 11 个百分点 · 北区需复核</p>
              </article>
            </section>
          </section>

          <aside className="intelligence-panel">
            <div className="panel-heading compact">
              <div>
                <p className="section-label">按经营影响排序</p>
                <h2>今日行动</h2>
              </div>
              <button
                className="count-button"
                type="button"
                aria-label="查看五项待办"
              >
                05
              </button>
            </div>

            <div className="risk-summary">
              <div className="risk-number">¥31.8万</div>
              <div>
                <span>60 天收入风险</span>
                <p>集中在 02 号楼，管线覆盖尚未完全消化风险</p>
              </div>
            </div>

            <div className="priority-list">
              {priorityActions.map((action) => (
                <button
                  className="priority-row"
                  type="button"
                  key={action.priority}
                >
                  <span className="priority-index">{action.priority}</span>
                  <span className="priority-copy">
                    <span className={`priority-level level-${action.level}`}>
                      {action.level}优先
                    </span>
                    <strong>{action.title}</strong>
                    <small>{action.detail}</small>
                    <em>{action.impact}</em>
                  </span>
                  <span className="row-action">处理</span>
                </button>
              ))}
            </div>

            <section className="selected-asset">
              <div className="asset-title-row">
                <div>
                  <span className="asset-id">资产编号 · SHA-WB-B02-F03-07</span>
                  <h3>北区创意工作室 307</h3>
                </div>
                <span className="vacancy-chip">空置</span>
              </div>
              <dl className="asset-facts asset-facts-expanded">
                <div>
                  <dt>面积</dt>
                  <dd>186 平方米</dd>
                </div>
                <div>
                  <dt>挂牌价</dt>
                  <dd>¥7.8 / 平方米 / 天</dd>
                </div>
                <div>
                  <dt>空置</dt>
                  <dd>94 天</dd>
                </div>
                <div>
                  <dt>匹配需求</dt>
                  <dd>2 条</dd>
                </div>
              </dl>
              <div className="data-health">
                <div>
                  <span>资料可信度</span>
                  <strong>86%</strong>
                </div>
                <div className="progress-track">
                  <i style={{ width: "86%" }} />
                </div>
                <p>缺少最近 30 天客流与最新现场照片</p>
              </div>
              <button className="asset-button" type="button">
                打开资产档案
              </button>
            </section>
          </aside>
        </section>
      </section>
    </main>
  );
}
