import { Header } from '@/components/Header';
import { useEffect } from 'react';

export function Layout({ children, documentTitle }) {
    useEffect(() => {
        document.title = documentTitle ? `${documentTitle} | Locatopedia` : 'Locatopedia';
    }, [documentTitle]);

    return (
        <>
            <Header />
            <main className='flex flex-col max-w-screen-lg mx-auto py-4 text-gray-900 bg-white'>
                {children}
            </main>
            <Footer />
        </>
    );
}



function Footer() {
    return (
        <footer className='bg-[var(--color-primary)] p-4 px-32'>
            <p>Footer</p>
        </footer>
    );
}
