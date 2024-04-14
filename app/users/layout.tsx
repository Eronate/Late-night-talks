import DesktopSidebar from '@/components/DesktopSidebar'
import MobileFooter from '@/components/MobileFooter'
import NavLayout from '@/components/NavLayout'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <NavLayout>{children}</NavLayout>
}
