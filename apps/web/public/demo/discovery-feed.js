/* Fictional editorial previews; no live venue inventory or engagement counts. */
(() => {
  const stories = [
    {
      id: "courtyard",
      kind: "space",
      title: "梧桐树下，办一场有呼吸感的发布会",
      meta: "空间 · 静安 · 庭院",
      image: "courtyard.png",
      portrait: true,
      sample: true,
      copy: "不急着进场，先在树下停一会儿。\n室内留给发布，庭院留给交流，空间之间有了自然的过渡。想做一场距离近一点、节奏慢一点的品牌活动，可以从这个方向开始。",
      prompt: "我想找一个带庭院、适合小型品牌发布会的空间",
    },
    {
      id: "gallery",
      kind: "space",
      title: "这间白盒子，把光留给了展品",
      meta: "空间 · 徐汇 · 展览",
      image: "gallery.png",
      portrait: false,
      copy: "白墙、自然光，还有刚刚好的留白。\n展品不用和复杂的背景争夺视线。可以想象一场小型展览，也可以把这里变成新品第一次与人见面的地方。布展前，记得把光线、承重和挂画方式一起确认。",
      prompt: "我想找一个自然采光好、白墙背景的展览空间",
    },
    {
      id: "launch",
      kind: "case",
      title: "不搭大舞台，发布会也能很好看",
      meta: "案例 · 品牌发布",
      image: "launch.webp",
      portrait: false,
      sample: true,
      copy: "把舞台放低，把交流拉近。\n这一版发布会设想，用简单的木椅和一面留白背景组织现场。发布结束，观众可以走进庭院继续聊天。少一点搭建，让产品和人的交流成为主角。",
      prompt: "我想办一场小型品牌发布会，布置简洁，方便现场交流",
    },
    {
      id: "night-courtyard",
      kind: "opportunity",
      title: "11月的庭院，等一个有趣的品牌",
      meta: "档期机会 · 共创申请",
      image: "night-courtyard.webp",
      portrait: true,
      sample: true,
      copy: "灯亮起来，庭院就有了另一种表情。\n在这项虚构的共创设想里，品牌可提交活动方案，申请基础场租减免。不是无条件免费：档期需要确认，搭建、设备等费用另计。可以先看白庭示例里的申请条件。",
      prompt: "我想了解庭院品牌共创和基础场租减免的申请条件",
    },
    {
      id: "warehouse",
      kind: "space",
      title: "找到一间，自带电影感的挑高空间",
      meta: "空间 · 黄浦 · 工业风",
      image: "warehouse.png",
      portrait: true,
      copy: "高窗把光拉长，旧砖和钢结构留下了时间的痕迹。\n这样的空间，适合尝试大尺度装置、展陈或影像拍摄。决定方案之前，层高之外，也要一起核对用电、装卸与声音限制。",
      prompt: "我想找一个工业风挑高空间，用于展陈或拍摄",
    },
    {
      id: "rooftop",
      kind: "space",
      title: "天台见，给日落留一个席位",
      meta: "空间 · 静安 · 屋顶",
      image: "rooftop.webp",
      portrait: false,
      copy: "等天色慢慢变暖，再把一场见面留在屋顶。\n小型分享、品牌晚间聚会，都可以沿着这个氛围展开。屋顶方案还需要把天气备选、承重、噪音与开放时间放在同一张清单里。",
      prompt: "我想找一个适合日落时段小型品牌聚会的屋顶空间，需要雨天备选",
    },
    {
      id: "popup",
      kind: "case",
      title: "把快闪开进老洋房，会发生什么",
      meta: "案例 · 街区快闪",
      image: "popup.webp",
      portrait: false,
      copy: "一扇打开的门，让路过变成了走进。\n这次快闪设想把展示延伸到街道一侧，让橱窗、入口和室内形成连续的观看体验。选址时，别只看外立面：进店动线、周边人群和沿街展示条件同样关键。",
      prompt: "我想找一个沿街老洋房空间做品牌快闪，重视入口和橱窗展示",
    },
    {
      id: "art-room",
      kind: "case",
      title: "一场小型展览，从这扇窗开始",
      meta: "灵感 · 空间布置",
      image: "art-room.webp",
      portrait: true,
      copy: "展览不一定从白墙开始，也可以从一束窗边的光开始。\n几件作品、一张长凳，就能让人愿意多坐一会儿。这是一份小型展览的布置灵感；真实布展还需要核对采光变化、作品保护和参观动线。",
      prompt: "我想找一个安静、有自然光的空间做小型艺术展览",
    },
  ];
  stories.forEach((story) => {
    story.venue = window.Space4Venues.find((venue) =>
      venue.storyIds.includes(story.id),
    );
  });
  const feed = document.getElementById("editorial-feed");
  const dialog = document.getElementById("story-dialog");
  const storageKey = "space-four-editorial-bookmarks-v1";
  const bookmarkPath = "M4 2h12v17l-6-4-6 4z";
  let saved = new Set();
  let activeStory;
  let trigger;
  let returnY = 0;
  let continueToAgent = false;
  let continueToMap = false;
  try {
    const value = JSON.parse(sessionStorage.getItem(storageKey) || "[]");
    if (Array.isArray(value))
      saved = new Set(
        value.filter((id) => stories.some((story) => story.id === id)),
      );
  } catch {
    /* Session-only state is optional. */
  }

  function openStory(story, link) {
    activeStory = story;
    trigger = link;
    returnY = window.scrollY;
    const img = document.getElementById("story-image");
    img.src = `assets/${story.image}`;
    img.alt = `${story.title}，生成式概念配图`;
    document.getElementById("story-title").textContent = story.title;
    document.getElementById("story-meta").textContent = story.meta;
    document.getElementById("story-copy").textContent = story.copy;
    document.getElementById("story-location").textContent =
      `地图位置 · ${story.venue.name} ↗`;
    document.getElementById("story-space-link").hidden = !story.sample;
    document.getElementById("story-demand").hidden = !!story.sample;
    dialog.showModal();
  }

  const cards = stories.map((story, index) => {
    const article = document.createElement("article");
    article.className = `feed-card${story.portrait ? " portrait" : ""}`;
    article.dataset.kind = story.kind;
    article.dataset.storyId = story.id;
    article.dataset.assetId = story.venue.id;
    const link = document.createElement("a");
    link.href = "index.html";
    link.setAttribute("aria-haspopup", "dialog");
    link.setAttribute("aria-controls", "story-dialog");
    const image = document.createElement("img");
    image.src = `assets/${story.image}`;
    image.alt = `${story.title}，生成式概念配图`;
    image.width = 400;
    image.height = story.portrait ? 500 : 300;
    image.loading = index < 2 ? "eager" : "lazy";
    const title = document.createElement("h3");
    title.textContent = story.title;
    const meta = document.createElement("p");
    meta.textContent = story.meta;
    link.append(image, title, meta);
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openStory(story, link);
    });
    const save = document.createElement("button");
    save.type = "button";
    save.className = "story-save";
    function refreshSave() {
      const selected = saved.has(story.id);
      save.setAttribute("aria-pressed", String(selected));
      save.setAttribute(
        "aria-label",
        `${selected ? "取消收藏" : "收藏"}：${story.title}（本标签页）`,
      );
    }
    save.innerHTML = `<svg viewBox="0 0 20 22" aria-hidden="true"><path d="${bookmarkPath}"/></svg>`;
    refreshSave();
    save.addEventListener("click", () => {
      if (saved.has(story.id)) saved.delete(story.id);
      else saved.add(story.id);
      refreshSave();
      try {
        sessionStorage.setItem(storageKey, JSON.stringify([...saved]));
        document.getElementById("feed-note").textContent = saved.has(story.id)
          ? "已收藏，仅在当前标签页暂存。"
          : "已取消收藏。";
      } catch {
        document.getElementById("feed-note").textContent =
          "收藏仅在本页有效，刷新后可能丢失。";
      }
    });
    const locate = document.createElement("button");
    locate.type = "button";
    locate.className = "story-location";
    locate.textContent = `位置 · ${story.venue.name} ↗`;
    locate.setAttribute(
      "aria-label",
      `在地图上查看${story.venue.name}的虚构示意位置`,
    );
    locate.addEventListener("click", () => locateStory(story));
    article.append(link, locate, save);
    return article;
  });

  function filter(kind) {
    const columns = [
      document.createElement("div"),
      document.createElement("div"),
    ];
    columns.forEach((column) => {
      column.className = "feed-column";
    });
    let count = 0;
    cards.forEach((card) => {
      if (kind === "all" || card.dataset.kind === kind)
        columns[count++ % 2].append(card);
    });
    feed.replaceChildren(...columns);
    document.getElementById("feed-note").textContent = `${count}条内容`;
  }
  function locateStory(story) {
    window.Space4DiscoveryMap.selectVenue(story.venue.id);
    const map = document.querySelector(".map-section");
    window.scrollTo({
      top: map.getBoundingClientRect().top + window.scrollY - 8,
      behavior: "auto",
    });
  }
  window.Space4Feed = {
    filter,
    openVenue(id, link) {
      const story = stories.find((story) => story.venue.id === id);
      if (story) openStory(story, link);
    },
  };
  document.addEventListener("space4:venue-selected", (event) => {
    cards.forEach((card) =>
      card.classList.toggle(
        "is-map-selected",
        card.dataset.assetId === event.detail.assetId,
      ),
    );
  });
  filter("all");
  document
    .getElementById("close-story")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    if (continueToMap) {
      continueToMap = false;
      locateStory(activeStory);
      return;
    }
    if (continueToAgent) {
      continueToAgent = false;
      document.getElementById("agent-input").value = activeStory.prompt;
      document.getElementById("open-agent").click();
      return;
    }
    trigger?.focus({ preventScroll: true });
    window.scrollTo({ top: returnY, behavior: "auto" });
  });
  document.getElementById("story-location").addEventListener("click", () => {
    continueToMap = true;
    dialog.close();
  });
  document.getElementById("story-demand").addEventListener("click", () => {
    continueToAgent = true;
    dialog.close();
  });
})();
