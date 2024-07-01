import {
  ChevronDown,
  ChevronRight,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Trash,
} from 'lucide-react'
import { Id } from '../../../../convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUser } from '@clerk/clerk-react'
import React from 'react'

interface ItemProps {
  id?: Id<'documents'>
  documentIcon?: string
  active?: boolean
  expanded?: boolean
  isSearch?: boolean
  level?: number
  onExpand?: () => void

  label: string
  onClick: () => void
  icon: LucideIcon | React.FC
}

export const Item = ({
  id,
  documentIcon,
  active,
  isSearch,
  level = 0,
  onExpand,
  expanded,
  label,
  onClick,
  icon: Icon,
}: ItemProps) => {
  const ChevronIcon = expanded ? ChevronDown : ChevronRight
  const create = useMutation(api.myFunctions.create)
  const archive = useMutation(api.myFunctions.archive)
  const router = useRouter()
  const user = useUser()

  const handleExpand = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.stopPropagation()
    onExpand?.()
  }

  const onCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!id) return

    event.stopPropagation()
    const promise = create({
      title: 'Untitled',
      parentDocument: id,
    }).then(newDocumentId => {
      if (!expanded) {
        onExpand?.()
      }

      router.push(`/documents/${newDocumentId}`)
    })

    toast.promise(promise, {
      loading: 'Creating a new note...',
      success: 'Note created!',
      error: 'Failed to create a note',
    })
  }

  const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
    if (!id) return
    const promise = archive({ id }).then(() => router.push('/home'))

    toast.promise(promise, {
      loading: 'Moving to trash...',
      success: 'Note moved to trash!',
      error: 'Failed to archive note.',
    })
  }

  return (
    <div
      onClick={onClick}
      role="button"
      style={{ paddingLeft: level ? `${level * 8 + 8}px` : '8px' }}
      className={cn(
        'group flex items-center cursor-pointer text-[14px] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 mx-1 rounded-sm py-1 px-2 mb-[2px]',
        active && 'bg-neutral-200/70',
      )}
    >
      {id && (
        <div
          onClick={handleExpand}
          className="h-5 w-5 mr-2 flex items-center justify-center shrink-0"
        >
          <ChevronIcon className="h-4 w-4" />
        </div>
      )}
      {documentIcon ? (
        <div>{documentIcon}</div>
      ) : (
        <div className="h-5 w-5 mr-2 flex items-center justify-center shrink-0">
          <Icon className="h-[18px] w-[18px] text-neutral-500 dark:text-neutral-300" />
        </div>
      )}
      <span className="whitespace-nowrap text-ellipsis overflow-hidden font-medium text-neutral-500 dark:text-neutral-400">
        {label}
      </span>
      {isSearch && (
        <kbd className="pointer-events-none ml-auto text-neutral-500 text-xs flex items-center border border-neutral-300 rounded-full px-2 bg-neutral-50 py-[2px] gap-x-1 mr-1 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-300">
          <span>⌘</span>
          <span>k</span>
          <span>,</span>
          <span>/</span>
        </kbd>
      )}
      {id && (
        <div className="opacity-0 ml-auto flex items-center gap-x-1 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger onClick={e => e.stopPropagation()} asChild>
              <div className="h-5 w-5 flex items-center justify-center shrink-0 hover:bg-neutral-300/70 rounded-md dark:hover:bg-neutral-700">
                <MoreHorizontal className="h-4 w-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-60"
              align="start"
              side="right"
              forceMount
            >
              <DropdownMenuItem onClick={onArchive}>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="text-xs text-muted-foreground p-2">
                Last edited by: {user?.user?.fullName}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            onClick={onCreate}
            className="h-5 w-5 flex items-center justify-center shrink-0 hover:bg-neutral-300/70 dark:hover:bg-neutral-700 rounded-md"
          >
            <Plus className="h-4 w-4" />
          </div>
        </div>
      )}
    </div>
  )
}

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{
        paddingLeft: level ? `${level * 12 + 25}px` : '12px',
      }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  )
}
