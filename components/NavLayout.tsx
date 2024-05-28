import clsx from 'clsx'
import DesktopSidebar from './DesktopSidebar'
import MobileFooter from './MobileFooter'

export default function NavLayout({
  children,
  isMobileConversationsPage = false,
}: {
  children: React.ReactNode
  isMobileConversationsPage?: boolean
}) {
  return (
    <div className="w-full h-full overflow-visible flex">
      <DesktopSidebar />
      {!isMobileConversationsPage && <MobileFooter />}
      {children}
    </div>
  )
}
