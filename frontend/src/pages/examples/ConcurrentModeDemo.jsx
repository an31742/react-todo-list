// ConcurrentDemo.tsx
import React, { useState, useTransition, useDeferredValue, useMemo, useRef } from 'react';

const ITEMS_COUNT = 5000;

// 生成模拟数据（只生成一次）
const mockItems = Array.from({ length: ITEMS_COUNT }, (_, i) => ({
  id: i,
  text: `Item ${i} - ${Math.random().toString(36).slice(2, 8)}`,
}));

const HeavyList = React.memo(({ keyword }) => {
  // 故意阻塞 1ms，模拟复杂计算
  const start = performance.now();
  while (performance.now() - start < 1) {}

  const filtered = useMemo(
    () => mockItems.filter((item) => item.text.includes(keyword)),
    [keyword]
  );

  return (
    <ul style={{ height: 200, overflow: 'auto', border: '1px solid #ccc', padding: 8 }}>
      {filtered.slice(0, 100).map((item) => (
        <li key={item.id}>{item.text}</li>
      ))}
    </ul>
  );
});

// type Mode = 'sync' | 'transition' | 'deferred';

export default function ConcurrentDemo() {
  const [input, setInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [mode, setMode] = useState('sync');
  const [isPending, startTransition] = useTransition();
  const deferredKeyword = useDeferredValue(input);

  // 统计渲染次数（useRef 不触发重新渲染，安全）
  const renderCount = useRef(0);
  renderCount.current += 1;

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value); // 紧急更新：输入框必须立刻响应

    if (mode === 'sync') {
      setKeyword(value);                  // 同步更新，会导致卡顿
    } else if (mode === 'transition') {
      startTransition(() => {
        setKeyword(value);                // 低优先级更新，可以被中断
      });
    }
    // deferred 模式下不需要手动 setKeyword，由 deferredKeyword 驱动
  };

  const effectiveKeyword = mode === 'deferred' ? deferredKeyword : keyword;

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h2>React 并发模式对比</h2>

      <div style={{ marginBottom: 12 }}>
        <label>
          选择更新策略：
          <select value={mode} onChange={(e) => setMode(e.target.value )}>
            <option value="sync">普通同步更新</option>
            <option value="transition">startTransition</option>
            <option value="deferred">useDeferredValue</option>
          </select>
        </label>
      </div>

      <input
        placeholder="输入关键词过滤列表"
        value={input}
        onChange={handleChange}
        style={{ width: 320, padding: 8, fontSize: 16, marginBottom: 8 }}
      />

      {mode === 'transition' && isPending && (
        <span style={{ color: '#999' }}> ⏳ 列表更新中...</span>
      )}

      <div style={{ margin: '8px 0' }}>
        <strong>渲染次数：{renderCount.current}</strong>
        <span style={{ marginLeft: 16, color: '#555' }}>当前输入：{input}</span>
      </div>

      <HeavyList keyword={effectiveKeyword} />

      <div style={{ marginTop: 20, fontSize: 14, color: '#666' }}>
        <p>
          <strong>观察点：</strong>
        </p>
        <ul>
          <li><b>普通同步</b>：输入框输入时明显卡顿，因为每次渲染都要阻塞 1ms。</li>
          <li><b>startTransition</b>：输入非常流畅，列表会有轻微延迟，同时显示“更新中”提示。</li>
          <li><b>useDeferredValue</b>：效果类似 startTransition，但不需额外拆分状态，列表自动滞后。</li>
        </ul>
      </div>
    </div>
  );
}