(() => {
  const $ = (id) => document.getElementById(id);
  const pin = $("space-pin");
  let activePin = pin;
  let selectedVenue = window.Space4Venues[0];
  let selectedDate = "2026-11-10";
  function selectVenue(id, options = {}) {
    selectedVenue =
      window.Space4Venues.find((venue) => venue.id === id) ||
      window.Space4Venues[0];
    $("timeline-title").textContent = selectedVenue.name;
    const firstAvailable = selectedVenue.states.indexOf("available");
    document.querySelectorAll("[data-date]").forEach((button, index) => {
      button.dataset.state = selectedVenue.states[index];
      button.querySelector("small").textContent = {
        available: "可用",
        unavailable: "占用",
        unknown: "待确认",
      }[selectedVenue.states[index]];
      button.setAttribute("aria-pressed", String(index === firstAvailable));
    });
    selectedDate = `2026-11-${10 + firstAvailable}`;
    $("date-feedback").textContent =
      `${selectedDate.slice(5).replace("-", "月")}日 · 模拟可用`;
    $("choose-period").setAttribute("aria-disabled", "false");
    $("choose-period").href =
      `index.html?entry=brief&start=${selectedDate}&end=${selectedDate}`;
    $("timeline-view-story").textContent =
      selectedVenue === window.Space4Venues[0] ? "查看空间 ↗" : "看相关内容 ↗";
    window.Space4LocalMap?.selectVenue(selectedVenue.id);
    showTimeline(options.open !== false);
    document.dispatchEvent(
      new CustomEvent("space4:venue-selected", {
        detail: { assetId: selectedVenue.id },
      }),
    );
  }
  function showTimeline(show) {
    $("timeline").hidden = !show;
    activePin.setAttribute("aria-expanded", String(show));
    if (show) window.Space4LocalMap?.focusSelected();
  }
  window.Space4DiscoveryMap = {
    showTimeline,
    selectVenue,
    getSelectedVenue() {
      return selectedVenue;
    },
    setActivePin(button) {
      activePin = button;
    },
  };
  pin.addEventListener("click", () => {
    if (selectedVenue !== window.Space4Venues[0])
      selectVenue(window.Space4Venues[0].id);
    else showTimeline($("timeline").hidden);
  });
  $("close-timeline").addEventListener("click", () => {
    showTimeline(false);
    activePin.focus({ preventScroll: true });
  });
  $("map-reset").addEventListener("click", () => {
    showTimeline(false);
    window.Space4LocalMap?.reset();
  });
  document.querySelectorAll("[data-date]").forEach((button) =>
    button.addEventListener("click", () => {
      document
        .querySelectorAll("[data-date]")
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
      const available = button.dataset.state === "available";
      selectedDate = button.dataset.date;
      $("date-feedback").textContent =
        `${button.dataset.date.slice(5).replace("-", "月")}日 · ${available ? "模拟可用" : button.dataset.state === "unknown" ? "待确认，不可默认可用" : "模拟不可用，请换日期"}`;
      const link = $("choose-period");
      link.setAttribute("aria-disabled", String(!available));
      if (available)
        link.href = `index.html?entry=brief&start=${button.dataset.date}&end=${button.dataset.date}`;
    }),
  );
  $("choose-period").addEventListener("click", (event) => {
    if (event.currentTarget.getAttribute("aria-disabled") === "true") {
      event.preventDefault();
      return;
    }
    if (selectedVenue !== window.Space4Venues[0]) {
      event.preventDefault();
      $("agent-input").value =
        `我想了解${selectedVenue.name}，${selectedDate}，${selectedVenue.area}的空间条件`;
      $("open-agent").click();
    }
  });
  $("timeline-view-story").addEventListener("click", (event) => {
    if (selectedVenue === window.Space4Venues[0]) return;
    event.preventDefault();
    window.Space4Feed.openVenue(selectedVenue.id, event.currentTarget);
  });
  document.querySelectorAll("[data-filter]").forEach((button) =>
    button.addEventListener("click", () => {
      document
        .querySelectorAll("[data-filter]")
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
      window.Space4Feed.filter(button.dataset.filter);
    }),
  );
  $("find-space").addEventListener("click", () => {
    window.scrollTo({
      top: $("spaces").getBoundingClientRect().top + window.scrollY - 16,
      behavior: "auto",
    });
    document.querySelector("[data-filter=space]").click();
    document
      .querySelector("[data-filter=space]")
      .focus({ preventScroll: true });
  });
  const input = $("agent-input");
  $("open-agent").addEventListener("click", () => {
    window.scrollTo({
      top:
        document.querySelector(".agent").getBoundingClientRect().top +
        window.scrollY -
        16,
      behavior: "auto",
    });
    input.focus({ preventScroll: true });
  });
  document.querySelectorAll("[data-prompt]").forEach((button) =>
    button.addEventListener("click", () => {
      input.value = button.dataset.prompt;
      input.focus({ preventScroll: true });
    }),
  );
  const dialog = $("agent-dialog");
  const sendButton = $("agent-form").querySelector('button[type="submit"]');
  let returnScrollY = window.scrollY;
  $("close-agent").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    input.blur();
    sendButton.focus({ preventScroll: true });
    window.scrollTo({ top: returnScrollY, behavior: "auto" });
  });
  $("agent-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) {
      input.setCustomValidity("请先描述你的活动。");
      input.reportValidity();
      return;
    }
    const draft = { isMock: true, assetId: "DEMO-SHA-JA-001" };
    const people = text.match(/(\d{1,5})\s*人/);
    if (people && Number(people[1]) > 0 && Number(people[1]) <= 10000)
      draft.people = Number(people[1]);
    if (/发布/.test(text)) draft.purpose = "新品发布";
    else if (/展览/.test(text)) draft.purpose = "展览";
    else if (/拍摄/.test(text)) draft.purpose = "拍摄";
    const dates = text.match(/\d{4}-\d{2}-\d{2}/g);
    if (dates) {
      draft.start = dates[0];
      draft.end = dates[1] || dates[0];
    }
    const month = text.match(/(1[0-2]|[1-9])\s*月/);
    const known = [
      draft.people ? `${draft.people}人` : "",
      draft.purpose || "",
      month ? `${month[1]}月（具体日期待补充）` : "",
    ].filter(Boolean);
    $("chat-question").textContent = text;
    $("chat-answer").textContent = /共创|减免|免费/.test(text)
      ? "白庭01有一项模拟共创机会，可申请基础场租减免，并非无条件免费。11月14日档期待确认；设备、搭建等额外费用不在减免范围内。\n可以先看条件，再补充活动需求。"
      : `本地规则${known.length ? `识别到：${known.join(" · ")}` : "暂未识别到明确的人数、用途或日期"}。\n目前只有白庭01一个模拟样本。请在下一步确认具体日期、布置方式、区域和预算；未提供的条件不会自动补全。`;
    try {
      sessionStorage.setItem(
        "space-four-discovery-draft-v1",
        JSON.stringify(draft),
      );
      $("draft-notice").textContent =
        "仅在当前标签页临时带入已识别字段；请在下一步核对。";
    } catch {
      $("draft-notice").textContent =
        "浏览器不能暂存条件，请在下一步手动填写。";
    }
    returnScrollY = window.scrollY;
    input.blur();
    sendButton.focus({ preventScroll: true });
    dialog.showModal();
  });
  input.addEventListener("input", () => input.setCustomValidity(""));
})();
