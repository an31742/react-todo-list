import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import axios from "axios"
import "./index.css"
import App from "./App"
import reportWebVitals from "./reportWebVitals"

const apiBaseUrl =
  process.env.REACT_APP_API_BASE_URL ||
  process.env.REACT_APP_API_URL ||
  ""

if (apiBaseUrl) {
  axios.defaults.baseURL = apiBaseUrl
}

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

reportWebVitals()
