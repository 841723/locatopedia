export function Layout({ children }) {
    return (
        <>
            <Header />
            <main className='flex flex-col max-w-screen-lg mx-auto py-4 text-gray-900'>
                {children}
            </main>
            <Footer />
        </> 
    )   
}

function Header() {
    return (
        <header className='bg-slate-300 p-4'>
            <a href="/">
                <h1 className='text-2xl'>H3 Viewer</h1>
            </a>
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