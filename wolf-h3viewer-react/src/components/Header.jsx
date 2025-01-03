import { UserIcon } from "@/components/basic/icons/UserIcon.jsx";
import { AppIcon } from "@/components/basic/icons/AppIcon";
import { AccountContext } from "@/context/Account";
import { use } from "react";

export function Header() {

    const { getData } = use(AccountContext);
    const profile = getData();

    return (
        <header className='fixed z-[3000] w-full bg-[var(--color-primary)] p-4 px-32 flex justify-between items-center h-32'>
            <a href='/' className='flex items-center gap-4'>
                <AppIcon className='' />
            </a>
            <a
                href='/account'
                className='flex justify-end gap-3 items-center hover:bg-slate-200 px-2 py-1 rounded-full'
            >
                {profile ? (
                    <>
                        <p>{profile.email}</p>
                        <img
                            src={profile.picture}
                            alt='User profile picture'
                            className='size-10 rounded-full min-w-10'
                            referrerPolicy='no-referrer'
                        />
                    </>
                ) : (
                    <>
                        <p>Sign Up / Sign In</p>
                        <UserIcon
                            className={
                                "w-9 rounded-full transition-colors min-w-10 min-h-10"
                            }
                        />
                    </>
                )}
            </a>
        </header>
    );
}


