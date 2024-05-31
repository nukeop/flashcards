import Breadcrumbs from '../_components/client-side/Breadcrumbs';
import Sidebar from '../_components/Sidebar/Sidebar';
import TopNavBar from '../_components/TopNavBar';
import Vignette from '../_components/Vignette';

export default function Layout({
    dialog,
    children,
}: {
    dialog: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <>
            <TopNavBar />
            <div className="relative flex flex-row overflow-auto">
                <Vignette />
                <Sidebar />
                <div className="flex flex-grow flex-col">
                    <Breadcrumbs />
                    <main className="relative box-border h-full w-full flex-grow overflow-auto px-4">
                        {children}
                        {dialog}
                    </main>
                </div>
            </div>
        </>
    );
}
