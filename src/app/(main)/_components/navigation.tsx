'use client'

import { cn } from '@/lib/utils'
import {
  MenuIcon,
  ChevronsRight,
  PlusIcon,
  PlusCircleIcon,
  Search,
  Settings,
} from 'lucide-react'
import { GoHome } from 'react-icons/go'
import { IoTrashOutline } from 'react-icons/io5'
import { useParams, usePathname, useRouter } from 'next/navigation'
import React, { ElementRef, useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'usehooks-ts'
import { UserItem } from './user-item'
import { Item } from './item'
import { useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { toast } from 'sonner'
import { DocumentList } from './document-list'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { TrashBox } from './trash-box'
import { useSearch } from '@/hooks/use-search'
import { useSettings } from '@/hooks/user-settings'
import { Navbar } from './navbar'

export const Navigation = () => {
  const search = useSearch()
  const settings = useSettings()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const pathname = usePathname()
  const params = useParams()
  const router = useRouter()

  const [floating, setFloating] = useState(false)
  const isResizingRef = useRef<boolean>(false)
  const sidebarContainerRef = useRef<ElementRef<'aside'>>(null)
  const sidebarRef = useRef<ElementRef<'div'>>(null)
  const resizerRef = useRef<ElementRef<'div'>>(null)
  const navbarRef = useRef<ElementRef<'div'>>(null)
  const sidebarFloatingActionAreaRef = useRef<ElementRef<'div'>>(null)
  const sidebarFloatingActionAreaActiveRef = useRef<boolean>(false)
  const [isResetting, setIsResetting] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(isMobile)
  const width = useRef<number>(224)

  const create = useMutation(api.myFunctions.create)

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return

    setIsResetting(true)

    document.body.classList.add('cursor-ew-resize')
    let newWidth = event.clientX

    if (newWidth < 224) newWidth = 224
    if (newWidth > 480) newWidth = 480

    if (
      sidebarContainerRef.current &&
      navbarRef.current &&
      sidebarRef.current
    ) {
      if (!floating) {
        sidebarContainerRef.current.style.width = `${newWidth}px`
        navbarRef.current.style.width = `calc(100% - ${newWidth}px)`
        navbarRef.current.style.left = `${newWidth}px`
      }

      sidebarRef.current.style.width = `${newWidth}px`

      // remember last setted width
      width.current = newWidth
    }
  }

  const handleMouseUp = (event: MouseEvent) => {
    if (!isResizingRef.current) return
    document.body.classList.remove('cursor-ew-resize')
    isResizingRef.current = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    resizerRef.current?.classList.remove('opacity-100')
  }

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.stopPropagation()
    event.preventDefault()

    isResizingRef.current = true
    if (resizerRef.current) {
      resizerRef.current.classList.add('opacity-100')
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const resetSidebar = () => {
    if (
      sidebarContainerRef.current &&
      navbarRef.current &&
      sidebarRef.current
    ) {
      if (sidebarRef.current && sidebarFloatingActionAreaRef.current) {
        setFloating(false)
        sidebarRef.current.style.height = '100%'
        sidebarRef.current.style.boxShadow =
          'rgba(0, 0, 0, 0.024) -1px 0px 0px 0px inset'
        sidebarRef.current.style.borderRadius = '0'
      }

      setIsCollapsed(false)
      setIsResetting(true)

      sidebarContainerRef.current.style.width = isMobile
        ? '100%'
        : width.current + 'px'
      sidebarRef.current.style.transform = 'translateX(0)'
      sidebarRef.current.style.width = width.current + 'px'

      navbarRef.current.style.width = isMobile
        ? '0'
        : `calc(100% - ${width.current}px)`
      navbarRef.current.style.left = isMobile ? '100%' : width.current + 'px'

      setTimeout(() => {
        setIsResetting(false)
      }, 300)
    }
  }

  const collapse = () => {
    if (
      sidebarContainerRef.current &&
      navbarRef.current &&
      sidebarRef.current
    ) {
      if (floating) {
        disableFloatingSidebar()
      }

      setIsCollapsed(true)
      setIsResetting(true)

      sidebarContainerRef.current.style.width = '0'
      sidebarRef.current.style.transform = 'translateY(70px)'
      sidebarRef.current.style.height = 'calc(100% - 140px)'
      sidebarRef.current.style.boxShadow =
        '4px 6px 16px #00000038, 1px 0px 0px 0 #00000026 inset, 0px 0px 0px 1px #00000026 inset'
      sidebarRef.current.style.borderRadius = '0 6px 6px 0'

      navbarRef.current.style.width = '100%'
      navbarRef.current.style.left = '0'

      setTimeout(() => {
        setIsResetting(false)

        if (sidebarRef.current) {
          sidebarRef.current.style.transform =
            'translateY(70px) translateX(-100%)'
        }
      }, 300)
    }
  }

  useEffect(() => {
    if (isMobile) {
      collapse()
    } else {
      resetSidebar()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile])

  useEffect(() => {
    if (isMobile) {
      collapse()
    }
  }, [pathname, isMobile])

  const handleFloatingSidebar = (event: React.MouseEvent<HTMLDivElement>) => {
    sidebarFloatingActionAreaActiveRef.current = true
    // only work for desktop
    // enable, if the sidebar is already collapsed
    if (!isCollapsed || isMobile || floating) return

    if (sidebarRef.current && sidebarFloatingActionAreaRef.current) {
      setFloating(true)
      const sidebarStyles = window.getComputedStyle(sidebarRef.current)

      sidebarRef.current.style.height = 'calc(100% - 140px)'
      sidebarRef.current.style.width = sidebarStyles.width
      sidebarRef.current.style.boxShadow =
        '4px 6px 16px #00000038, 1px 0px 0px 0 #00000026 inset, 0px 0px 0px 1px #00000026 inset'
      sidebarRef.current.style.borderRadius = '0 6px 6px 0'
      sidebarRef.current.style.transform = 'matrix(1, 0, 0, 1, 0, 70)'
    }
  }

  const disableFloatingSidebar = () => {
    if (!floating || isResizingRef.current) return

    if (sidebarRef.current && sidebarFloatingActionAreaRef.current) {
      setFloating(false)
      const sidebarStyles = window.getComputedStyle(sidebarRef.current)
      sidebarRef.current.style.width = sidebarStyles.width
      sidebarRef.current.style.height = 'calc(100% - 140px)'
      sidebarRef.current.style.transform = 'translateX(-100%) translateY(70px)'
      sidebarRef.current.style.boxShadow =
        '4px 6px 16px #00000038, 1px 0px 0px 0 #00000026 inset, 0px 0px 0px 1px #00000026 inset'
      sidebarRef.current.style.borderRadius = '0 6px 6px 0'
    }
  }

  const handleCreatePage = async () => {
    const promise = create({ title: 'Untitled' })

    toast.promise(promise, {
      loading: 'Creating page...',
      success: 'Page created!',
      error: 'Failed to create page',
    })

    await promise.then((id: string) => {
      router.push(`/documents/${id}`)
    })
  }

  return (
    <>
      <aside
        ref={sidebarContainerRef}
        className={cn(
          'group/sidebar h-full relative flex w-56 flex-col z-50 transition-all duration-300 ease-linear',
          isMobile && 'w-0',
        )}
      >
        <div
          ref={sidebarRef}
          aria-label="Sidebar"
          id='sidebar'
          onMouseLeave={disableFloatingSidebar}
          className={cn(
            'bg-[#f7f7f5] dark:bg-[#1f1f1f] w-56 h-full flex flex-col transition-all duration-300 ease-linear dark:border-r',
          )}
        >
          <div aria-label="customize appearance">
            <div
              title="Hold & drag to resize"
              role="button"
              onMouseDown={handleMouseDown}
              onDoubleClick={collapse}
              ref={resizerRef}
              className={cn(
                'transition-opacity opacity-0 group-hover/sidebar:opacity-100 absolute top-0 right-0 h-full w-[2px] bg-zinc-200 dark:bg-zinc-600 cursor-ew-resize',
              )}
            >
              <div className="-ml-[6px] w-[16px] h-full"></div>
            </div>
          </div>

          <div aria-label="user settings">
            <div className="hover:bg-neutral-200/70 dark:hover:bg-neutral-800 rounded-[4px] mt-1 mx-1 w-[calc(100%-8px)] h-9 flex items-center px-2">
              <UserItem
                collapse={collapse}
                isMobile={isMobile}
                isFloating={floating}
              />
            </div>
            <div aria-label="space" className="my-1"></div>

            <Item
              label="Search"
              icon={Search}
              onClick={search.onOpen}
              isSearch
            />

            <Item
              label="Home"
              icon={HomeIconComponent}
              onClick={() => router.push('/home')}
            />

            <Item label="Settings" icon={Settings} onClick={settings.onOpen} />

            <Item
              onClick={handleCreatePage}
              label="New page"
              icon={PlusCircleIcon}
            />
          </div>

          <div className="mt-4">
            <DocumentList />
            <Popover>
              <PopoverTrigger className="w-full mt-4">
                <Item label="Trash" icon={IoTrashOutline} onClick={() => {}} />
              </PopoverTrigger>
              <PopoverContent
                side={isMobile ? 'bottom' : 'right'}
                className="p-0 w-72"
              >
                <TrashBox />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div
          onMouseEnter={handleFloatingSidebar}
          onMouseLeave={() => {
            console.log('leave area')
            sidebarFloatingActionAreaActiveRef.current = false
          }}
          ref={sidebarFloatingActionAreaRef}
          className="hidden lg:block fixed top-0 left-0 h-[100vh] w-[70px] -z-[1]"
        ></div>
      </aside>

      <div
        ref={navbarRef}
        className={cn(
          'absolute top-0 z-[100] left-56 w-[calc(100%-224px)] flex items-center',
          isResetting && 'transition-all duration-300 ease-linear',
          isMobile && 'w-full left-0',
        )}
      >
        <div className="bg-transparent w-full">
          {params.id ? (
            <Navbar isCollapsed={isCollapsed} onResetWidth={resetSidebar} />
          ) : (
            isCollapsed && (
              <nav className="py-2">
                <button
                  role="button"
                  className="group/open relative overflow-hidden h-6 w-6 ml-2"
                  onClick={resetSidebar}
                >
                  <MenuIcon
                    className={cn(
                      'h-6 w-6 absolute top-0 left-0 group-hover/open:opacity-0 transition-opacity duration-300',
                      floating && 'opacity-0',
                    )}
                    strokeWidth={1.5}
                  />
                  <ChevronsRight
                    className={cn(
                      'h-6 w-6 opacity-0 absolute top-0 left-0 group-hover/open:opacity-100 transition-opacity duration-300',
                      floating && 'opacity-100',
                    )}
                    strokeWidth={1.5}
                  />
                </button>
              </nav>
            )
          )}
        </div>
      </div>
    </>
  )
}

const HomeIconComponent = () => {
  return <GoHome className="h-5 w-5" />
}