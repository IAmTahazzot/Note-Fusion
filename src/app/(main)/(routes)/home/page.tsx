'use client'

import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import { PlusCircle } from 'lucide-react'
import Image from 'next/image'
import { GoClock } from 'react-icons/go'
import { useUser } from '@clerk/clerk-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const Home = () => {
  const documents = useQuery(api.myFunctions.getSidebar, {})
  const create = useMutation(api.myFunctions.create)
  const { user, isLoaded } = useUser()
  const router = useRouter()

  if (!isLoaded) return null

  if (!user) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center space-y-4">
        <Image
          src="/img/empty.png"
          height="300"
          width="300"
          alt="Empty"
          className="dark:hidden"
        />
        <Image
          src="/img/empty-dark.png"
          height="300"
          width="300"
          alt="Empty"
          className="hidden dark:block"
        />
        <h2 className="text-lg font-medium">
          Unauthorized access. Please sign in to continue.
        </h2>
        <Button onClick={() => router.push('/sign-in')}>Sign in</Button>
      </div>
    )
  }

  const onCreate = async () => {
    const promise = create({ title: 'Untitled' })

    toast.promise(promise, {
      loading: 'Creating a note...',
      success: 'New note created',
      error: 'Failed to create note',
    })

    await promise.then((id: string) => {
      router.push(`/documents/${id}`)
    })
  }

  if (!documents) {
    return (
      <div className="h-full space-y-14 py-10">
        <h1 className="text-center text-3xl font-semibold">Good morning</h1>
        <main className="w-[80%] max-w-[1024px] mx-auto">
          <div>
            <h3 className="p-3 text-xs text-muted-foreground flex items-center gap-1">
              <GoClock size={14} />
              <span>Recent notes</span>
            </h3>
          </div>
          <div className="flex items-center gap-4 animate-pulse">
            <div className="h-36 w-36 rounded-xl bg-neutral-50 dark:bg-[#242424]">
              <div className="relative h-11 w-full">
                <div className="absolute top-0 left-0 h-full w-full rounded-t-xl bg-neutral-200/40 dark:bg-[#2b2b2b]"></div>
              </div>
            </div>
            <div className="h-36 w-36 rounded-xl bg-neutral-50 dark:bg-[#242424]">
              <div className="relative h-11 w-full">
                <div className="absolute top-0 left-0 h-full w-full rounded-t-xl bg-neutral-200/40 dark:bg-[#2b2b2b]"></div>
              </div>
            </div>

            <div className="h-36 w-36 rounded-xl bg-neutral-50 dark:bg-[#242424]">
              <div className="relative h-11 w-full">
                <div className="absolute top-0 left-0 h-full w-full rounded-t-xl bg-neutral-200/40 dark:bg-[#2b2b2b]"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <Image
          src="/img/empty.png"
          height="300"
          width="300"
          alt="Empty"
          className="dark:hidden"
        />
        <Image
          src="/img/empty-dark.png"
          height="300"
          width="300"
          alt="Empty"
          className="hidden dark:block"
        />
        <h2 className="text-lg font-medium">
          Welcome to {user.firstName}&apos;s Notes
        </h2>
        <Button onClick={onCreate}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create a note
        </Button>
      </div>
    )
  }

  return (
    <div className="h-full space-y-14 py-16">
      <h1 className="text-center text-3xl font-semibold">
        Good morning {user && ', ' + user.firstName}
      </h1>

      <main className="w-[95%] md:w-[85%] max-w-[1024px] mx-auto">
        <div>
          <h3 className="p-3 text-xs text-muted-foreground flex items-center gap-1">
            <GoClock size={14} />
            <span>Recent notes</span>
          </h3>
        </div>
        <div className="flex items-center gap-4 overflow-x-auto">
          {documents.map(doc => (
            <NoteCard
              id={doc._id}
              key={doc.title}
              title={doc.title}
              icon={doc.icon}
              coverImageUrl={doc.coverImage}
              createdAt={doc._creationTime}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

const NoteCard = ({
  id,
  title,
  icon,
  coverImageUrl,
  createdAt,
}: {
  id: string
  title: string
  icon: any
  coverImageUrl: string | null | undefined
  createdAt: number
}) => {
  return (
    <Link href={`/documents/${id}`}>
      <div className="shrink-0 h-36 w-36 rounded-xl border border-neutral-200/50 dark:border-transparent bg:white dark:bg-[#242424]">
        <div className="relative h-11 w-full">
          {coverImageUrl ? (
            <Image
              src={coverImageUrl}
              fill
              className="object-cover rounded-t-xl"
              alt={title}
            />
          ) : (
            <div className="absolute top-0 left-0 h-full w-full rounded-t-xl bg-neutral-200/40 dark:bg-[#2b2b2b]"></div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-sm">
            {title.slice(0, 20) + (title.length > 20 ? '...' : '')}
          </h3>
        </div>
      </div>
    </Link>
  )
}

export default Home
