import Breadcrumbs from '../_components/client-side/Breadcrumbs';
import Sidebar from '../_components/Sidebar/Sidebar';
import TopNavBar from '../_components/TopNavBar';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <TopNavBar />
            <div className="flex h-full flex-row">
                <Sidebar />
                <div className="flex flex-grow flex-col">
                    <Breadcrumbs />
                    <main className="relative box-border h-auto w-full flex-grow p-4">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}
