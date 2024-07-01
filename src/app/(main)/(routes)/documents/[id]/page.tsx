'use client'

import { useMutation, useQuery } from 'convex/react'
import { Id } from '../../../../../../convex/_generated/dataModel'
import { api } from '../../../../../../convex/_generated/api'
import { Toolbar } from '@/components/toolbar'
import { Cover } from '@/components/cover'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { useMemo } from 'react'
import dynamic from 'next/dynamic'

interface DocumentPageProps {
  params: {
    id: Id<'documents'>
  }
}

const DocumentPage = ({ params }: DocumentPageProps) => {
  const Editor = useMemo(
    () => dynamic(() => import('@/components/editor'), { ssr: false }),
    [],
  )

  const document = useQuery(api.myFunctions.getById, {
    documentId: params.id,
  })

  const update = useMutation(api.myFunctions.update)

  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="space-y-4 md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <Skeleton className="h-14 w-[50%]" />
          <Skeleton className="h-4 w-[80%]" />
          <Skeleton className="h-4 w-[40%]" />
          <Skeleton className="h-4 w-[60%]" />
        </div>
      </div>
    )
  }

  if (document === null) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <p className="text-base">This document does not exist.</p>
          <Button variant="default" className="mt-4">
            <Link href="/home">Go home</Link>
          </Button>
        </div>
      </div>
    )
  }

  const onChange = (content: string) => {
    update({
      id: params.id,
      content,
    })
  }

  return (
    <div className="pb-40 pt-10">
      <Cover url={document.coverImage} />

      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initialData={document} />
        <Editor onChange={onChange} initialContent={document.content} />
      </div>
    </div>
  )
}

export default DocumentPage
