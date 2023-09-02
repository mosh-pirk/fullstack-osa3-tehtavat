const error = (...params) => console.error(...params)
const info = (...params) => console.log(...params)
const warn = (...params) => console.warn(...params)

module.exports = {
  error, info, warn
}