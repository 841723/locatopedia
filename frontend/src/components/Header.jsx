import { UserIcon } from "@/components/basic/icons/UserIcon.jsx";
import { AppIcon } from "@/components/basic/icons/AppIcon";
import { AccountContext } from "@/context/Account";
import { use } from "react";

export function Header() {

    const { getData } = use(AccountContext);
    const profile = getData();

    return (
        <>
            <header className='fixed z-[3000] w-full bg-[var(--color-primary)] py-4 md:px-32 flex justify-around md:justify-between items-center h-20 md:h-24'>
                <a href='/' className='flex items-center gap-4'>
                    <AppIcon className='w-72 md:w-80' />
                </a>
                <a
                    href='/account'
                    className='flex justify-end gap-3 items-center hover:bg-slate-200 p-2 md:px-2 md:py-1 rounded-full'
                >
                    {profile ? (
                        <>
                            <p className='hidden md:block'>{profile.email}</p>
                            <img
                                src={profile.picture}
                                alt='User profile picture'
                                className='size-10 rounded-full min-w-10'
                                referrerPolicy='no-referrer'
                            />
                        </>
                    ) : (
                        <>
                            <p className='hidden md:block'>Sign Up / Sign In</p>
                            <UserIcon
                                className={
                                    "w-9 rounded-full transition-colors min-w-10 min-h-10"
                                }
                            />
                        </>
                    )}
                </a>
            </header>
            <div className='h-20 md:h-24 w-full' />
        </>
    );
}


