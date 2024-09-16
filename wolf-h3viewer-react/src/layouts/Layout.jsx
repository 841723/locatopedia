import { Header } from '@/components/Header';

export function Layout({ children }) {
    return (
        <>
            <Header />
            <main className='flex flex-col max-w-screen-lg mx-auto py-4 text-gray-900'>
                {children}
            </main>
            <Footer />
        </>
    );
}



function Footer() {
    return (
        <footer className='bg-slate-300 p-4 px-32'>
            <p>Footer</p>
        </footer>
    );
}
