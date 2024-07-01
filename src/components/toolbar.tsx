'use client'

import { ElementRef, useEffect, useRef, useState } from 'react'
import { ImageIcon, Smile, X } from 'lucide-react'
import { useMutation } from 'convex/react'
import TextareaAutosize from 'react-textarea-autosize'

import { useCoverImage } from '@/hooks/use-cover-image'
import { Button } from '@/components/ui/button'

import { IconPicker } from './icon-picker'
import { Doc } from '../../convex/_generated/dataModel'
import { api } from '../../convex/_generated/api'

interface ToolbarProps {
  initialData: Doc<'documents'>
  preview?: boolean
}

export const Toolbar = ({ initialData, preview }: ToolbarProps) => {
  const inputRef = useRef<ElementRef<'textarea'>>(null)
  const [value, setValue] = useState(initialData.title)

  const update = useMutation(api.myFunctions.update)
  const removeIcon = useMutation(api.myFunctions.removeIcon)

  const coverImage = useCoverImage()

  useEffect(() => {
    if (inputRef.current) {
      //inputRef.current.setSelectionRange(0, inputRef.current.value.length)
      // focus
      inputRef.current.focus()
    }
  }, [inputRef.current])

  const onInput = (value: string) => {
    setValue(value)
    update({
      id: initialData._id,
      title: value || 'Untitled',
    })
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
    }
  }

  const onIconSelect = (icon: string) => {
    update({
      id: initialData._id,
      icon,
    })
  }

  const onRemoveIcon = () => {
    removeIcon({
      id: initialData._id,
    })
  }

  return (
    <div className="pl-[54px] group relative">
      {!!initialData.icon && !preview && (
        <div className="flex items-center gap-x-2 group/icon pt-6">
          <IconPicker onChange={onIconSelect}>
            <p className="text-6xl hover:opacity-75 transition">
              {initialData.icon}
            </p>
          </IconPicker>
          <Button
            onClick={onRemoveIcon}
            className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
            variant="outline"
            size="icon"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {!!initialData.icon && preview && (
        <p className="text-6xl pt-6">{initialData.icon}</p>
      )}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!initialData.icon && !preview && (
          <IconPicker asChild onChange={onIconSelect}>
            <Button
              className="text-muted-foreground text-xs"
              variant="outline"
              size="sm"
            >
              <Smile className="h-4 w-4 mr-2" />
              Add icon
            </Button>
          </IconPicker>
        )}
        {!initialData.coverImage && !preview && (
          <Button
            onClick={coverImage.onOpen}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Add cover
          </Button>
        )}
      </div>

      {!preview && (
        <TextareaAutosize
          ref={inputRef}
          onKeyDown={onKeyDown}
          value={value}
          onChange={e => onInput(e.target.value)}
          autoFocus={true}
          placeholder="Untitled"
          defaultValue={''}
          className="text-4xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none dark:placeholder:text-neutral-500 placeholder:text-neutral-200 w-[90%]"
        />
      )}

      {preview && (
        <h1 className="text-4xl font-bold text-[#3f3f3f] dark:text-[#cfcfcf] w-[90%]">
          {initialData.title}
        </h1>
      )}
    </div>
  )
}
