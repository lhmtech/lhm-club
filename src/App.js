import React, { useState } from "react";

function App() {
  const [time, setTime] = useState(null);
  // 新增：用于存储输入的链接和API响应
  const [link, setLink] = useState("");
  const [summaryResponse, setSummaryResponse] = useState(null);

  const fetchTime = async () => {
    const res = await fetch("/api/time");
    const data = await res.json();
    setTime(data.time);
  };

  // 新增：处理 summary API 的 POST 请求
  const postLink = async () => {
    setSummaryResponse(null);
    try {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link }),
      });
      const data = await res.json();
      setSummaryResponse(data);
    } catch (err) {
      setSummaryResponse({ error: "请求失败" });
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>📦 Vercel Demo App</h1>
      <button onClick={fetchTime}>获取当前时间</button>
      {time && <p>⏰ 当前时间：{time}</p>}
      <hr style={{ margin: "40px 0" }} />
      {/* 新增：输入框和按钮 */}
      <div>
        <input
          type="text"
          placeholder="请输入 YouTube 链接"
          value={link}
          onChange={e => setLink(e.target.value)}
          style={{ width: 300, padding: 8 }}
        />
        <button onClick={postLink} style={{ marginLeft: 10, padding: 8 }}>
          提交链接
        </button>
      </div>
      {/* 新增：显示 API 响应 */}
      {summaryResponse && (
        <pre style={{ marginTop: 20, background: '#f6f8fa', padding: 16, display: 'inline-block', textAlign: 'left' }}>
          {JSON.stringify(summaryResponse, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default App;