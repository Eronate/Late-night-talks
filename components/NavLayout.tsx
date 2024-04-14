import DesktopSidebar from './DesktopSidebar'
import MobileFooter from './MobileFooter'

export default function NavLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full overflow-visible flex">
      <DesktopSidebar />
      <MobileFooter />
      {children}
    </div>
  )
}
