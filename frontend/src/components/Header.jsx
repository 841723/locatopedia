import { UserIcon } from "@/components/basic/icons/UserIcon.jsx";
import { AppIcon } from "@/components/basic/icons/AppIcon";
import { AccountContext } from "@/context/Account";
import { use } from "react";
import { SearchBar } from "@/components/SearchBar";

export function Header() {
    const { getData } = use(AccountContext);
    const profile = getData();

    return (
        <>
            <header className='fixed z-[3000] w-full bg-[var(--color-primary)] py-4 md:px-32 h-40 xl:h-24 flex flex-col justify-center'>
                <aside className='w-full flex justify-around md:justify-between items-center'>
                    <a href='/' className='flex items-center gap-4'>
                        <AppIcon className='w-72 md:w-80' />
                    </a>
                    <div className='hidden xl:flex flex-grow xl:justify-center xl:items-center h-full mx-20'>
                        <SearchBar />
                    </div>
                    <a
                        href='/account'
                        className='flex justify-end gap-3 items-center hover:bg-slate-200 p-2 md:px-2 md:py-1 rounded-full min-w-fit'
                    >
                        {profile ? (
                            <>
                                <p className='hidden md:block'>
                                    {profile.email}
                                </p>
                                <img
                                    src={profile.picture}
                                    alt='User profile picture'
                                    className='size-10 rounded-full min-w-10'
                                    referrerPolicy='no-referrer'
                                />
                            </>
                        ) : (
                            <>
                                <p className='hidden md:block'>
                                    Sign Up / Sign In
                                </p>
                                <UserIcon
                                    className={
                                        "w-9 rounded-full transition-colors min-w-10 min-h-10"
                                    }
                                />
                            </>
                        )}
                    </a>
                </aside>
                <aside className='block xl:hidden flex-grow items-center h-full my-1 w-4/5 mx-auto'>
                    <SearchBar />
                </aside>
            </header>
            <div className='h-40 xl:h-24 w-full' />
        </>
    );
}
