import React, { useState, useCallback, useMemo, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════
//  📐 useMemo & useCallback 教学
//
//  「性能优化」的核心不是阻止渲染，而是减少「不必要的计算和渲染」。
//
//  两个独立概念：
//    ① useMemo    →  缓存计算结果，避免重复执行耗时函数
//    ② useCallback →  缓存函数引用，配合 React.memo 让子组件跳过渲染
// ═══════════════════════════════════════════════════════════════

export default function PreventRerenderExample() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  const [step, setStep] = useState(1);

  return (
    <div
      style={{
        maxWidth: 680,
        margin: '0 auto',
        padding: 32,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#212529',
      }}
    >
      <h1 style={{ fontSize: 20, margin: '0 0 4px' }}>
        📐 useMemo & useCallback
      </h1>
      <p style={{ fontSize: 13, color: '#888', margin: '0 0 12px' }}>
        count = {count} &nbsp;·&nbsp; text = &ldquo;{text || '(空)'}&rdquo;
      </p>

      {/* 步骤切换 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['useMemo', 'useCallback', '总结'].map((label, i) => (
          <button
            key={label}
            onClick={() => setStep(i + 1)}
            style={{
              padding: '8px 20px',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: step === i + 1 ? 600 : 400,
              backgroundColor: step === i + 1 ? '#339af0' : '#f1f3f5',
              color: step === i + 1 ? '#fff' : '#495057',
            }}
          >
            {i + 1}. {label}
          </button>
        ))}
      </div>

      {/* 共享操作栏 */}
      {step < 3 && (
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            backgroundColor: '#f8f9fa',
            borderRadius: 8,
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="在这里输入文字..."
            style={{
              flex: 1,
              minWidth: 160,
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: 6,
              fontSize: 14,
            }}
          />
          <button onClick={() => setCount((c) => c + 1)} style={blueBtn}>
            修改 count +1
          </button>
          <button onClick={() => setCount((c) => c - 1)} style={blueBtn}>
            修改 count -1
          </button>
          <button
            onClick={() => {
              setCount(0);
              setText('');
            }}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 14,
              backgroundColor: '#e9ecef',
              color: '#495057',
            }}
          >
            重置
          </button>
          <span style={{ fontSize: 12, color: '#868e96', marginLeft: 4 }}>
            切换 tab 后观察数字变化
          </span>
        </div>
      )}

      {step === 1 && <UseMemoSection count={count} />}
      {step === 2 && <UseCallbackSection />}
      {step === 3 && <Summary />}
    </div>
  );
}

const blueBtn = {
  padding: '8px 16px',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
  fontSize: 14,
  backgroundColor: '#339af0',
  color: '#fff',
};

// ═══════════════════════════════════════════════════════════════
//  STEP 1 — useMemo
//  目标：理解「缓存计算结果」—— 避免重复执行耗时函数
// ═══════════════════════════════════════════════════════════════

function expensiveFn(n) {
  const start = performance.now();
  while (performance.now() - start < 10) {} // 象征性阻塞
  return n * 2;
}

/** 左侧卡片 —— 每次渲染都调用 expensiveFn */
function LeftCard({ count }) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  // 没有缓存，每次渲染都重新计算
  const val = expensiveFn(count);

  return (
    <div
      style={{
        flex: 1,
        padding: 16,
        borderRadius: 8,
        border: '2px solid #ff6b6b',
        backgroundColor: '#fff5f5',
      }}
    >
      <h3 style={{ margin: 0, fontSize: 14, color: '#e03131' }}>
        ❌ 直接调用
      </h3>
      <p style={{ fontSize: 11, color: '#868e96', margin: '4px 0' }}>
        每次渲染都重新执行 expensiveFn
      </p>
      <div style={{ fontSize: 28, fontWeight: 700, margin: '8px 0' }}>
        {val}
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#e03131' }}>
        expensiveFn 执行了 {renderCount.current} 次
      </div>
      <p style={{ fontSize: 11, color: '#868e96', margin: '4px 0 0' }}>
        打字触发父渲染 → expensiveFn 重新计算 → 次数 +1
      </p>
    </div>
  );
}

/** 右侧卡片 —— 用 useMemo 缓存，只在 count 变时重新计算 */
function RightCard({ count }) {
  const memoCallCount = useRef(0);
  const renderCount = useRef(0);
  renderCount.current += 1;

  // 用 useMemo 缓存结果
  const val = useMemo(() => {
    const result = expensiveFn(count);
    memoCallCount.current += 1;
    return result;
  }, [count]);

  return (
    <div
      style={{
        flex: 1,
        padding: 16,
        borderRadius: 8,
        border: '2px solid #51cf66',
        backgroundColor: '#ebfbee',
      }}
    >
      <h3 style={{ margin: 0, fontSize: 14, color: '#2f9e44' }}>
        ✅ useMemo 缓存
      </h3>
      <p style={{ fontSize: 11, color: '#868e96', margin: '4px 0' }}>
        只在 count 变化时重新调用 expensiveFn
      </p>
      <div style={{ fontSize: 28, fontWeight: 700, margin: '8px 0' }}>
        {val}
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#2f9e44' }}>
        expensiveFn 执行了 {memoCallCount.current} 次
      </div>
      <p style={{ fontSize: 11, color: '#868e96', margin: '4px 0 0' }}>
        打字触发父渲染 → count 没变 → useMemo 返回缓存 → 次数不变
      </p>
    </div>
  );
}

function UseMemoSection({ count }) {
  return (
    <div>
      <p style={{ fontSize: 14, lineHeight: 1.6, marginTop: 0 }}>
        <code>expensiveFn(n)</code> 是一个「耗时函数」。
        确认在 <strong>1. useMemo</strong> tab，在输入框打字，观察下方数字。
      </p>

      <div style={{ display: 'flex', gap: 16 }}>
        <LeftCard count={count} />
        <RightCard count={count} />
      </div>

      <TipBox>
        <strong>本质：</strong>useMemo 缓存的是「计算过程」，不是「组件」。
        左栏每次渲染都调用 expensiveFn，右栏用 useMemo 只在 count 变化时重新计算。
        在输入框打字 → 左栏次数+1，右栏不变。点 +/- 按钮 → 两边都+1（count 变了）。<br />
        <strong>结论：</strong>当你的计算很耗时、且输入不常变化时，用 useMemo 避免重复计算。
      </TipBox>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  STEP 2 — useCallback
//  目标：理解「保持函数引用不变」+ React.memo 跳过子组件渲染
// ═══════════════════════════════════════════════════════════════

/** 被 React.memo 包裹的按钮组件 —— props 不变时跳过渲染 */
const MemoBtn = React.memo(function MemoBtn({ onClick, label, bgColor }) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <div
      style={{
        padding: 12,
        borderRadius: 6,
        backgroundColor: `${bgColor}10`,
        border: `1px solid ${bgColor}40`,
        textAlign: 'center',
      }}
    >
      <p style={{ margin: '0 0 8px', fontSize: 13 }}>
        子组件包了 React.memo
      </p>
      <button
        onClick={onClick}
        style={{
          padding: '6px 20px',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          fontSize: 14,
          backgroundColor: bgColor,
          color: '#fff',
        }}
      >
        {label}
      </button>
      <p style={{ fontSize: 16, margin: '8px 0 0', fontWeight: 700 }}>
        {renderCount.current} 次渲染
      </p>
    </div>
  );
});

function UseCallbackSection() {
  // ❌ 没缓存：每次渲染创建新函数（引用每次都变）
  const onClickNew = () => {
    console.log('❌ 新函数');
  };

  // ✅ 用 useCallback：函数引用保持不变
  const onClickStable = useCallback(() => {
    console.log('✅ 同一个函数');
  }, []);

  return (
    <div>
      <p style={{ fontSize: 14, lineHeight: 1.6 }}>
        两个按钮都被 <code>React.memo</code> 包裹（浅比较 props）。
        确认在 <strong>2. useCallback</strong> tab，在输入框打字，观察渲染次数。
      </p>

      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 13, color: '#e03131', margin: '0 0 8px' }}>
            ❌ 不用 useCallback
          </h3>
          <MemoBtn onClick={onClickNew} label="点击" bgColor="#ff6b6b" />
          <p style={{ fontSize: 11, color: '#868e96' }}>
            每次渲染创建新函数 → React.memo 浅比较 props.onClick 不相等 → 按钮重渲染
          </p>
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 13, color: '#2f9e44', margin: '0 0 8px' }}>
            ✅ 用 useCallback
          </h3>
          <MemoBtn onClick={onClickStable} label="点击" bgColor="#51cf66" />
          <p style={{ fontSize: 11, color: '#868e96' }}>
            useCallback 保持函数引用不变 → React.memo 比较通过 → 按钮跳过渲染
          </p>
        </div>
      </div>

      <TipBox>
        <strong>操作：</strong>切换到 useCallback tab，在输入框打字。
        左栏的渲染次数不断增长，右栏不动。<br />
        <strong>本质：</strong>useCallback 是缓存「函数引用」，必须配合 React.memo 才有意义。
        子组件不包 React.memo 的话，父渲染子必渲染，useCallback 用在哪？
      </TipBox>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  STEP 3 — 总结
// ═══════════════════════════════════════════════════════════════

function Summary() {
  return (
    <div>
      <SummaryCard bg="#fff5f5" border="#ff6b6b" title="❌ 常见误解">
        <p>"useMemo/useCallback 可以阻止组件渲染" — <strong>错！</strong></p>
        <p>
          它们<strong>不阻止任何渲染</strong>，只是让值和函数引用稳定下来。
        </p>
      </SummaryCard>

      <SummaryCard bg="#ebfbee" border="#51cf66" title="✅ 正确认知">
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 14,
          }}
        >
          <thead>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <th style={{ padding: 8, textAlign: 'left' }}>Hook</th>
              <th style={{ padding: 8, textAlign: 'left' }}>缓存什么</th>
              <th style={{ padding: 8, textAlign: 'left' }}>什么时候用</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: 8 }}>
                <code>useMemo</code>
              </td>
              <td style={{ padding: 8 }}>计算结果</td>
              <td style={{ padding: 8 }}>计算很慢，且输入不常变</td>
            </tr>
            <tr>
              <td style={{ padding: 8 }}>
                <code>useCallback</code>
              </td>
              <td style={{ padding: 8 }}>函数引用</td>
              <td style={{ padding: 8 }}>传给 React.memo 子组件</td>
            </tr>
          </tbody>
        </table>
      </SummaryCard>

      <SummaryCard bg="#fff9db" border="#fab005" title="📌 一句话记法">
        <p style={{ fontSize: 15, lineHeight: 1.8 }}>
          <strong>useMemo</strong> → 缓存计算值，不要重新算
          <br />
          <strong>useCallback</strong> → 缓存函数，不要重新创建
          <br />
          <strong>React.memo</strong> → 比较 props，不要重新渲染
          <br />
          三者配合，才能减少子组件不必要渲染。
        </p>
      </SummaryCard>

      <SummaryCard bg="#e7f5ff" border="#339af0" title="🔍 Profiler 验证">
        <ol style={{ margin: 0, paddingLeft: 18 }}>
          <li>F12 → <strong>Profiler</strong> 标签 → 点录制 🔴</li>
          <li>打字、点按钮 → 停止录制</li>
          <li>点组件看右侧 <strong>"Why did this render?"</strong></li>
        </ol>
      </SummaryCard>

      <SummaryCard bg="#f8f9fa" border="#868e96" title="⚠️ 何时不该用">
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>计算很简单（加、减、乘）— useMemo 的开销反而大</li>
          <li>子组件没包 React.memo — useCallback 没意义</li>
          <li>依赖总是变化 — 缓存永远失效</li>
          <li>
            <strong>先测量，再优化</strong>
          </li>
        </ul>
      </SummaryCard>
    </div>
  );
}

function SummaryCard({ children, title, bg, border }) {
  return (
    <div
      style={{
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        border: `1px solid ${border}`,
        backgroundColor: bg,
        lineHeight: 1.7,
      }}
    >
      <h3 style={{ margin: '0 0 4px', fontSize: 16, color: border }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function TipBox({ children }) {
  return (
    <div
      style={{
        marginTop: 16,
        padding: '12px 16px',
        backgroundColor: '#fff9db',
        borderLeft: '3px solid #fcc419',
        borderRadius: '0 6px 6px 0',
        fontSize: 13,
        lineHeight: 1.7,
      }}
    >
      {children}
    </div>
  );
}
