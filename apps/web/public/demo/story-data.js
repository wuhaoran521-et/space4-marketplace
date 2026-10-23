/* Shared fictional editorial content. */
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
      copy: "灯亮起来，庭院就有了另一种表情。\n在这项虚构的共创设想里，品牌可提交活动方案，申请基础场租减免。不是无条件免费：档期需要确认，搭建、设备等费用另计。本页下方可以查看具体的合作条件。",
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
  const caseSamples = [
    {
      id: "rooftop-coffee",
      venueId: "DEMO-SHA-JA-004",
      title: "天台上的一小时，聊聊新的灵感",
      image: "rooftop.webp",
      portrait: false,
      meta: "案例 · 小型品牌交流",
      copy: "几张桌椅，一段不赶时间的交流。\n这份模拟案例把天台作为轻量品牌交流的场景，避免复杂舞台与大型搭建。场景配图沿用空间概念素材，不是已执行活动的照片；天气、开放时间与人数仍需确认。",
    },
    {
      id: "courtyard-talk",
      venueId: "DEMO-SHA-JA-001",
      title: "一张长桌，把庭院变成交流现场",
      image: "night-courtyard.webp",
      portrait: true,
      meta: "案例 · 庭院夜谈",
      copy: "把正式的分享留在室内，把轻松的对话放到树下。\n这份模拟案例用一张长桌和低亮度灯光连接庭院，让发布后的交流自然发生。晚间声音、天气备选和设备费用仍需逐项确认。",
    },
    {
      id: "gallery-exhibition",
      venueId: "DEMO-SHA-XH-002",
      title: "少放几件作品，反而让人停留更久",
      image: "gallery.png",
      portrait: true,
      meta: "案例 · 小型展览",
      copy: "白墙不用填满，作品之间也可以有呼吸。\n这份模拟布展以自然光和连续观看路线为线索，预留观众停留的位置。图片沿用空间概念素材，并非实际活动记录。",
    },
    {
      id: "warehouse-installation",
      venueId: "DEMO-SHA-HP-003",
      title: "让旧厂房成为装置的一部分",
      image: "warehouse.png",
      portrait: false,
      meta: "案例 · 装置展陈",
      copy: "不遮住砖墙，也不藏起钢结构。\n这份模拟展陈把大尺度装置放在主厅，让建筑成为背景。实施前要单独核对承重、吊装和运输，概念画面不能代替现场勘察。",
    },
    {
      id: "rooftop-sunset",
      venueId: "DEMO-SHA-JA-004",
      title: "把一场品牌见面，留给日落时分",
      image: "rooftop.webp",
      portrait: true,
      meta: "案例 · 日落分享会",
      copy: "不用把每一分钟都填满，留一点时间看天色变化。\n这份模拟案例以小型围坐分享为主，交流与景观同时发生。雨天备选、露台承重和扩音范围需要提前核对；图片为概念配图。",
    },
  ];
  caseSamples.forEach((sample) => {
    const venue = window.Space4Venues.find(
      (item) => item.id === sample.venueId,
    );
    venue.storyIds.push(sample.id);
    stories.push({ ...sample, kind: "case", detailOnly: true });
  });
  stories.forEach((story) => {
    story.venue = window.Space4Venues.find((venue) =>
      venue.storyIds.includes(story.id),
    );
  });
  window.Space4Stories = stories;
})();
