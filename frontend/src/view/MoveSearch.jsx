import SearchBar from "../components/moveSearch/SearchBar"
import { searchMovies } from "../components/moveSearch/movieService"
import { useState } from "react"

function MoveSearch() {
  const [movies, setMovies] = useState([])
  const [response, setResponse] = useState(true)
  const handleSearch = async (query) => {
    console.log("搜索内容：", query)
    const results = await searchMovies(query)
    console.log("results", results)
    if (results) {
      setMovies(results)
    } else {
      setResponse(false)
    }
  }
  return (
    <div>
      <h3>电影搜索</h3>
      <SearchBar onSearch={handleSearch} />
      {response ? (
        <div style={{ marginTop: "20px" }}>
          {movies.length === 0 && <p>请输入关键词搜索</p>}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, 200px)", gap: "20px" }}>
            {Array.isArray(movies) &&
              movies.map((movie) => (
                <div key={movie.imdbID} style={{ border: "1px solid #ccc", padding: "10px" }}>
                  <img src={movie.Poster} alt={movie.Title} style={{ width: "100%" }} />
                  <h4>{movie.Title}</h4>
                  <p>{movie.Year}</p>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div>请求出错请输入英文</div>
      )}
    </div>
  )
}

export default MoveSearch
