import Navigation from '@/app/(landing)/_components/navigation'
import Hero from '@/app/(landing)/_components/hero'
import Image from 'next/image'

export default function Home() {
  return (
    <div>
      <Navigation />
      <div className="h-[90vh] md:h-auto flex items-center justify-center">
        <Hero />
      </div>
      <div className="mt-[10vh]">
        <Image
          src={'/img/cover.png'}
          alt="cover"
          width={900}
          height={1080}
          className="mx-auto dark:hidden"
        />
        <Image
          src={'/img/cover-dark.png'}
          alt="cover"
          width={900}
          height={1080}
          className="mx-auto hidden dark:block"
        />
      </div>
    </div>
  )
}
