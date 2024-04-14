export default function Avatar({ img }: { img: string | null | undefined }) {
  return (
    <div className="flex">
      <div className="w-max relative h-max shadow-xl rounded-full">
        <img src={img || '/gengar.jpg'} className="w-10 h-10 rounded-full" />
        <div className="absolute top-0 right-0 w-2 h-2 bg-green-400 ring-navycustom ring-4 z-50 rounded-full" />
      </div>
    </div>
  )
}
