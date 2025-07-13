import React, { useState } from "react";

function App() {
  const [time, setTime] = useState(null);

  const fetchTime = async () => {
    const res = await fetch("/api/time");
    const data = await res.json();
    setTime(data.time);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>📦 Vercel Demo App</h1>
      <button onClick={fetchTime}>获取当前时间</button>
      {time && <p>⏰ 当前时间：{time}</p>}
    </div>
  );
}

export default App;