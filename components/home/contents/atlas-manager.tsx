'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { useToast } from '@/hooks/use-toast'
import { useState, useEffect } from 'react'
import { getAtlasModels, getCachedAtlasModels, updateComputeMaxModel, updateR3AdvancedModel, updateVisionProModel } from '@/lib/api'
import { AwardIcon, MagnetIcon, Stars, StarsIcon, Info, Trash2 } from 'lucide-react'
import { getPromptModeStatusClient, updatePromptModeClient, deletePromptModeClient, getSmartActionsClient, updateSmartActionClient } from '@/lib/atlas-api'
import { sanitizePrompt, consumeBilling } from '@/lib/api'

export default function AtlasManager() {
  const { toast } = useToast()
  const [selectedMode, setSelectedMode] = useState<'default' | 'custom'>('default')
  const [trainingPrompts, setTrainingPrompts] = useState({
    computeMax: '',
    r3Advanced: '',
    visionPro: '',
  })
  const [smartActions, setSmartActions] = useState({
    stealthMode: false,
    sphereBoxMode: false,
    completionSound: false,
    temporaryLock: false,
    incognitoCapture: false,
    viewOnMobile: false,
  })
  const [modelsEnabled, setModelsEnabled] = useState({
    computeMax: false,
    r3Advanced: false,
    visionPro: false,
  })
  const [trained, setTrained] = useState({
    computeMax: false,
    r3Advanced: false,
    visionPro: false,
  })
  const [promptLoading, setPromptLoading] = useState({
    computeMax: false,
    r3Advanced: false,
    visionPro: false,
  })
  const [deleteLoading, setDeleteLoading] = useState({
    computeMax: false,
    r3Advanced: false,
    visionPro: false,
  })
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string } | null>(null)
  const [loadingInit, setLoadingInit] = useState(true)
  const [loadingComputeMax, setLoadingComputeMax] = useState(false)
  const [loadingR3Advanced, setLoadingR3Advanced] = useState(false)
  const [loadingVisionPro, setLoadingVisionPro] = useState(false)
  const enabledCount =
    (modelsEnabled.computeMax ? 1 : 0) +
    (modelsEnabled.r3Advanced ? 1 : 0) +
    (modelsEnabled.visionPro ? 1 : 0)
  const gridCols =
    enabledCount === 1
      ? 'grid grid-cols-1 md:grid-cols-1 gap-4'
      : enabledCount === 2
        ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
        : 'grid grid-cols-1 md:grid-cols-3 gap-4'

  const selectMode = (mode: 'default' | 'custom') => {
    setSelectedMode(mode)
  }

  const onCustomize = async (key: keyof typeof trainingPrompts) => {
    const raw = trainingPrompts[key]
    if (!raw || selectedMode !== 'custom') return
    const provider = key === 'computeMax' ? 'gemini' : key === 'r3Advanced' ? 'openai' : 'grok'
    const email = currentUser?.email || 'you@loopsync.cloud'
    const userId = currentUser?.id || 'unknown'
    setPromptLoading((l) => ({ ...l, [key]: true }))
    try {
      const sanitized = await sanitizePrompt({
        rawPrompt: raw,
        provider,
        scope: 'image-capture',
        userId,
        email,
        includeMandatoryBlock: true,
      })
      const finalPrompt = sanitized.finalPrompt
      const updated = await updatePromptModeClient({
        email,
        mode: 'custom',
        prompt: finalPrompt,
        provider,
        scope: 'image-capture',
      })
      setTrainingPrompts((p) => ({ ...p, [key]: finalPrompt }))
      setTrained((t) => ({ ...t, [key]: updated.mode === 'custom' }))
      try {
        const requestId = `PM-${provider}-${Date.now()}`
        await consumeBilling(email, 199, `atlas.customize.${provider}`, requestId)
      } catch { }
      // toast({ title: 'Updated', description: 'Custom response saved.' })
    } catch (e) {
      // toast({ title: 'Failed', description: 'Could not customize prompt.', variant: 'destructive' })
    } finally {
      setPromptLoading((l) => ({ ...l, [key]: false }))
    }
  }

  const updateTrainingPrompt = (key: keyof typeof trainingPrompts, value: string) => {
    setTrainingPrompts((p) => ({ ...p, [key]: value }))
  }

  const toggleSmartAction = async (key: keyof typeof smartActions) => {
    if (key === 'viewOnMobile') {
      setSmartActions((prev) => ({ ...prev, [key]: !prev[key] }))
      return
    }
    const prev = smartActions[key]
    const next = !prev
    setSmartActions((s) => ({ ...s, [key]: next }))
    try {
      const email = currentUser?.email || 'you@loopsync.cloud'
      await updateSmartActionClient({ email, key: key as any, enabled: next })
      // toast({ title: 'Updated', description: 'Smart action saved.' })
    } catch (e) {
      setSmartActions((s) => ({ ...s, [key]: prev }))
      // toast({ title: 'Failed', description: 'Could not update smart action.', variant: 'destructive' })
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const cached = getCachedAtlasModels()
        const models = cached ?? (await getAtlasModels())
        setModelsEnabled({
          computeMax: models.computeMax === 'active',
          r3Advanced: models.r3Advanced === 'active',
          visionPro: models.visionPro === 'active',
        })
      } catch (e) {
        // toast({ title: 'Failed to load models', description: 'Using defaults.', variant: 'destructive' })
      } finally {
        setLoadingInit(false)
      }
    })()
  }, [toast])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user')
      if (raw) {
        const u = JSON.parse(raw) as { id: string; email: string }
        setCurrentUser({ id: u.id, email: u.email })
      }
    } catch { }
  }, [])

  useEffect(() => {
    (async () => {
      try {
        const email = (currentUser?.email || 'you@loopsync.cloud')
        const sa = await getSmartActionsClient(email)
        setSmartActions((s) => ({ ...s, ...sa }))
      } catch (e) {
        // toast({ title: 'Failed to load smart actions', description: 'Using defaults.', variant: 'destructive' })
      }
    })()
  }, [currentUser?.email, toast])

  useEffect(() => {
    (async () => {
      try {
        const { providers } = await getPromptModeStatusClient('you@loopsync.cloud')
        const gemini = providers.find((p) => p.provider === 'gemini')
        const openai = providers.find((p) => p.provider === 'openai')
        const grok = providers.find((p) => p.provider === 'grok')
        setTrainingPrompts((p) => ({
          ...p,
          computeMax: gemini?.prompt ?? p.computeMax,
          r3Advanced: openai?.prompt ?? p.r3Advanced,
          visionPro: grok?.prompt ?? p.visionPro,
        }))
        setTrained((t) => ({
          ...t,
          computeMax: !!gemini?.prompt && gemini?.mode === 'custom',
          r3Advanced: !!openai?.prompt && openai?.mode === 'custom',
          visionPro: !!grok?.prompt && grok?.mode === 'custom',
        }))
        const anyCustom = [gemini?.mode, openai?.mode, grok?.mode].some((m) => m === 'custom')
        if (anyCustom) setSelectedMode('custom')
      } catch (e) {
        // toast({ title: 'Failed to load prompt mode', description: 'Using defaults.', variant: 'destructive' })
      }
    })()
  }, [toast])

  const onDeletePrompt = async (key: keyof typeof trainingPrompts) => {
    const provider = key === 'computeMax' ? 'gemini' : key === 'r3Advanced' ? 'openai' : 'grok'
    const email = currentUser?.email || 'you@loopsync.cloud'
    setDeleteLoading((l) => ({ ...l, [key]: true }))
    try {
      await deletePromptModeClient(provider, email)
      setTrainingPrompts((p) => ({ ...p, [key]: '' }))
      setTrained((t) => ({ ...t, [key]: false }))
      // toast({ title: 'Deleted', description: 'Custom response removed.' })
    } catch (e) {
      // toast({ title: 'Failed', description: 'Could not delete custom response.', variant: 'destructive' })
    } finally {
      setDeleteLoading((l) => ({ ...l, [key]: false }))
    }
  }

  const toggleModel = async (key: keyof typeof modelsEnabled) => {
    const prev = modelsEnabled[key]
    const next = !prev
    setModelsEnabled((p) => ({ ...p, [key]: next }))
    if (key === 'computeMax') setLoadingComputeMax(true)
    if (key === 'r3Advanced') setLoadingR3Advanced(true)
    if (key === 'visionPro') setLoadingVisionPro(true)
    try {
      if (key === 'computeMax') await updateComputeMaxModel(next)
      else if (key === 'r3Advanced') await updateR3AdvancedModel(next)
      else await updateVisionProModel(next)
      // toast({ title: 'Updated', description: 'Model preference saved.' })
    } catch (e) {
      setModelsEnabled((p) => ({ ...p, [key]: prev }))
      // toast({ title: 'Failed', description: 'Could not update model.', variant: 'destructive' })
    } finally {
      if (key === 'computeMax') setLoadingComputeMax(false)
      if (key === 'r3Advanced') setLoadingR3Advanced(false)
      if (key === 'visionPro') setLoadingVisionPro(false)
    }
  }

  return (
    <div className="flex-1 bg-background relative overflow-auto scrollbar-hide">
      <div className="px-8 xl:px-12 pt-10 pb-4">
        <p className="text-4xl font-semibold text:white">Atlas Manager</p>
      </div>



      <div className="px-8 xl:px-12 mt-4 mb-12">
        <div className="relative rounded-3xl overflow-hidden bg-black/40 backdrop-blur-xl border border-white/5">
          <div
            className="absolute inset-0 pointer-events-none opacity-50"
            style={{
              backgroundImage:
                'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 100%), repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 2px)',
            }}
          />
          <div className="relative p-8 md:p-12 flex items-center gap-6">
            <img src="/resources/apple.svg" alt="Apple" className="w-10 h-10 brightness-0 invert" />
            <img src="/resources/windows.svg" alt="Windows" className="w-9 h-9 brightness-0 invert" />
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Atlas Extension</h2>
              <p className="mt-1 text-white/70">Select a mode to evaluate Atlas. Safe is ready to go, Custom lets you customize actions.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 xl:px-12 pb-10">
        <Card className="relative overflow-hidden rounded-3xl border border-white/5 bg-black/50 backdrop-blur-xl">
          <div className="absolute inset-0 -z-10 bg-black/50" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white font-bold text-lg">Atlas Models</CardTitle>
            </div>
            {/* <CardDescription className="text-white">Enable or disable available models.</CardDescription> */}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="group relative  border border-white/10 bg-black p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-white font-bold">Compute-Max</p>
                    <p className="text-white/70 text-sm">High-performance compute mode.</p>
                    <p className="text-white mt-4 p-2 bg-[#141416] text-xs font-semibold mt-1">Consumes more of your billing balance.</p>
                  </div>
                  <Switch
                    id="computeMax"
                    checked={modelsEnabled.computeMax}
                    disabled={loadingInit || loadingComputeMax}
                    onCheckedChange={() => toggleModel('computeMax')}
                    className="group-hover:scale-110 transition-transform cursor-pointer"
                  />
                </div>
              </div>
              <div className="group relative  border border-white/10 bg-black p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-white font-bold">R3 Advanced</p>
                    <p className="text-white/70 text-sm">Advanced reasoning capabilities.</p>
                    <p className="text-white mt-4 p-2 bg-[#141416] text-xs font-semibold mt-1">Optimized to consume less billing balance.</p>
                  </div>
                  <Switch
                    id="r3Advanced"
                    checked={modelsEnabled.r3Advanced}
                    disabled={loadingInit || loadingR3Advanced}
                    onCheckedChange={() => toggleModel('r3Advanced')}
                    className="group-hover:scale-110 transition-transform cursor-pointer"
                  />
                </div>
              </div>
              <div className="group relative  border border-white/10 bg-black p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-white font-bold">Vision Pro</p>
                    <p className="text-white/70 text-sm">Enhanced visual understanding.</p>
                    <p className="text-white mt-4 p-2 bg-[#141416] text-xs font-semibold mt-1">Optimized for balanced performance.</p>
                  </div>
                  <Switch
                    id="visionPro"
                    checked={modelsEnabled.visionPro}
                    disabled={loadingInit || loadingVisionPro}
                    onCheckedChange={() => toggleModel('visionPro')}
                    className="group-hover:scale-110 transition-transform cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="px-8 xl:px-12 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-6">
          {[
            { id: 'default' as const, title: 'Default', desc: 'Pre-configured safe operations' },
            { id: 'custom' as const, title: 'Custom', desc: 'Configure custom smart and safe operations' },
          ].map((opt) => {
            const isSelected = selectedMode === opt.id
            return (
              <Card
                key={opt.id}
                onClick={() => selectMode(opt.id)}
                className={`relative overflow-hidden rounded-3xl border ${isSelected ? 'border-white/5 border-4 bg-black/60' : 'border-white/5 bg-black/50'} backdrop-blur-xl hover:bg-black/60 transition-colors cursor-pointer`}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ backgroundImage: 'radial-gradient(60% 70% at 50% 55%, rgba(255,255,255,0.06), transparent)' }}
                />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-white/60">Atlas Mode</p>
                    <Badge variant="outline" className="text-white/80 font-semibold">
                      {isSelected ? 'Selected' : 'Choose'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="py-5">
                  <div className="flex items-start gap-4">
                    <img src="/apps/atlas.png" alt={opt.title} className="w-14 h-14 rounded-xl ring-1 ring-white/10 shadow-lg" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-white text-base flex items-center gap-2">{opt.title}</CardTitle>
                        <Badge variant="outline" className="text-white/70">Atlas</Badge>
                      </div>
                      <CardDescription className="text-white/70 mt-1">{opt.desc}</CardDescription>
                      <div className="mt-4 flex items-center gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-white text-black font-semibold hover:bg-white/90 rounded-full"
                        >
                          {isSelected ? 'Selected' : 'Select'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <div className="px-8 xl:px-12 pb-20">
        <Card className="relative overflow-hidden rounded-3xl border border-white/5 bg-black/50 backdrop-blur-xl">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(60% 70% at 50% 55%, rgba(255,255,255,0.06), transparent)' }}
          />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-lg">Customize How Atlas Responds</CardTitle>
              <Badge variant="outline" className="text-white/80 font-semibold">{selectedMode === 'default' ? 'Default' : 'Custom'}</Badge>
            </div>
            <CardDescription className="text-white/70">Configure per-model instructions when using Custom mode.</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              aria-hidden={selectedMode !== 'custom'}
              className={`transition-all duration-300 ${selectedMode === 'custom'
                ? 'opacity-100 max-h-[1000px]'
                : 'opacity-0 max-h-0 overflow-hidden pointer-events-none'
                }`}
            >
              {enabledCount === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-white/80 text-sm">Enable a model to customise</p>
                </div>
              ) : (
                <div className={gridCols}>
                  {modelsEnabled.computeMax && (
                    <Card className="relative overflow-hidden rounded-xl border border-white/0 bg-black backdrop-blur-xl">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white text-base">Compute-Max</CardTitle>
                          <Badge variant="outline" className="text-white/70">Atlas</Badge>
                        </div>
                        <CardDescription className="text-white/70">High-performance compute mode.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {trained.computeMax ? (
                          <p className="text-white/80 text-sm bg-[#141416] p-3 rounded-md">
                            Success! If you'd like to revise it, delete your custom response and create a new one.
                          </p>
                        ) : (
                          <Textarea
                            value={trainingPrompts.computeMax}
                            onChange={(e) => updateTrainingPrompt('computeMax', e.target.value)
                            }
                            placeholder="Set your preferred style. Example: 'Solve problems step by step with brief explanations.'"
                            className="text-white/90 h-32"
                          />
                        )}
                        <div className="flex items-center gap-2">
                          {trained.computeMax ? (
                            <Button
                              variant="default"
                              className="bg-red-600 text-white font-semibold hover:bg-red-500 rounded-full"
                              onClick={() => onDeletePrompt('computeMax')}
                              disabled={selectedMode !== 'custom' || deleteLoading.computeMax}
                            >
                              {deleteLoading.computeMax ? (
                                <span className="inline-flex items-center gap-2">
                                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  Removing...
                                </span>
                              ) : (
                                <>
                                  <Trash2 className="w-5 h-5 mr-1" />
                                  Delete
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button
                              variant="default"
                              className="bg-white text-black font-semibold hover:bg-white/90 rounded-full"
                              onClick={() => onCustomize('computeMax')}
                              disabled={selectedMode !== 'custom' || promptLoading.computeMax}
                            >
                              {promptLoading.computeMax ? (
                                <span className="inline-flex items-center gap-2">
                                  <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                  Preparing...
                                </span>
                              ) : (
                                <>
                                  <StarsIcon className="w-5 h-5 mr-1" />
                                  Customize
                                </>
                              )}
                            </Button>
                          )}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full cursor-help">
                                <Info className="w-3.5 h-3.5 text-white/50" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="bg-white font-semibold text-black rounded-xl w-64 shadow-lg border border-black/10">
                              Each customization event incurs a cost of approximately ₹1.99
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {modelsEnabled.r3Advanced && (
                    <Card className="relative overflow-hidden rounded-xl border border-white/0 bg-black backdrop-blur-xl">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white text-base">R3 Advanced</CardTitle>
                          <Badge variant="outline" className="text-white/70">Atlas</Badge>
                        </div>
                        <CardDescription className="text-white/70">Advanced reasoning capabilities.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {trained.r3Advanced ? (
                          <p className="text-white/80 text-sm bg-[#141416] p-3 rounded-md">
                            Success! If you’d like to revise it, delete your custom response and create a new one.
                          </p>
                        ) : (
                          <Textarea
                            value={trainingPrompts.r3Advanced}
                            onChange={(e) => updateTrainingPrompt('r3Advanced', e.target.value)
                            }
                            placeholder="Tell Atlas how to answer. Example: 'Show each step clearly, then give the final answer.'"
                            className="text-white/90 h-32"
                          />
                        )}
                        <div className="flex items-center gap-2">
                          {trained.r3Advanced ? (
                            <Button
                              variant="default"
                              className="bg-red-600 text-white font-semibold hover:bg-red-500 rounded-full"
                              onClick={() => onDeletePrompt('r3Advanced')}
                              disabled={selectedMode !== 'custom' || deleteLoading.r3Advanced}
                            >
                              {deleteLoading.r3Advanced ? (
                                <span className="inline-flex items-center gap-2">
                                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  Removing...
                                </span>
                              ) : (
                                <>
                                  <Trash2 className="w-5 h-5 mr-1" />
                                  Delete
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button
                              variant="default"
                              className="bg-white text-black font-semibold hover:bg-white/90 rounded-full"
                              onClick={() => onCustomize('r3Advanced')}
                              disabled={selectedMode !== 'custom' || promptLoading.r3Advanced}
                            >
                              {promptLoading.r3Advanced ? (
                                <span className="inline-flex items-center gap-2">
                                  <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                  Preparing...
                                </span>
                              ) : (
                                <>
                                  <StarsIcon className="w-5 h-5 mr-1" />
                                  Customize
                                </>
                              )}
                            </Button>
                          )}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full cursor-help">
                                <Info className="w-3.5 h-3.5 text-white/50" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="bg-white font-semibold text-black rounded-xl w-64 shadow-lg border border-black/10">
                              Each customization event incurs a cost of approximately ₹1.99
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {modelsEnabled.visionPro && (
                    <Card className="relative overflow-hidden rounded-xl border border-white/0 bg-black backdrop-blur-xl">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white text-base">Vision Pro</CardTitle>
                          <Badge variant="outline" className="text-white/70">Atlas</Badge>
                        </div>
                        <CardDescription className="text-white/70">Enhanced visual understanding.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {trained.visionPro ? (
                          <p className="text-white/80 text-sm bg-[#141416] p-3 rounded-md">
                            Success! If you’d like to revise it, delete your custom response and create a new one.
                          </p>
                        ) : (
                          <Textarea
                            value={trainingPrompts.visionPro}
                            onChange={(e) => updateTrainingPrompt('visionPro', e.target.value)
                            }
                            placeholder="Describe instructions - e.g., visual extraction, OCR, charts and diagrams"
                            className="text-white/90 h-32"
                          />
                        )}
                        <div className="flex items-center gap-2">
                          {trained.visionPro ? (
                            <Button
                              variant="default"
                              className="bg-red-600 text-white font-semibold hover:bg-red-500 rounded-full"
                              onClick={() => onDeletePrompt('visionPro')}
                              disabled={selectedMode !== 'custom' || deleteLoading.visionPro}
                            >
                              {deleteLoading.visionPro ? (
                                <span className="inline-flex items-center gap-2">
                                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  Removing...
                                </span>
                              ) : (
                                <>
                                  <Trash2 className="w-5 h-5 mr-1" />
                                  Delete
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button
                              variant="default"
                              className="bg-white text-black font-semibold hover:bg-white/90 rounded-full"
                              onClick={() => onCustomize('visionPro')}
                              disabled={selectedMode !== 'custom' || promptLoading.visionPro}
                            >
                              {promptLoading.visionPro ? (
                                <span className="inline-flex items-center gap-2">
                                  <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                  Preparing...
                                </span>
                              ) : (
                                <>
                                  <StarsIcon className="w-5 h-5 mr-1" />
                                  Customize
                                </>
                              )}
                            </Button>
                          )}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full cursor-help">
                                <Info className="w-3.5 h-3.5 text-white/50" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="bg-white font-semibold text-black rounded-xl w-64 shadow-lg border border-black/10">
                              Each customization event incurs a cost of approximately ₹1.99
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="px-8 xl:px-12 pb-20">
        <Card className="relative overflow-hidden rounded-3xl border border-white/5 bg-black/50 backdrop-blur-xl">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(60% 70% at 50% 55%, rgba(255,255,255,0.06), transparent)' }}
          />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-lg">Smart Actions</CardTitle>
              <Badge
                variant="outline"
                className="flex items-center gap-2 text-white font-semibold font-mono p-2 px-4"
              >
                Alt + X + Drag
                <img
                  src="/resources/windows.svg"
                  alt="Windows"
                  className="w-4 h-4 ml-4 brightness-0 invert opacity-100"
                />
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group relative rounded-xl border border-white/10 bg-black/40 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-white font-bold">Stealth Mode</p>
                    <p className="text-white/70 text-sm">Make the draggable capture tool invisible while active.</p>
                  </div>
                  <Switch
                    id="stealthMode"
                    checked={smartActions.stealthMode}
                    onCheckedChange={() => toggleSmartAction('stealthMode')}
                    className='group-hover:scale-110 transition-transform cursor-pointer'
                  />
                </div>
              </div>

              <div className="group relative rounded-xl border border-white/10 bg-black/40 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-white font-bold">Sphere Box Mode</p>
                    <p className="text-white/70 text-sm">Open a smart response popup after capturing a region.</p>
                  </div>
                  <Switch
                    id="sphereBoxMode"
                    checked={smartActions.sphereBoxMode}
                    onCheckedChange={() => toggleSmartAction('sphereBoxMode')}
                    className='group-hover:scale-110 transition-transform cursor-pointer'
                  />
                </div>
              </div>



              <div className="group relative rounded-xl border border-white/10 bg-black/40 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-white font-bold">Temporary Lock</p>
                    <p className="text-white/70 text-sm">Lock the capture tool to prevent accidental misuse or hijacking.</p>
                  </div>
                  <Switch
                    id="temporaryLock"
                    checked={smartActions.temporaryLock}
                    onCheckedChange={() => toggleSmartAction('temporaryLock')}
                    className='group-hover:scale-110 transition-transform cursor-pointer'
                  />
                </div>
              </div>

              <div className="group relative rounded-xl border border-white/10 bg-black/40 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-white font-bold">Completion Sound</p>
                    <p className="text-white/70 text-sm">Play a gentle sound when capture or analysis finishes.</p>
                  </div>
                  <Switch
                    id="completionSound"
                    checked={smartActions.completionSound}
                    onCheckedChange={() => toggleSmartAction('completionSound')}
                    className='group-hover:scale-110 transition-transform cursor-pointer'
                  />
                </div>
              </div>

              <div className="group relative rounded-xl border border-white/10 bg-black/40 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-white font-bold">Incognito Capture</p>
                    <p className="text-white/70 text-sm">Analyze privately without storing history or logs.</p>
                  </div>
                  <Switch
                    id="incognitoCapture"
                    checked={smartActions.incognitoCapture}
                    onCheckedChange={() => toggleSmartAction('incognitoCapture')}
                    className='group-hover:scale-110 transition-transform cursor-pointer'
                  />
                </div>
              </div>

              <div className="group relative rounded-xl border border-white/10 bg-black/40 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-white font-bold">View Response on Other Devices</p>
                    <p className="text-white/70 text-sm">Sync captures to your account and view across devices.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* <Switch
                      id="viewOnMobile"
                      checked={smartActions.viewOnMobile}
                      onCheckedChange={() => toggleSmartAction('viewOnMobile')}
                    /> */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full font-semibold text-black bg-white hover:bg-white/90 hover:text-black cursor-pointer"
                      onClick={() => window.open('https://self.loopsync.cloud/response-view/atlas', '_blank')}
                    >
                      Open
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="px-8 xl:px-12 pb-20 mt-12" />


    </div>
  )
}
