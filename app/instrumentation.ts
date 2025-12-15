// export async function register() {
//   const c = globalThis.console
//   if (!c) return
//   const noop = () => {}
//   const methods = [
//     'log',
//     'info',
//     'debug',
//     'warn',
//     'error',
//     'trace',
//     'group',
//     'groupCollapsed',
//     'groupEnd',
//     'time',
//     'timeEnd',
//     'timeLog',
//   ]
//   for (const m of methods) {
//     try {
//       ;(c as any)[m] = noop
//     } catch {}
//   }
// }
export async function register() {
  // Console methods are now enabled for debugging
}