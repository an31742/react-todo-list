/*
 * @Author: an31742 2234170284@qq.com
 * @Date: 2025-07-01 18:24:38
 * @LastEditors: an31742 2234170284@qq.com
 * @LastEditTime: 2025-07-01 22:23:20
 * @FilePath: /react-todo-list/src/components/weatherCards/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

// 子组件传入数据
import React from "react"
const WeatherCards = ({ data }) => {
  if (!data) return <div>暂无数据</div>
  const { name, main, weather, wind } = data
  return (
    <div>
      <h2>{name}</h2>
      <div>
        <img src={`https://openweathermap.org/img/wn/${weather[0].icon}.png`} alt={weather[0].description} />
        <p>{Math.round(main.temp)}℃</p>
      </div>
      <p>温度：{main.temp}℃</p>
      <p>天气：{weather[0].description}</p>
      <p>风速：{wind.speed}m/s</p>
    </div>
  )
}
export default WeatherCards
