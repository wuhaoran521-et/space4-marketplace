"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { CSSProperties, FormEvent } from "react";

const months = ["4月", "5月", "6月", "7月", "8月"] as const;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
type Month = (typeof months)[number];
type SlotState = "available" | "limited" | "booked";

type SpaceFixture = {
  assetId: string;
  name: string;
  district: string;
  summary: string;
  model: "courtyard" | "gallery" | "warehouse";
  availability: Record<Month, { state: SlotState; label: string }>;
};

type Opportunity = {
  id: string;
  image: string;
  imageAlt: string;
  type: string;
  title: string;
  meta: string;
  price: string;
  note: string;
};

const spaces: SpaceFixture[] = [
  {
    assetId: "SHA-JA-001",
    name: "白庭",
    district: "静安",
    summary: "独栋院落 · 620㎡ · 发布与展陈",
    model: "courtyard",
    availability: {
      "4月": { state: "booked", label: "已预订" },
      "5月": { state: "limited", label: "可登记" },
      "6月": { state: "available", label: "可用 3 天" },
      "7月": { state: "booked", label: "已预订" },
      "8月": { state: "limited", label: "可登记" },
    },
  },
  {
    assetId: "SHA-XH-014",
    name: "光廊",
    district: "徐汇",
    summary: "自然光展厅 · 480㎡ · 秀场与拍摄",
    model: "gallery",
    availability: {
      "4月": { state: "limited", label: "可登记" },
      "5月": { state: "available", label: "可用 5 天" },
      "6月": { state: "booked", label: "已预订" },
      "7月": { state: "available", label: "可用 2 周" },
      "8月": { state: "limited", label: "可登记" },
    },
  },
  {
    assetId: "SHA-HP-023",
    name: "旧仓",
    district: "黄浦",
    summary: "工业挑高 · 860㎡ · 快闪与大型活动",
    model: "warehouse",
    availability: {
      "4月": { state: "booked", label: "已预订" },
      "5月": { state: "booked", label: "已预订" },
      "6月": { state: "available", label: "可用 8 天" },
      "7月": { state: "limited", label: "可登记" },
      "8月": { state: "available", label: "可用 1 个月" },
    },
  },
];

const opportunities: Opportunity[] = [
  {
    id: "OPP-001",
    image: `${basePath}/spaces/jingan-courtyard.png`,
    imageAlt: "静安独栋庭院实景概念图",
    type: "免费合作",
    title: "静安寺独栋庭院｜品牌共创开放 3 天",
    meta: "6月12日至15日 · 300㎡ · 新品发布 / 内容拍摄",
    price: "合作价 ¥0",
    note: "提交品牌方案，业主择优确认",
  },
  {
    id: "OPP-002",
    image: `${basePath}/spaces/xuhui-warehouse.png`,
    imageAlt: "徐汇滨江工业仓库实景概念图",
    type: "低价竞拍",
    title: "徐汇滨江仓库｜黄金周末限时开放",
    meta: "6月21日至22日 · 860㎡ · 快闪 / 秀场 / 品牌活动",
    price: "¥1,000 起拍",
    note: "报价截止前可随时更新方案",
  },
  {
    id: "OPP-003",
    image: `${basePath}/spaces/french-concession-gallery.png`,
    imageAlt: "衡复风貌区自然光展厅实景概念图",
    type: "联合策展",
    title: "衡复自然光展厅｜内容伙伴招募中",
    meta: "7月5日至12日 · 480㎡ · 展览 / 拍摄 / 沙龙",
    price: "场租减免 70%",
    note: "适合具有公共内容价值的项目",
  },
];

function MiniModel({ variant }: { variant: SpaceFixture["model"] }) {
  return (
    <span className={`mini-model mini-model-${variant}`} aria-hidden="true">
      <i className="mini-block mini-a" />
      <i className="mini-block mini-b" />
      <i className="mini-block mini-c" />
    </span>
  );
}

function Model({ variant }: { variant: SpaceFixture["model"] }) {
  return (
    <div className={`space-model model-${variant}`} aria-hidden="true">
      <span className="model-floor" />
      <span className="model-block model-a" />
      <span className="model-block model-b" />
      <span className="model-block model-c" />
      <span className="model-block model-d" />
      <span className="model-opening model-opening-a" />
      <span className="model-opening model-opening-b" />
      <span className="model-stairs">
        {Array.from({ length: 7 }, (_, index) => (
          <i key={index} />
        ))}
      </span>
    </div>
  );
}

export function SpaceMarketHome() {
  const [spaceIndex, setSpaceIndex] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState<Month>("6月");
  const [opportunityIndex, setOpportunityIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [feedback, setFeedback] = useState("");
  const pointerStartX = useRef<number | null>(null);
  const space = spaces[spaceIndex];
  const selectedSlot = space.availability[selectedMonth];
  const opportunity = opportunities[opportunityIndex];
  const nextOpportunity =
    opportunities[(opportunityIndex + 1) % opportunities.length];

  function moveSpace(direction: number) {
    setSpaceIndex(
      (current) => (current + direction + spaces.length) % spaces.length,
    );
    setFeedback("");
  }

  function moveOpportunity(direction: number) {
    setOpportunityIndex(
      (current) =>
        (current + direction + opportunities.length) % opportunities.length,
    );
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(
      query.trim()
        ? `已记录需求，正在比较 ${selectedMonth} 的精选空间。`
        : "请先描述日期、区域、人数或空间氛围。",
    );
  }

  return (
    <main className="market-home">
      <header className="market-nav">
        <a className="space-wordmark" href="#top" aria-label="SPACE⁴ 首页">
          SPACE<sup>4</sup>
        </a>
        <nav aria-label="主导航">
          <a href="#find">找空间</a>
          <a href="#opportunities">核心机会</a>
          <a href="#publish">发布空间</a>
        </nav>
        <button className="nav-account" type="button" aria-label="打开账户菜单">
          登录
        </button>
      </header>

      <section className="market-hero" id="top">
        <div className="hero-copy" id="find">
          <p className="eyebrow">AI 原生商业空间交易平台</p>
          <h1>空间，加上时间</h1>
          <p className="hero-intro">找到恰好在此刻，为你的想法留白的空间。</p>
          <form className="space-search" onSubmit={handleSearch}>
            <label htmlFor="space-demand">描述你想让什么发生</label>
            <div className="search-row">
              <input
                id="space-demand"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="六月，在静安找一处有自然光的发布空间"
              />
              <button type="submit">开始匹配</button>
            </div>
            <p className="search-feedback" aria-live="polite">
              {feedback || "AI 将同时理解空间、时间和活动目的。"}
            </p>
          </form>
        </div>

        <section
          className="space-stage"
          aria-label={`${space.district} ${space.name}，当前查看 ${selectedMonth}`}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") moveSpace(-1);
            if (event.key === "ArrowRight") moveSpace(1);
          }}
          onPointerDown={(event) => {
            pointerStartX.current = event.clientX;
          }}
          onPointerUp={(event) => {
            if (pointerStartX.current === null) return;
            const distance = event.clientX - pointerStartX.current;
            if (Math.abs(distance) > 56) moveSpace(distance > 0 ? -1 : 1);
            pointerStartX.current = null;
          }}
        >
          <div className="stage-caption" aria-hidden="true">
            <span>SPACE</span>
            <i />
            <span>TIME</span>
          </div>
          <div className="time-planes" aria-label="选择月份">
            {months.map((month, index) => {
              const slot = space.availability[month];
              const planeStyle = {
                "--plane-x": `${index * 74}px`,
                "--plane-mobile-x": `${index * 41}px`,
                "--plane-y": `${index * -8}px`,
                "--plane-z": `${index + 1}`,
              } as CSSProperties;
              return (
                <button
                  className={`time-plane slot-${slot.state} ${selectedMonth === month ? "is-selected" : ""}`}
                  key={month}
                  style={planeStyle}
                  type="button"
                  aria-pressed={selectedMonth === month}
                  onClick={() => setSelectedMonth(month)}
                >
                  <strong>{month}</strong>
                  <span className="plane-cut plane-cut-a" />
                  <span className="plane-cut plane-cut-b" />
                  <span className="plane-cut plane-cut-c" />
                  <small>{slot.label}</small>
                </button>
              );
            })}
          </div>
          <Model variant={space.model} />
          <div className="slot-summary" aria-live="polite">
            <span>{selectedMonth}</span>
            <strong>{selectedSlot.label}</strong>
          </div>
          <div className="space-switcher">
            <div className="current-space">
              <span>
                精选空间 {String(spaceIndex + 1).padStart(2, "0")} /{" "}
                {String(spaces.length).padStart(2, "0")}
              </span>
              <strong>
                {space.district} · {space.name}
              </strong>
              <small>{space.summary}</small>
            </div>
            <div className="switch-arrows" aria-label="顺序切换空间">
              <button
                type="button"
                onClick={() => moveSpace(-1)}
                aria-label="上一个空间"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => moveSpace(1)}
                aria-label="下一个空间"
              >
                →
              </button>
            </div>
            <div className="space-thumbnails" aria-label="直接选择空间">
              {spaces.map((item, index) => (
                <button
                  className={index === spaceIndex ? "is-active" : ""}
                  type="button"
                  key={item.assetId}
                  onClick={() => setSpaceIndex(index)}
                  aria-label={`查看 ${item.district} ${item.name}`}
                  aria-pressed={index === spaceIndex}
                >
                  <MiniModel variant={item.model} />
                </button>
              ))}
            </div>
          </div>
        </section>
      </section>

      <section
        className="opportunity-section"
        id="opportunities"
        aria-label="核心空间机会"
      >
        <article className="opportunity-card" key={opportunity.id}>
          <div className="opportunity-photo">
            <Image
              src={opportunity.image}
              alt={opportunity.imageAlt}
              fill
              sizes="(max-width: 760px) 100vw, 40vw"
              priority
            />
            <span className="photo-index">
              {String(opportunityIndex + 1).padStart(2, "0")} /{" "}
              {String(opportunities.length).padStart(2, "0")}
            </span>
          </div>
          <div className="opportunity-copy">
            <div className="opportunity-heading">
              <span className="opportunity-label">{opportunity.type}</span>
              <span className="concept-note">概念活动示例</span>
            </div>
            <h2>{opportunity.title}</h2>
            <p>{opportunity.meta}</p>
            <div className="opportunity-action">
              <div>
                <strong>{opportunity.price}</strong>
                <small>{opportunity.note}</small>
              </div>
              <button type="button">
                查看合作条件 <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
          <div className="opportunity-nav" aria-label="切换核心机会">
            <button
              type="button"
              onClick={() => moveOpportunity(-1)}
              aria-label="上一个机会"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => moveOpportunity(1)}
              aria-label="下一个机会"
            >
              →
            </button>
          </div>
        </article>
        <button
          className="opportunity-peek"
          type="button"
          onClick={() => moveOpportunity(1)}
        >
          <span className="peek-photo">
            <Image src={nextOpportunity.image} alt="" fill sizes="240px" />
          </span>
          <span className="peek-copy">
            <small>下一个机会</small>
            <strong>{nextOpportunity.title}</strong>
            <em>{nextOpportunity.price}</em>
          </span>
        </button>
      </section>

      <footer className="market-footer" id="publish">
        <span>SPACE⁴</span>
        <span>让空间在合适的时间发生</span>
      </footer>
    </main>
  );
}
