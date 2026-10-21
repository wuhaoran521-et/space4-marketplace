/* Fictional assets, GCJ-02 neighborhood coordinates; not real venue addresses. */
(() => {
  window.Space4Venues = [
    {
      id: "DEMO-SHA-JA-001",
      name: "白庭 01",
      area: "静安 · 庭院街区",
      coordinates: [121.447, 31.224],
      storyIds: ["courtyard", "launch", "night-courtyard"],
      states: ["available", "available", "available", "unavailable", "unknown"],
      fallback: [39, 76],
    },
    {
      id: "DEMO-SHA-XH-002",
      name: "光盒 02",
      area: "徐汇 · 衡山路街区",
      coordinates: [121.444, 31.207],
      storyIds: ["gallery"],
      states: ["available", "unknown", "available", "unavailable", "available"],
      fallback: [28, 86],
    },
    {
      id: "DEMO-SHA-HP-003",
      name: "旧厂 03",
      area: "黄浦 · 南外滩街区",
      coordinates: [121.503, 31.211],
      storyIds: ["warehouse"],
      states: ["unavailable", "available", "available", "unknown", "available"],
      fallback: [75, 76],
    },
    {
      id: "DEMO-SHA-JA-004",
      name: "暮台 04",
      area: "静安 · 苏河街区",
      coordinates: [121.471, 31.241],
      storyIds: ["rooftop"],
      states: ["unknown", "unavailable", "available", "available", "unknown"],
      fallback: [57, 39],
    },
    {
      id: "DEMO-SHA-XH-005",
      name: "街角 05",
      area: "徐汇 · 武康路街区",
      coordinates: [121.436, 31.2078],
      storyIds: ["popup"],
      states: ["available", "available", "unavailable", "available", "unknown"],
      fallback: [15, 69],
    },
    {
      id: "DEMO-SHA-HP-006",
      name: "窗间 06",
      area: "黄浦 · 复兴中路街区",
      coordinates: [121.463, 31.214],
      storyIds: ["art-room"],
      states: ["unavailable", "unknown", "available", "available", "available"],
      fallback: [55, 87],
    },
  ];
})();
