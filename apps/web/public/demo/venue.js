/* Detail page: asset-scoped stories and local-only inquiry drafts. */
(() => {
  const $ = (id) => document.getElementById(id);
  const isPost = document.body.dataset.page === "post";
  const params = new URLSearchParams(location.search);
  const venues = window.Space4Venues;
  const requested = params.get("venue");
  const venue = venues.find((item) => item.id === requested) || venues[0];
  const facts = window.Space4VenueDetails[venue.id];
  const stories = window.Space4Stories.filter(
    (item) => item.venue.id === venue.id,
  );
  const initial =
    stories.find((item) => item.id === params.get("story")) ||
    stories.find((item) => item.kind === "case") ||
    stories[0];
  const propertyStory =
    stories.find((story) => story.kind === "space") || stories[0];
  const active = isPost ? initial : propertyStory;
  const storageKey = "space-four-venue-inquiries-v1";
  const bookmarkKey = isPost
    ? "space-four-editorial-bookmarks-v1"
    : "space-four-venue-bookmarks-v1";
  const bookmarkId = isPost ? active.id : venue.id;
  const states = {
    available: "可用",
    unavailable: "不可用",
    unknown: "待确认",
  };
  function make(tag, text, className) {
    const node = document.createElement(tag);
    node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function image(node, story) {
    node.src = `assets/${story.image}`;
    node.alt = `${story.title}，生成式概念配图，非实景`;
  }
  function renderHeader() {
    image($("hero-image"), active);
    $("story-meta").textContent = isPost
      ? active.meta + " / 模拟案例帖子"
      : "上海 · " + venue.area;
    $("story-title").textContent = isPost ? active.title : venue.name;
    $("story-copy").textContent = isPost ? active.copy : facts.environment;
    document.title =
      (isPost ? active.title : venue.name + " · 空间详情") + " · SPACE⁴";
    const next = new URL(location.href);
    next.searchParams.set("venue", venue.id);
    if (isPost) next.searchParams.set("story", active.id);
    else next.searchParams.delete("story");
    history.replaceState(null, "", next);
    if (isPost) {
      if (params.get("from") === "venue") {
        const back = document.querySelector(".topbar a");
        back.href =
          "venue.html?venue=" + encodeURIComponent(venue.id) + "#cases";
        back.setAttribute("aria-label", "返回空间详情");
      }
      $("linked-venue").href =
        "venue.html?venue=" + encodeURIComponent(venue.id);
      image($("linked-venue-image"), propertyStory);
      $("linked-venue-name").textContent = venue.name;
      $("linked-venue-meta").textContent =
        venue.area + " · " + facts.area + "㎡";
    }
    refreshBookmark();
  }
  if (!isPost) {
    $("venue-name").textContent = venue.name;
    $("venue-area").textContent = `上海 · ${venue.area}`;
    facts.tags.forEach((tag) => $("tags").append(make("span", tag)));
    [
      ["总可用面积", facts.area, "㎡"],
      ["室内净层高", facts.height ?? "露天", facts.height ? "m" : ""],
      ["剧院式参考容量", facts.capacity, "人"],
      ["基础场租参考", facts.price.toLocaleString("zh-CN"), "元 / 日"],
    ].forEach(([label, value, unit]) => {
      const group = document.createElement("div");
      const dd = make("dd", String(value));
      dd.append(make("small", unit));
      group.append(make("dt", label), dd);
      $("metrics").append(group);
    });
    const ratio = (facts.indoor / facts.area) * 100;
    [ratio, 100 - ratio].forEach((value) => {
      const part = document.createElement("span");
      part.style.width = `${value}%`;
      $("area-track").append(part);
    });
    $("area-track").setAttribute("role", "img");
    $("area-track").setAttribute(
      "aria-label",
      `室内${ratio.toFixed(1)}%，${facts.side}${(100 - ratio).toFixed(1)}%`,
    );
    [
      [`室内 ${facts.indoor}㎡`, ratio],
      [`${facts.side} ${facts.area - facts.indoor}㎡`, 100 - ratio],
    ].forEach(([text, value]) => {
      const node = make("span", text + " ");
      node.append(make("strong", `${value.toFixed(1)}%`));
      $("area-legend").append(node);
    });
    $("conditions").textContent = facts.conditions;
    $("environment").textContent = facts.environment;
    $("plan-main").textContent = `室内主空间\n${facts.indoor}㎡`;
    $("plan-side").textContent =
      `${facts.side}\n${facts.area - facts.indoor}㎡`;
    $("guest-route").textContent = facts.route;
    $("map-link").href = `discovery.html?venue=${encodeURIComponent(venue.id)}`;
    $("price").textContent = `${facts.price.toLocaleString("zh-CN")} 元 / 日`;
    $("fees").textContent = facts.fees;
    $("opportunity").textContent =
      facts.opportunity || "具体方案、额外服务与可用时段需另行确认。";
    venue.states.forEach((state, index) => {
      const node = make("div", "", "date " + state);
      node.append(
        make("strong", String(index + 10)),
        make("small", states[state]),
      );
      $("date-list").append(node);
    });
    const cases = stories.filter((story) => story.kind === "case");
    $("case-count").textContent = cases.length + "篇案例";
    const columns = [
      make("div", "", "case-column"),
      make("div", "", "case-column"),
    ];
    cases.forEach((story, index) => {
      const card = make(
        "a",
        "",
        "case-card" + (story.portrait ? " portrait" : ""),
      );
      card.href =
        "post.html?venue=" +
        encodeURIComponent(venue.id) +
        "&story=" +
        encodeURIComponent(story.id) +
        "&from=venue";
      const img = document.createElement("img");
      image(img, story);
      img.loading = "lazy";
      card.append(img, make("h3", story.title), make("p", story.meta, "minor"));
      columns[index % 2].append(card);
    });
    $("case-feed").append(...columns);
    if (!cases.length)
      $("case-feed").append(make("p", "暂未收录案例。", "minor"));
  }
  function readBookmarks() {
    try {
      const value = JSON.parse(sessionStorage.getItem(bookmarkKey) || "[]");
      return new Set(Array.isArray(value) ? value : []);
    } catch {
      return new Set();
    }
  }
  let bookmarks = readBookmarks();
  function refreshBookmark() {
    const saved = bookmarks.has(bookmarkId);
    $("save-space").textContent = saved ? "已收藏" : "收藏";
    $("save-space").setAttribute("aria-pressed", String(saved));
    $("save-space").setAttribute(
      "aria-label",
      `${saved ? "取消收藏" : "收藏"}${isPost ? "帖子：" + active.title : "空间：" + venue.name}`,
    );
  }
  $("save-space").addEventListener("click", () => {
    if (bookmarks.has(bookmarkId)) bookmarks.delete(bookmarkId);
    else bookmarks.add(bookmarkId);
    try {
      sessionStorage.setItem(bookmarkKey, JSON.stringify([...bookmarks]));
      $("page-feedback").textContent = "收藏状态已更新，仅在当前标签页暂存。";
    } catch {
      $("page-feedback").textContent = "收藏仅在本页有效，刷新后可能丢失。";
    }
    refreshBookmark();
  });
  let dialogTrigger;
  function openDialog(id, trigger) {
    dialogTrigger = trigger;
    $(id).showModal();
  }
  document
    .querySelectorAll("[data-close]")
    .forEach((button) =>
      button.addEventListener("click", () => button.closest("dialog").close()),
    );
  document
    .querySelectorAll("dialog")
    .forEach((dialog) =>
      dialog.addEventListener("close", () =>
        dialogTrigger?.focus({ preventScroll: true }),
      ),
    );
  $("open-inquiry").addEventListener("click", (event) => {
    $("inquiry-context").textContent = isPost
      ? `${venue.name} · ${active.title}`
      : `${venue.name} · 空间咨询`;
    $("inquiry-feedback").textContent = "";
    const submit = $("inquiry-form").querySelector("[type=submit]");
    submit.disabled = false;
    submit.textContent = "保存需求到本机";
    openDialog("inquiry", event.currentTarget);
  });
  $("inquiry-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const start = String(values.get("start"));
    const end = String(values.get("end"));
    if (end < start) {
      $("inquiry-feedback").textContent = "结束日期不能早于开始日期。";
      return;
    }
    const record = {
      id: crypto.randomUUID?.() || `demo-${Date.now()}`,
      assetId: venue.id,
      storyId: isPost ? active.id : null,
      venueName: venue.name,
      storyTitle: isPost ? active.title : null,
      isMock: true,
      createdAt: new Date().toISOString(),
      status: "本机草稿，未发送运营",
      brief: {
        purpose: String(values.get("purpose")),
        start,
        end,
        people: Number(values.get("people")),
        budget:
          values.get("budget") === "" ? null : Number(values.get("budget")),
        notes: String(values.get("notes")).trim(),
      },
    };
    try {
      const raw = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (!Array.isArray(raw)) throw new Error("Invalid records");
      localStorage.setItem(
        storageKey,
        JSON.stringify([record, ...raw].slice(0, 20)),
      );
      $("inquiry-feedback").textContent =
        `已保存${venue.name}的需求${isPost ? "，附带当前案例" : ""}。仅在本机保存，尚未发送给运营。`;
      const submit = form.querySelector("[type=submit]");
      submit.disabled = true;
      submit.textContent = "已保存到本机";
    } catch {
      $("inquiry-feedback").textContent =
        "浏览器暂时无法保存，请勿关闭页面；可以稍后重试。";
    }
  });
  $("inquiry-form").addEventListener("input", () => {
    const submit = $("inquiry-form").querySelector("[type=submit]");
    submit.disabled = false;
    submit.textContent = "保存需求到本机";
  });
  document.querySelectorAll("[data-share]").forEach((button) =>
    button.addEventListener("click", () => {
      $("share-url").value = location.href;
      $("share-feedback").textContent = ["localhost", "127.0.0.1"].includes(
        location.hostname,
      )
        ? "当前是本机预览，链接不能在其他设备直接打开。"
        : "原型内容，非真实场地报价。";
      openDialog("share", button);
    }),
  );
  $("copy-share").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText($("share-url").value);
      $("share-feedback").textContent = "链接已复制，保留了当前空间与案例。";
    } catch {
      $("share-url").focus();
      $("share-url").select();
      $("share-feedback").textContent = "请手动复制上方链接。";
    }
  });
  if (requested && !venues.some((item) => item.id === requested))
    $("page-feedback").textContent = "未找到此空间，已展示白庭示例。";
  renderHeader();
})();
