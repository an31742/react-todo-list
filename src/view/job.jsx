import React from "react"
import axios from "axios"
export default function Job(params) {
  // 使用useEffect钩子来获取数据
  const [jobs, setJobs] = React.useState([])

  React.useEffect(
    () => async () => {
      // 模拟获取数据
      await axios
        .get("/jobs")
        .then((response) => {
          console.log("res", response)
          setJobs(response.data)
        })
        .catch((error) => {
          console.error("Error fetching jobs:", error)
        })
    },
    []
  )
  // 模拟获取数据
  return (
    <>
      {jobs.length === 0 ? (
        <div>暂无数据</div>
      ) : (
        jobs.map((job) => (
          <div key={job.id}>
            <h2>{job.title}</h2>
            <p>地点: {job.location}</p>
            <p>行业: {job.industry}</p>
            <p>薪资: {job.salary}</p>
            <p>技能要求: {job.requirements}</p>
          </div>
        ))
       
      )}
    </>
  )
}
