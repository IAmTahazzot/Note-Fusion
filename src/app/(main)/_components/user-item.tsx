'use client'

import { useUser } from '@clerk/clerk-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ChevronsLeft, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { SignOutButton } from '@clerk/clerk-react'

export const UserItem = ({
  collapse,
  isMobile,
  isFloating,
}: {
  collapse: () => void
  isMobile: boolean
  isFloating: boolean
}) => {
  const { user } = useUser()

  return (
    <DropdownMenu>
      <button className="flex items-center justify-between flex-1 outline-0">
        <DropdownMenuTrigger asChild>
          <div className="flex items-center max-w-[150px]">
            <div>
              {user && (
                <div className="h-5 w-5 mr-2 flex items-center justify-center rounded-full overflow-hidden">
                  <Image
                    height={19}
                    width={19}
                    src={user?.imageUrl}
                    alt={user?.fullName || ''}
                    className="max-w-[19px] max-h-[19px] rounded-full"
                  />
                </div>
              )}
            </div>
            <span className="text-[14px] whitespace-nowrap leading-[1] text-neutral-600 dark:text-neutral-400   font-medium">
              {user?.fullName}
            </span>
            <ChevronsUpDown
              className="ml-1 h-4 w-4 text-[#37352f73] dark:text-neutral-400"
              strokeWidth={2}
            />
          </div>
        </DropdownMenuTrigger>
        {!isFloating && (
          <div
            role="button"
            onClick={collapse}
            className={cn(
              'h-7 w-7 rounded-full text-[#37352f73] hover:bg-neutral-300/70 dark:text-neutral-400 dark:hover:bg-neutral-700 opacity-0 group-hover/sidebar:opacity-100 transition-opacity flex items-center justify-center',
              isMobile && 'opacity-100',
            )}
          >
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ChevronsLeft className="h-6 w-6" strokeWidth={1.5} />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Stash Sidebar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </button>
      <DropdownMenuContent
        className="ml-2 border-0 p-0 mt-2 dark:bg-neutral-800"
        style={{
          boxShadow:
            'rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px',
        }}
      >
        <div className="w-[300px]">
          <span className="text-[12px] text-zinc-600 dark:text-neutral-400 p-3 block">
            {user?.emailAddresses[0].emailAddress}
          </span>
          <div className="flex items-center hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-sm my-[6px] px-1 mx-1 py-1 gap-x-3">
            {user?.imageUrl && (
              <Image
                width={70}
                height={70}
                src={user?.imageUrl}
                alt={user?.fullName || ''}
                className="h-10 w-10 rounded-full"
              />
            )}

            <div className="text-[14px] flex flex-col">
              <h3>{user?.fullName || ''}</h3>
              <p className="text-[12px] text-zinc-500 dark:text-neutral-400">
                You're on the brokie plan
              </p>
            </div>
          </div>

          <div className="bg-zinc-100 dark:bg-neutral-800 py-1 border-t border-zinc-200 dark:border-neutral-600">
            <div className="py-1 mx-1 hover:bg-zinc-200/50 rounded-sm px-2 dark:hover:bg-neutral-700">
              <SignOutButton>
                <span className="text-[12px] text-zinc-600 dark:text-neutral-400 block cursor-pointer">
                  Log out
                </span>
              </SignOutButton>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
