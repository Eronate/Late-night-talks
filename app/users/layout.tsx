import DesktopSidebar from "@/components/DesktopSidebar";
import MobileFooter from "@/components/MobileFooter";

export default async function Layout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className="w-full h-full overflow-visible flex">
            <DesktopSidebar/>
            <MobileFooter/>
            {children}
        </div>
    )
}
