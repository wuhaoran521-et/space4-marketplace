/* Direct JSAPI prototype, automatically enabled by public runtime config. */
(() => {
  const $ = (id) => document.getElementById(id);
  const venues = window.Space4Venues;
  const controller = window.Space4DiscoveryMap;
  const timeline = $("timeline");
  const mapElement = document.querySelector(".map");
  const pins = new Map();
  const markers = new Map();
  let selected = venues[0];
  let map = null;
  let loading = false;
  let scriptPromise;
  const fallbackGroup = document.createElement("div");
  fallbackGroup.className = "fallback-pins";
  mapElement.append(fallbackGroup);
  for (const venue of venues) {
    const pin =
      venue === venues[0] ? $("space-pin") : document.createElement("button");
    pin.type = "button";
    pin.className = "space-pin fallback-pin";
    pin.dataset.assetId = venue.id;
    pin.dataset.name = venue.name;
    pin.style.left = `${venue.fallback[0]}%`;
    pin.style.top = `${venue.fallback[1]}%`;
    pin.setAttribute(
      "aria-label",
      `${venue.name}，${venue.area}虚构示意点，查看档期`,
    );
    pin.setAttribute("aria-controls", "timeline");
    pin.setAttribute("aria-expanded", "false");
    if (venue !== venues[0]) {
      pin.innerHTML = '<span class="pin-dot"></span>';
      pin.addEventListener("click", () => controller.selectVenue(venue.id));
      fallbackGroup.append(pin);
    }
  }
  function setActivePin(pin) {
    document
      .querySelectorAll(".space-pin")
      .forEach((button) => button.setAttribute("aria-expanded", "false"));
    controller.setActivePin(pin);
    pin.setAttribute("aria-expanded", String(!timeline.hidden));
  }
  function focusSelected() {
    if (!map) return;
    const size = map.getSize();
    const markerPixel = map.lngLatToContainer(selected.coordinates);
    const targetX = size.width >= 390 ? 130 : 86;
    const targetY = size.height - 55;
    const centerPixel = new window.AMap.Pixel(
      size.width / 2 + markerPixel.x - targetX,
      size.height / 2 + markerPixel.y - targetY,
    );
    map.setCenter(map.containerToLngLat(centerPixel), true);
  }
  function selectVenue(id) {
    selected = venues.find((venue) => venue.id === id) || venues[0];
    if (!map) {
      const fallbackPin = document.querySelector(
        `.fallback-pin[data-asset-id="${selected.id}"]`,
      );
      setActivePin(fallbackPin);
      timeline.style.left = `${Math.min(selected.fallback[0], 39)}%`;
      return;
    }
    timeline.style.left = "";
    pins.forEach((entry, venueId) => {
      entry.container.classList.toggle("is-selected", venueId === selected.id);
      markers.get(venueId).setzIndex(venueId === selected.id ? 160 : 110);
    });
    const entry = pins.get(selected.id);
    entry.container.append(timeline);
    setActivePin(entry.button);
    if (map.getZoom() < 14) map.setZoom(14, true);
    focusSelected();
  }
  window.Space4LocalMap = {
    focusSelected,
    selectVenue,
    reset() {
      if (map)
        map.setFitView([...markers.values()], true, [65, 70, 65, 65], 14);
    },
  };
  $("map-zoom-in").addEventListener("click", () => map?.zoomIn());
  $("map-zoom-out").addEventListener("click", () => map?.zoomOut());
  $("map-connect").addEventListener("click", () => {
    if (window.Space4AmapConfig?.key) start(window.Space4AmapConfig);
    else $("map-setup-dialog").showModal();
  });
  $("close-map-setup").addEventListener("click", () =>
    $("map-setup-dialog").close(),
  );
  $("map-setup-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const config = {
      key: $("amap-key").value.trim(),
      securityJsCode: $("amap-security-code").value.trim(),
    };
    $("amap-key").value = "";
    $("amap-security-code").value = "";
    if (config.key && config.securityJsCode) start(config);
  });
  function loadScript(key) {
    if (window.AMap?.Map) return Promise.resolve();
    if (scriptPromise) return scriptPromise;
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      const timer = setTimeout(
        () => reject(new Error("地图脚本加载超时")),
        18000,
      );
      window.space4AmapReady = () => {
        clearTimeout(timer);
        resolve();
      };
      script.src = `https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(key)}&callback=space4AmapReady`;
      script.async = true;
      script.onerror = () => {
        clearTimeout(timer);
        script.remove();
        reject(new Error("地图脚本加载失败"));
      };
      document.head.append(script);
    }).catch((error) => {
      scriptPromise = null;
      throw error;
    });
    return scriptPromise;
  }
  async function start(config) {
    if (loading || map) return;
    loading = true;
    $("map-connect").hidden = true;
    $("map-note").textContent = "正在连接高德地图…";
    let instance;
    try {
      window._AMapSecurityConfig = { securityJsCode: config.securityJsCode };
      await loadScript(config.key);
      instance = new window.AMap.Map("amap-canvas", {
        viewMode: "2D",
        mapStyle: "amap://styles/whitesmoke",
        center: [121.466, 31.225],
        zoom: 12.5,
        resizeEnable: true,
        dragEnable: true,
        zoomEnable: true,
        scrollWheel: true,
        doubleClickZoom: true,
      });
      await new Promise((resolve, reject) => {
        const timer = setTimeout(
          () => reject(new Error("地图底图加载超时")),
          20000,
        );
        instance.on("complete", () => {
          clearTimeout(timer);
          resolve();
        });
      });
      map = instance;
      for (const venue of venues) {
        const container = document.createElement("div");
        container.className = "live-marker";
        const button = document.createElement("button");
        button.type = "button";
        button.className = "space-pin";
        button.dataset.assetId = venue.id;
        button.dataset.name = venue.name;
        button.setAttribute(
          "aria-label",
          `${venue.name}，${venue.area}虚构示意点，展开或收起档期`,
        );
        button.setAttribute("aria-controls", "timeline");
        button.setAttribute("aria-expanded", "false");
        button.innerHTML = '<span class="pin-dot"></span>';
        button.addEventListener("click", (event) => {
          event.stopPropagation();
          if (controller.getSelectedVenue().id === venue.id && !timeline.hidden)
            controller.showTimeline(false);
          else controller.selectVenue(venue.id);
        });
        container.addEventListener("pointerdown", (event) =>
          event.stopPropagation(),
        );
        container.append(button);
        const marker = new window.AMap.Marker({
          position: venue.coordinates,
          content: container,
          anchor: "center",
          zIndex: 110,
        });
        pins.set(venue.id, { container, button });
        markers.set(venue.id, marker);
        map.add(marker);
      }
      mapElement.classList.add("has-live-map");
      mapElement.setAttribute(
        "aria-label",
        "高德真实地图，可拖动缩放，六个点位均为虚构空间街区示意",
      );
      $("amap-canvas").setAttribute("aria-hidden", "false");
      $("map-note").textContent = "高德地图 · 6个虚构空间示意点";
      $("map-zoom").hidden = false;
      $("map-setup-dialog").close();
      selectVenue(selected.id);
      if (timeline.hidden) window.Space4LocalMap.reset();
    } catch {
      mapElement.append(timeline);
      mapElement.classList.remove("has-live-map");
      pins.clear();
      markers.clear();
      instance?.destroy();
      map = null;
      $("map-note").textContent = "高德暂未连接 · 当前为概念底图";
      $("map-connect").textContent = "重试地图";
      $("map-connect").hidden = false;
      $("map-setup-status").textContent =
        "地图未能加载，请检查网络、Web JS API配置及域名白名单后重试。";
    } finally {
      loading = false;
    }
  }
  if (window.Space4AmapConfig?.key && window.Space4AmapConfig?.securityJsCode)
    start(window.Space4AmapConfig);
  else {
    $("map-connect").hidden = false;
    $("map-note").textContent = "地图配置待补充 · 点位为示意";
  }
})();
