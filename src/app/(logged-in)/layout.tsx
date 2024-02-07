import Breadcrumbs from '../_components/client-side/Breadcrumbs';
import TopNavBar from '../_components/TopNavBar';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <TopNavBar />
            <Breadcrumbs />
            <main className="relative box-border h-auto w-full flex-grow p-4">
                {children}
            </main>
        </>
    );
}
