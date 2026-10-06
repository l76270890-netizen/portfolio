import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const backendDir = fileURLToPath(new URL('../backend/', import.meta.url))
const projectDir = fileURLToPath(new URL('../', import.meta.url))
const venvPython = join(projectDir, '.venv', process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python')
const python = process.env.PYTHON || (existsSync(venvPython) ? venvPython : 'python')
const apiPort = process.env.API_PORT || '8001'

const children = [
  spawn(python, ['-m', 'uvicorn', 'app.main:app', '--reload', '--host', '127.0.0.1', '--port', apiPort], {
    cwd: backendDir,
    stdio: 'inherit',
    env: process.env,
  }),
  spawn(process.execPath, ['node_modules/vite/bin/vite.js'], { stdio: 'inherit', env: process.env }),
]
let stopping = false
function stop(code = 0) {
  if (stopping) return
  stopping = true
  for (const child of children) if (!child.killed) child.kill('SIGTERM')
  process.exitCode = code
}
for (const child of children) {
  child.on('error', (error) => {
    console.error('Could not start the development process:', error)
    stop(1)
  })
  child.on('exit', (code) => { if (!stopping && code !== 0) stop(code || 1) })
}
process.on('SIGINT', () => stop())
process.on('SIGTERM', () => stop())
