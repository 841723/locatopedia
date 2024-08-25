import { UserIcon } from "@/components/basic/icons/UserIcon"

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
        <header className='bg-slate-300 p-4 px-32 flex justify-between items-center '>
            <a href="/">
                <h1 className='text-2xl'>H3 Viewer</h1>
            </a>
            <a href="/account">
                <UserIcon className={"w-8 hover:bg-blue-300 rounded-full transition-colors "}/>
            </a>
        </header>
    )
}

function Footer() {
    return (
        <footer className='bg-slate-300 p-4 px-32'>
            <p>Footer</p>
        </footer>
    );
}