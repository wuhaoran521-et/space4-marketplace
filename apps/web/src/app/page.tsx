export default function Home() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return (
    <iframe
      title="SPACE⁴ 空间与时间发现演示"
      src={`${basePath}/demo/discovery.html`}
      allow="clipboard-write; web-share"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100dvh",
        border: 0,
      }}
    />
  );
}
