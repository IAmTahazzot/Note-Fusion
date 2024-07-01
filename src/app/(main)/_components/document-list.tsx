'use client'

import { useParams, useRouter } from 'next/navigation'
import { Doc, Id } from '../../../../convex/_generated/dataModel'
import { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Item } from './item'
import { cn } from '@/lib/utils'
import { FileIcon } from 'lucide-react'

interface DocumentListProps {
  parentDocumentId?: Id<'documents'>
  level?: number
  data?: Doc<'documents'>[]
}

export const DocumentList = ({
  parentDocumentId,
  level = 0,
  data = [],
}: DocumentListProps) => {
  const params = useParams()
  const router = useRouter()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const onExpand = (id: string) => {
    setExpanded({
      ...expanded,
      [id]: !expanded[id],
    })
  }

  const documents = useQuery(api.myFunctions.getSidebar, {
    parentDocument: parentDocumentId,
  })

  const onRedirect = (id: Id<'documents'>) => {
    router.push(`/documents/${id}`)
  }

  if (!documents) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={0} />
            <Item.Skeleton level={0} />
          </>
        )}
      </>
    )
  }

  return (
    <>
      <p
        style={{
          paddingLeft: level ? `${level * 8 + 8}px` : '8px',
        }}
        className={cn(
          'hidden text-sm font-medium text-neutral-600',
          expanded && 'last:block',
          level === 0 && 'hidden mx-2',
        )}
      >
        No pages inside
      </p>
      {documents.map(document => (
        <div key={document._id}>
          <Item
            id={document._id}
            label={document.title}
            icon={FileIcon}
            documentIcon={document.icon}
            onClick={() => onRedirect(document._id)}
            active={params.documentId === document._id}
            level={level}
            onExpand={() => onExpand(document._id)}
            expanded={expanded[document._id]}
          />
          {expanded[document._id] && (
            <DocumentList parentDocumentId={document._id} level={level + 1} />
          )}
        </div>
      ))}
    </>
  )
}
