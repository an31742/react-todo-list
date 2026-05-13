import React, { useEffect, useMemo, useRef, useState } from 'react'
//使用reacteacrts
import ReactECharts from 'echarts-for-react'
import { Button, Tag } from 'antd'
import { FullscreenOutlined } from '@ant-design/icons'
import './home.css'

const lineSeries = [120, 132, 101, 134, 90, 230, 210]
const barSeries = [220, 182, 191, 234, 290, 330, 310]

const rollingData = [
  { name: '华东区域', value: 3821 },
  { name: '华南区域', value: 3518 },
  { name: '华北区域', value: 3270 },
  { name: '西南区域', value: 2891 },
  { name: '华中区域', value: 2687 },
  { name: '西北区域', value: 2312 },
  { name: '东北区域', value: 2085 },
  { name: '海外区域', value: 1734 },
]
//设置echarts折线图状属性
const Home = () => {
  const dashboardRef = useRef(null)
  const trendChartRef = useRef(null)
  const barChartRef = useRef(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const trendOption = useMemo(() => ({
    tooltip: { trigger: 'axis' },
    grid: { left: 30, right: 20, top: 30, bottom: 28 },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLine: { lineStyle: { color: '#60a5fa' } },
      axisLabel: { color: '#bfdbfe' },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#60a5fa' } },
      splitLine: { lineStyle: { color: 'rgba(147,197,253,0.15)' } },
      axisLabel: { color: '#bfdbfe' },
    },
    series: [{
      data: lineSeries,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: { color: '#38bdf8', width: 3 },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(56, 189, 248, 0.45)' },
            { offset: 1, color: 'rgba(56, 189, 248, 0.03)' },
          ],
        },
      },
      itemStyle: { color: '#7dd3fc' },
    }],
  }), [])
//设置柱状图属性
  const barOption = useMemo(() => ({
    tooltip: { trigger: 'axis' },
    grid: { left: 30, right: 14, top: 30, bottom: 30 },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
      axisLine: { lineStyle: { color: '#60a5fa' } },
      axisLabel: { color: '#bfdbfe' },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#60a5fa' } },
      splitLine: { lineStyle: { color: 'rgba(147,197,253,0.15)' } },
      axisLabel: { color: '#bfdbfe' },
    },
    series: [{
      data: barSeries,
      type: 'bar',
      barWidth: 18,
      itemStyle: {
        borderRadius: [8, 8, 0, 0],
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#60a5fa' },
            { offset: 1, color: '#1d4ed8' },
          ],
        },
      },
    }],
  }), [])

  const kpis = [
    { label: '今日交易额', value: '¥ 9,283,101', trend: '+14.2%' },
    { label: '活跃用户数', value: '128,420', trend: '+5.7%' },
    { label: '订单完成率', value: '96.8%', trend: '+1.4%' },
    { label: '系统健康度', value: '99.92%', trend: '+0.03%' },
  ]

  const highlightCards = [
    // {
    //   title: '权限菜单',
    //   desc: '登录后按角色展示菜单，配合路由守卫实现后台权限控制。',
    // },
    // {
    //   title: '数据驾驶舱',
    //   desc: '折线图、柱状图、滚动榜单与 KPI 卡片，适合中后台汇报展示。',
    // },
    // {
    //   title: '前后端联调',
    //   desc: 'React + Express RESTful 接口，已处理 CORS、环境变量与部署问题。',
    // },
    // {
    //   title: '工程化能力',
    //   desc: 'Axios 统一封装、图表 resize、响应式布局、Vercel 双项目部署。',
    // },
  ]

  const stackTags = ['React', 'Redux Toolkit', 'Ant Design', 'ECharts', 'Axios', 'Express', 'Vercel']
//是否全屏
  const handleFullscreen = async () => {
    if (!dashboardRef.current) return
    if (document.fullscreenElement) {
      await document.exitFullscreen()
    } else {
      await dashboardRef.current.requestFullscreen()
    }
  }

  useEffect(() => {
    const resizeCharts = () => {
      trendChartRef.current?.getEchartsInstance()?.resize()
      barChartRef.current?.getEchartsInstance()?.resize()
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
      // 多次延迟调用 resize，确保图表正确渲染
      requestAnimationFrame(resizeCharts)
      setTimeout(resizeCharts, 50)
      setTimeout(resizeCharts, 150)
      setTimeout(resizeCharts, 300)
    }
    //监听文本和屏幕变化是否全屏


    window.addEventListener('resize', resizeCharts)
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      window.removeEventListener('resize', resizeCharts)
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  return (
    <div className={`dashboard-page ${isFullscreen ? 'dashboard-page-fullscreen' : ''}`} ref={dashboardRef}>
      <div className="dashboard-topbar">
        <div>
          <h2 className="dashboard-title">React 全栈管理后台 / 运营驾驶舱</h2>
          <p className="dashboard-subtitle">用于面试展示的中后台项目，覆盖权限菜单、数据可视化、业务 CRUD 与部署联调</p>
          <div className="stack-tags">
            {stackTags.map((tag) => (
              <Tag key={tag} className="stack-tag">{tag}</Tag>
            ))}
          </div>
        </div>
        <Button className="fullscreen-btn" icon={<FullscreenOutlined />} onClick={handleFullscreen}>
          全屏展示
        </Button>
      </div>

      <div className="highlights-grid">
        {highlightCards.map((item) => (
          <div className="panel highlight-card" key={item.title}>
            <div className="highlight-title">{item.title}</div>
            <div className="highlight-desc">{item.desc}</div>
          </div>
        ))}
      </div>

      <div className="kpi-row">
        {kpis.map((item) => (
          <div className="panel kpi-card" key={item.label}>
            <div className="kpi-label">{item.label}</div>
            <div className="kpi-value">{item.value}</div>
            <div className="kpi-trend">较昨日 {item.trend}</div>
          </div>
        ))}
      </div>

      {/* <div className="panel interview-flow">
        <div className="panel-header">面试展示顺序</div>
        <div className="panel-body interview-flow-body">
          <div className="flow-step">1. 先讲权限菜单和后台布局，说明你理解中后台结构。</div>
          <div className="flow-step">2. 再演示数据驾驶舱，全屏、图表、自适应和滚动榜单。</div>
          <div className="flow-step">3. 最后打开 Todo / 图书管理，展示 CRUD、接口联调与部署经验。</div>
        </div>
      </div> */}

      <div className="dashboard-grid">
        <div className="panel chart-col-16">
          <div className="panel-header">近7日访问趋势（折线图）</div>
          <div className="panel-body">
            <ReactECharts ref={trendChartRef} option={trendOption} className="chart-box" notMerge lazyUpdate />
          </div>
        </div>

        <div className="panel chart-col-8">
          <div className="panel-header">区域销售滚动榜单</div>
          <div className="panel-body">
            <div className="scroll-list">
              <div className="scroll-track">
                {[...rollingData, ...rollingData].map((item, index) => (
                  <div className="scroll-item" key={`${item.name}-${index}`}>
                    <span className="rank-dot">{(index % rollingData.length) + 1}</span>
                    <span>{item.name}</span>
                    <span className="scroll-value">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="panel chart-col-24">
          <div className="panel-header">月度交易对比（柱状图）</div>
          <div className="panel-body">
            <ReactECharts ref={barChartRef} option={barOption} className="chart-box" notMerge lazyUpdate />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
