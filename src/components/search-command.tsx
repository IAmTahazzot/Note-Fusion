'use client'

import { useUser } from '@clerk/clerk-react'
import { useQuery } from 'convex/react'
import { useRouter } from 'next/navigation'
import { api } from '../../convex/_generated/api'
import { useSearch } from '@/hooks/use-search'
import { useEffect, useState } from 'react'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command'
import { File } from 'lucide-react'

export const SearchCommand = () => {
  const { user } = useUser()
  const router = useRouter()
  const documents = useQuery(api.myFunctions.getSearch)
  const [isMounted, setIsMounted] = useState<boolean>(false)

  const toggle = useSearch(store => store.toggle)
  const isOpen = useSearch(store => store.isOpen)
  const onClose = useSearch(store => store.onClose)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        (e.key === 'k' && (e.metaKey || e.ctrlKey)) ||
        (e.key === '/' && (e.metaKey || e.ctrlKey))
      ) {
        e.preventDefault()
        toggle()
      }
    }

    window.addEventListener('keydown', down)
    return () => {
      window.removeEventListener('keydown', down)
    }
  }, [toggle])

  if (!isMounted) return null

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput
        placeholder={`Search ${user?.fullName}'s notes & documents`}
      />

      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Documents">
          {documents?.map(document => {
            return (
              <CommandItem
                key={document._id}
                title={document.title}
                value={`${document.title}`}
                onSelect={() => {
                  router.push(`/documents/${document._id}`)
                  onClose()
                }}
              >
                {document.icon ? (
                  <p className="mr-2 text-[18px]"> {document.icon} </p>
                ) : (
                  <File className="mr-2 h-4 w-4" />
                )}
                <span>{document.title}</span>
              </CommandItem>
            )
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
