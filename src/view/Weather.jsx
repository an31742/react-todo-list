/*
 * @Author: an31742 2234170284@qq.com
 * @Date: 2025-07-01 18:10:30
 * @LastEditors: an31742 2234170284@qq.com
 * @LastEditTime: 2025-07-02 12:30:07
 * @FilePath: /react-todo-list/src/view/Weather.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE调用zi
 */
import React, { useState } from "react"
import Search from "../components/search"
import WeatherCards from "../components/weatherCards"
import axios from "axios"

function Weather() {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [city, setCity] = useState("")
  const [lat, setLat] = useState(null)
  const [lon, setLon] = useState(null)

  const API_KEY = "0d3cb57a463501a6b45f621aee77c677"

  // 1. 先通过城市名获取经纬度
  const getLatAndLon = async (city) => {
    try {
      setLoading(true)
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${city}&format=json&limit=1`)
      if (response.data && response.data.length > 0) {
        setLat(response.data[0].lat)
        setLon(response.data[0].lon)
        setError(null)
      } else {
        setError(new Error("未找到该城市"))
        setLat(null)
        setLon(null)
      }
    } catch (error) {
      setError(error)
      setLat(null)
      setLon(null)
    } finally {
      setLoading(false)
    }
  }

  // 2. 监听经纬度变化，获取天气
  React.useEffect(() => {
    if (!lat || !lon) return
    const fetchWeather = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
        setWeatherData(response.data)
        setError(null)
      } catch (error) {
        setError(error)
        setWeatherData(null)
      } finally {
        setLoading(false)
      }
    }
    fetchWeather()
  }, [lat, lon])

  // 3. 搜索回调  子组件传给附件就是通过自定义时间
  const handleSearch = (city) => {
    setCity(city)
    getLatAndLon(city)
  }

  // 4. 组件最外层 return
  return (
    <div>
      <h2>查询天气</h2>
      {/* 调用子组件  onSearch自定义*/}
      <Search onSearch={handleSearch} />
      {/* <WeatherCards data={weatherData}通过data传给子组件数据 父传子 子组件接收里面的数据*/}
      {loading ? <p>加载中...</p> : error ? <p>错误: {error.message}</p> : weatherData ? <WeatherCards data={weatherData} /> : <p>请输入城市名称</p>}
    </div>
  )
}

export default Weather
