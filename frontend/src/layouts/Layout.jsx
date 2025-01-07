import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useEffect } from 'react';
import { TopInfoDisplay } from '@/components/TopInfoDisplay';

export function Layout({ children, documentTitle }) {
    useEffect(() => {
        document.title = documentTitle ? `${documentTitle} | Locatopedia` : 'Locatopedia';
    }, [documentTitle]);

    return (
        <>
            <h1 className='absolute opacity-0 select-none transform -translate-x-full'>
                Locatopedia
            </h1>
            <Header />
            <TopInfoDisplay />

            <main className='flex flex-col max-w-screen-lg mx-auto py-4 text-gray-900 bg-white px-4 md:px-0 min-h-[calc(100dvh-80px-184px)] md:min-h-[calc(100dvh-96px-184px)]'>
                {children}
            </main>
            <Footer />
        </>
    );
}
