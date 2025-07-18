// worker.js
self.onmessage = function (e) {
  // 假设 e.data 是大数据数组
  const rawData = e.data
  // 模拟数据处理（如聚合、分组等）
  const processed = rawData.map((item) => item * 2) // 实际可替换为复杂逻辑
  self.postMessage(processed)
}
