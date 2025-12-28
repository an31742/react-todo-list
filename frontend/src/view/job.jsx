import React, { useState, useEffect } from "react"
import axios from "axios"

function JobForm({ visible, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({
    title: "",
    company: "",
    salary: "",
    requirements: "",
  })

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        company: initialData.company || "",
        salary: initialData.salary || "",
        requirements: initialData.requirements || "",
      })
    } else {
      setForm({
        title: "",
        company: "",
        salary: "",
        requirements: "",
      })
    }
  }, [initialData])

  if (!visible) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 8,
          minWidth: 320,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div>
          <label>职位名称：</label>
          <input name="title" value={form.title} onChange={handleChange} style={{ width: "100%" }} required />
        </div>
        <div>
          <label>公司：</label>
          <input name="company" value={form.company} onChange={handleChange} style={{ width: "100%" }} required />
        </div>
        <div>
          <label>薪资：</label>
          <input name="salary" value={form.salary} onChange={handleChange} style={{ width: "100%" }} required />
        </div>
        <div>
          <label>技能要求：</label>
          <input name="requirements" value={form.requirements} onChange={handleChange} style={{ width: "100%" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button type="button" onClick={onClose} style={{ padding: "4px 12px" }}>
            取消
          </button>
          <button type="submit" style={{ padding: "4px 12px", background: "#409eff", color: "#fff", border: "none", borderRadius: 4 }}>
            保存
          </button>
        </div>
      </form>
    </div>
  )
}

export default function Job() {
  const [jobs, setJobs] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editJob, setEditJob] = useState(null)

  const fetchJobs = async () => {
    try {
      const res = await axios.get("/bosses")
      setJobs(res.data)
    } catch (error) {
      console.error("获取职位失败:", error)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const handleAdd = () => {
    setEditJob(null)
    setShowForm(true)
  }

  const handleEdit = (job) => {
    setEditJob(job)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditJob(null)
  }

  const handleFormSubmit = async (formData) => {
    console.log("editJob", editJob)
    if (editJob && editJob.id) {
      // 编辑
      try {
        //
        await axios.put(`/updateBoss/${editJob.id}`, { id: editJob.id, ...formData })
        await fetchJobs()
        setShowForm(false)
        setEditJob(null)
      } catch (error) {
        console.error("编辑失败", error)
      }
    } else {
      // 新增
      try {
        await axios.post("/add/boss", formData)
        await fetchJobs()
        setShowForm(false)
      } catch (error) {
        console.error("新增失败", error)
      }
    }
  }

  const handleDelete = async (formData) => {
    try {
      await axios.delete(`/delete/${formData.id}`)
      await fetchJobs()
      console.error("删除成功")
    } catch (error) {
      console.error("删除失败", error)
    }
  }

  return (
    <>
      <div style={{ textAlign: "right", margin: "20px 40px 0 0" }}>
        <button
          onClick={handleAdd}
          style={{
            background: "#67c23a",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "8px 20px",
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          新增职位
        </button>
      </div>
      {jobs.length === 0 ? (
        <div style={{ textAlign: "center", color: "#888", marginTop: "40px" }}>暂无数据</div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
          {jobs.map((job) => (
            <div
              key={job.id}
              style={{
                background: "#fff",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                padding: "24px",
                width: "320px",
                margin: "10px 0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              <div style={{ fontWeight: "bold", fontSize: "18px", color: "#333", marginBottom: "8px" }}>{job.title}</div>
              <div style={{ color: "#666", marginBottom: "6px" }}>公司：{job.company}</div>
              <div style={{ color: "#888", marginBottom: "6px" }}>行业：{job.title}</div>
              <div style={{ color: "#e67e22", fontWeight: "bold", marginBottom: "6px" }}>薪资：{job.salary}</div>
              <div style={{ color: "#409eff" }}>技能要求：{job.requirements ? job.requirements : "无"}</div>
              <button
                onClick={() => handleEdit(job)}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 80,
                  background: "#67c23a",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  padding: "4px 12px",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                编辑
              </button>
              <button
                onClick={() => handleDelete(job)}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  background: "#67c23a",
                  color: "red",
                  border: "none",
                  borderRadius: 4,
                  padding: "4px 12px",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}
      <JobForm visible={showForm} onClose={handleFormClose} onSubmit={handleFormSubmit} initialData={editJob} />
    </>
  )
}
