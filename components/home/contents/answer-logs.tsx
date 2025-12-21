'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Download, FileDown, ExternalLink, CopyPlusIcon, Copy, Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useEffect, useState } from 'react'
import { getAtlasCollectionsClient, AtlasCollectionItem } from '@/lib/atlas-api'
import { getAtlasCollectionDetailClient, AtlasCollectionDetail } from '@/lib/atlas-api'
import { getCeresCollectionsClient, type CeresCollectionItem } from '@/lib/ceres-api'
import { getCeresCollectionDetailClient, type CeresCollectionDetail } from '@/lib/ceres-api'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

export function AnswerLogs() {
  const [atlasCollections, setAtlasCollections] = useState<AtlasCollectionItem[]>([])
  const [ceresCollections, setCeresCollections] = useState<CeresCollectionItem[]>([])
  const [openView, setOpenView] = useState(false)
  const [viewing, setViewing] = useState<AtlasCollectionDetail | null>(null)
  const [viewingCeres, setViewingCeres] = useState<CeresCollectionDetail | null>(null)
  const [loadingView, setLoadingView] = useState(false)
  const [viewError, setViewError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const showControls = false
  const [atlasPage, setAtlasPage] = useState(1)
  const [ceresPage, setCeresPage] = useState(1)
  const PAGE_SIZE = 10

  useEffect(() => {
    setAtlasPage(1)
  }, [atlasCollections.length])

  useEffect(() => {
    setCeresPage(1)
  }, [ceresCollections.length])

  useEffect(() => {
    (async () => {
      try {
        let email = 'you@loopsync.cloud'
        try {
          const raw = localStorage.getItem('user')
          if (raw) email = (JSON.parse(raw) as { email: string }).email || email
        } catch { }
        const { collections } = await getAtlasCollectionsClient(email)
        setAtlasCollections(collections || [])
      } catch { }
    })()
  }, [])

  useEffect(() => {
    (async () => {
      try {
        let email = 'you@loopsync.cloud'
        try {
          const raw = localStorage.getItem('user')
          if (raw) email = (JSON.parse(raw) as { email: string }).email || email
        } catch { }
        const { collections } = await getCeresCollectionsClient(email)
        setCeresCollections(collections || [])
      } catch { }
    })()
  }, [])

  const downloadSelected = () => { }
  const exportSelected = () => { }
  const onView = async (id: string) => {
    setOpenView(true)
    setLoadingView(true)
    setViewError(null)
    setViewing(null)
    setViewingCeres(null)
    setSelectedId(id)
    try {
      let email = 'you@loopsync.cloud'
      try {
        const raw = localStorage.getItem('user')
        if (raw) email = (JSON.parse(raw) as { email: string }).email || email
      } catch { }
      const data = await getAtlasCollectionDetailClient(id, email)
      setViewing(data)
    } catch (e: any) {
      const msg = typeof e?.message === 'string' ? e.message : 'Failed to load collection'
      setViewError(msg)
    } finally {
      setLoadingView(false)
    }
  }

  const onViewCeres = async (id: string) => {
    setOpenView(true)
    setLoadingView(true)
    setViewError(null)
    setViewing(null)
    setViewingCeres(null)
    setSelectedId(id)
    try {
      let email = 'you@loopsync.cloud'
      try {
        const raw = localStorage.getItem('user')
        if (raw) email = (JSON.parse(raw) as { email: string }).email || email
      } catch { }
      const data = await getCeresCollectionDetailClient(id, email)
      setViewingCeres(data)
    } catch (e: any) {
      const msg = typeof e?.message === 'string' ? e.message : 'Failed to load collection'
      setViewError(msg)
    } finally {
      setLoadingView(false)
    }
  }

  return (
    <div className="flex-1 bg-background relative overflow-auto scrollbar-hide">
      <div className="px-8 xl:px-12 pt-10 pb-4">
        <p className="text-4xl font-semibold text:white">Collections</p>
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
              <h2 className="text-3xl md:text-4xl font-bold text-white">Activity Snapshot</h2>
              <p className="mt-1 text-white/70">History of captured responses and your interactions across Atlas and Ceres Assist.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 xl:px-12 pb-20">
        <div className="flex items-center justify-between mb-6">
          <Tabs defaultValue="atlas" className="flex-1">
            <TabsList className="bg-black/80 text-white rounded-full border border-white/0 shadow-[inset_0_0_12px_rgba(255,255,255,0.25)] p-1 w-fit">
              <TabsTrigger
                value="atlas"
                className="rounded-full px-4 py-2 text-sm data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70 hover:text-white"
              >
                Atlas
              </TabsTrigger>
              <TabsTrigger
                value="ceres"
                className="rounded-full px-4 py-2 text-sm data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70 hover:text-white"
              >
                Ceres Assist
              </TabsTrigger>
            </TabsList>

            <TabsContent value="atlas">
              <Card className="bg-black border-white/5 rounded-3xl">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white font-bold text-lg">Atlas Collections</CardTitle>
                    {showControls && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="rounded-full text-white" onClick={downloadSelected}>
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-full text-white" onClick={exportSelected}>
                          <FileDown className="h-4 w-4" />
                          Export
                        </Button>
                      </div>
                    )}
                  </div>
                  <CardDescription className="text-white/70 font-semibold flex items-center gap-2">
                    Your recent Atlas interaction history.
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="inline-flex items-center justify-center mt-0.5 w-5 h-5 rounded-full bg-transparent text-white hover:bg-transparent cursor-pointer text-xs font-bold"><Info className="h-4 w-4 mt-0.5" /></button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white text-black font-semibold rounded-full shadow-2xl px-3 py-2">
                          Interactions performed in Incognito mode are not saved to history.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead className="text-white/70">Owner</TableHead>
                        <TableHead className="text-white/70">Interaction</TableHead>
                        <TableHead>Session</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {atlasCollections.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center text-white/50">
                            Collection not found
                          </TableCell>
                        </TableRow>
                      ) : (
                        atlasCollections
                          .slice((atlasPage - 1) * PAGE_SIZE, atlasPage * PAGE_SIZE)
                          .map((log) => (
                            <TableRow key={log.id}>
                              <TableCell className="font-medium text-white/90">{log.id.replace(/\D/g, '')}</TableCell>
                              <TableCell className="text-white/80">{log.date}</TableCell>
                              <TableCell className="text-white/80">{log.time}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-white/80">{log.owner}</Badge>
                              </TableCell>
                              <TableCell className="text-white/90">{log.interaction}</TableCell>
                              <TableCell className="text-white/80">{log.session}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" size="sm" className="rounded-full text-black font-semibold cursor-pointer bg-white hover:bg-white/90 hover:text-black" onClick={() => onView(log.id)}>
                                    <ExternalLink className="h-4 w-4" />
                                    View
                                  </Button>
                                  {showControls && (
                                    <Button variant="outline" size="sm" className="rounded-full text-white">
                                      <Download className="h-4 w-4" />
                                      Save
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                      )}
                    </TableBody>
                  </Table>
                  {atlasCollections.length > PAGE_SIZE && (
                    <Pagination className="mt-4">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              setAtlasPage((p) => Math.max(1, p - 1))
                            }}
                          />
                        </PaginationItem>
                        {Array.from({ length: Math.ceil(atlasCollections.length / PAGE_SIZE) }, (_, i) => i + 1).map((p) => (
                          <PaginationItem key={p}>
                            <PaginationLink
                              href="#"
                              isActive={p === atlasPage}
                              onClick={(e) => {
                                e.preventDefault()
                                setAtlasPage(p)
                              }}
                            >
                              {p}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              const max = Math.ceil(atlasCollections.length / PAGE_SIZE)
                              setAtlasPage((p) => Math.min(max, p + 1))
                            }}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ceres">
              <Card className="bg-black border-white/5 rounded-3xl">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg">Ceres Assist Collections</CardTitle>
                    {showControls && (
                      <div className="flex gap-2 items-center">
                        <Button variant="outline" size="sm" className="rounded-full text-white" onClick={downloadSelected}>
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-full text-white" onClick={exportSelected}>
                          <FileDown className="h-4 w-4" />
                          Export
                        </Button>
                      </div>
                    )}
                  </div>
                  <CardDescription className="text-white/70">History of requested answers and assists from Ceres.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead className="text-white/70">Owner</TableHead>
                        <TableHead className="text-white/70">Interaction</TableHead>
                        <TableHead>Session</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ceresCollections.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center text-white/50">
                            Collection not found
                          </TableCell>
                        </TableRow>
                      ) : (
                        ceresCollections
                          .slice((ceresPage - 1) * PAGE_SIZE, ceresPage * PAGE_SIZE)
                          .map((log) => (
                            <TableRow key={log.id}>
                              <TableCell className="font-medium text-white/90">{log.id}</TableCell>
                              <TableCell className="text-white/80">{log.date}</TableCell>
                              <TableCell className="text-white/80">{log.time}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-white/80">{log.owner}</Badge>
                              </TableCell>
                              <TableCell className="text-white/90">{log.interaction}</TableCell>
                              <TableCell className="text-white/80">{log.session}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" size="sm" className="rounded-full text-white" onClick={() => onViewCeres(log.id)}>
                                    <ExternalLink className="h-4 w-4" />
                                    View
                                  </Button>
                                  {showControls && (
                                    <Button variant="outline" size="sm" className="rounded-full text-white">
                                      <Download className="h-4 w-4" />
                                      Save
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                      )}
                    </TableBody>
                  </Table>
                  {ceresCollections.length > PAGE_SIZE && (
                    <Pagination className="mt-4 ">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              setCeresPage((p) => Math.max(1, p - 1))
                            }}
                          />
                        </PaginationItem>
                        {Array.from({ length: Math.ceil(ceresCollections.length / PAGE_SIZE) }, (_, i) => i + 1).map((p) => (
                          <PaginationItem key={p}>
                            <PaginationLink
                              href="#"
                              isActive={p === ceresPage}
                              onClick={(e) => {
                                e.preventDefault()
                                setCeresPage(p)
                              }}
                            >
                              {p}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              const max = Math.ceil(ceresCollections.length / PAGE_SIZE)
                              setCeresPage((p) => Math.min(max, p + 1))
                            }}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="px-8 xl:px-12 pb-20 mt-12" />

      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent
          className="
            bg-black/30 backdrop-blur-xl border-white/5 text-white
            rounded-3xl 
            sm:max-w-6xl
            h-[92vh]
            flex flex-col
            overflow-hidden
          "
        >
          <DialogHeader>
            <DialogTitle className="text-white mb-4">{viewing?.interaction || viewingCeres?.interaction || 'Collection'}</DialogTitle>
            {/* <DialogDescription className="text-white">{viewing ? viewing.session : ''}{selectedId ? ` • ${selectedId}` : ''}</DialogDescription> */}
          </DialogHeader>
          {loadingView ? (
            <div className="flex items-center justify-center py-8">
              <span className="w-5 h-5 border-2 border-white/5 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : viewError ? (
            <p className="text-red-400 text-sm">{viewError}</p>
          ) : viewing ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 h-full flex-1 min-h-0">
              {[
                { key: 'gemini', label: 'Compute-Max', data: viewing.responses.gemini },
                { key: 'openai', label: 'R3 Advanced', data: viewing.responses.openai },
                { key: 'grok', label: 'Vision Pro', data: viewing.responses.grok },
              ].map((p) => (
                <div
                  key={p.key}
                  className="
        relative flex flex-col rounded-3xl
        border border-white/10
        bg-transparent
        overflow-hidden
      "
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                    <div>
                      <p className="text-xl font-semibold text-white">{p.label}</p>
                      {/* <p className="text-xs text-white/50 tracking-wide uppercase">
            {p.key}
          </p> */}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:text-white rounded-full hover:bg-white/5 cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(p.data?.content || '')
                      }}
                      title="Copy response"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-h-0 px-4 py-3 overflow-hidden">
                    <ScrollArea className="h-full pr-2">
                      <div
                        className="
              text-sm text-white/90
              leading-relaxed
              whitespace-pre-wrap
              break-words
            "
                      >
                        {p.data?.content || (
                          <span className="text-white/40 italic">
                            No response available
                          </span>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              ))}
            </div>

          ) : viewingCeres ? (
            <div className="grid grid-cols-1 md:grid-cols-1 gap-5 h-full flex-1 min-h-0">
              <div className="relative flex flex-col rounded-3xl border border-white/10 bg-transparent overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                  <div>
                    <p className="text-xl font-semibold text-white">{viewingCeres.interaction}</p>
                    <p className="text-xs text-white/50">{viewingCeres.session}{selectedId ? ` • ${selectedId}` : ''}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-white rounded-full hover:bg-white/5 cursor-pointer"
                    onClick={() => {
                      const text = viewingCeres.responses?.message || ''
                      if (text) navigator.clipboard.writeText(text)
                    }}
                    title="Copy response"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 min-h-0 px-4 py-3 overflow-hidden">
                  <ScrollArea className="h-full pr-2">
                    <div className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap break-words">
                      {viewingCeres.responses?.message || <span className="text-white/40 italic">No response available</span>}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AnswerLogs