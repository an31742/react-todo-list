// worker-wrapper.js
export default class WorkerWrapper {
  constructor(workerPath) {
    this.worker = new Worker(workerPath, { type: "module" })
  }
  postMessage(data) {
    this.worker.postMessage(data)
  }
  onMessage(callback) {
    this.worker.onmessage = (e) => callback(e.data)
  }
  terminate() {
    this.worker.terminate()
  }
}
