"use client"

import { useEffect } from "react"
import { getProfileMe, getProfilePreferences } from "@/lib/api"

export default function ProfileInit() {
  useEffect(() => {
    getProfileMe().catch(() => {})
    getProfilePreferences().catch(() => {})
  }, [])
  // useEffect(() => {
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
  // }, [])
  // useEffect(() => {
  //   const onCtx = (e: Event) => {
  //     e.preventDefault()
  //   }
  //   const onKey = (e: KeyboardEvent) => {
  //     const k = (e.key || '').toUpperCase()
  //     const comboCtrlShift = e.ctrlKey && e.shiftKey && ['I', 'J', 'C', 'K', 'U', 'P'].includes(k)
  //     const comboMetaAlt = e.metaKey && e.altKey && ['I', 'J', 'C', 'K', 'U', 'P'].includes(k)
  //     if (k === 'F12' || comboCtrlShift || comboMetaAlt) {
  //       e.preventDefault()
  //       e.stopPropagation()
  //       return false as unknown as void
  //     }
  //   }
  //   document.addEventListener('contextmenu', onCtx)
  //   document.addEventListener('keydown', onKey, true)
  //   return () => {
  //     document.removeEventListener('contextmenu', onCtx)
  //     document.removeEventListener('keydown', onKey, true)
  //   }
  // }, [])
  useEffect(() => {
    // Developer tools are now enabled for debugging
  }, [])
  return null
}