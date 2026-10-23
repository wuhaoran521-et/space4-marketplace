/* Fictional editorial previews; no live venue inventory or engagement counts. */
(() => {
  const stories = window.Space4Stories.filter((story) => !story.detailOnly);
  const feed = document.getElementById("editorial-feed");
  const storageKey = "space-four-editorial-bookmarks-v1";
  const bookmarkPath = "M4 2h12v17l-6-4-6 4z";
  let saved = new Set();
  try {
    const value = JSON.parse(sessionStorage.getItem(storageKey) || "[]");
    if (Array.isArray(value))
      saved = new Set(
        value.filter((id) => stories.some((story) => story.id === id)),
      );
  } catch {
    /* Session-only state is optional. */
  }

  function detailUrl(story) {
    return (
      (story.kind === "space" ? "venue.html?venue=" : "post.html?venue=") +
      encodeURIComponent(story.venue.id) +
      "&story=" +
      encodeURIComponent(story.id)
    );
  }

  const cards = stories.map((story, index) => {
    const article = document.createElement("article");
    article.className = `feed-card${story.portrait ? " portrait" : ""}`;
    article.dataset.kind = story.kind;
    article.dataset.storyId = story.id;
    article.dataset.assetId = story.venue.id;
    const link = document.createElement("a");
    link.href = detailUrl(story);
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
    openVenue(id) {
      const target = new URL("venue.html", location.href);
      target.searchParams.set("venue", id);
      location.assign(target.href);
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
})();
