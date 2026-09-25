import { spawn } from 'node:child_process'

const children = [
  spawn(process.execPath, ['server/index.mjs'], { stdio: 'inherit', env: process.env }),
  spawn(process.execPath, ['node_modules/vite/bin/vite.js'], { stdio: 'inherit', env: process.env }),
]
let stopping = false
function stop(code = 0) {
  if (stopping) return
  stopping = true
  for (const child of children) if (!child.killed) child.kill('SIGTERM')
  process.exitCode = code
}
for (const child of children) child.on('exit', (code) => { if (!stopping && code !== 0) stop(code || 1) })
process.on('SIGINT', () => stop())
process.on('SIGTERM', () => stop())
