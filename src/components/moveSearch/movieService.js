/*
 * @Author: an31742 2234170284@qq.com
 * @Date: 2025-07-06 19:57:33
 * @LastEditors: an31742 2234170284@qq.com
 * @LastEditTime: 2025-07-06 21:29:15
 * @FilePath: /react-todo-list/src/components/moveSearch/movieService.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from "axios"
const API_KEY = "444c3c20" // 替换为你的真实 key
export const searchMovies = async (query) => {
  const res = await axios(`http://www.omdbapi.com/?i=tt3896198&apikey=444c3c20&s=${query}`)
  console.log(888, res.data) // 打印返回的数据结构
  if (res.data.Response === "true") {
    return Array.isArray(res.data.Search) ? res.data.Search : []
  } else {
    return false
  }
}
