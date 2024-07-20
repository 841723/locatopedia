export function Layout({ children }) {
    return (
        <>
            <Header />
            <main className='flex flex-col max-w-screen-xl mx-auto py-4 text-gray-900'>
                {children}
            </main>
            <Footer />
        </> 
    )   
}

function Header() {
    return (
        <header className='bg-slate-300 p-4'>
            <h1 className='text-2xl'>H3 Viewer</h1>
        </header>
    )
}

function Footer() {
    return (
        <footer className='bg-slate-300 p-4'>
            <p>Footer</p>
        </footer>
    )
}