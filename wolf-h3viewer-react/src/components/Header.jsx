import { UserIcon } from "@/components/basic/icons/UserIcon.jsx";
import { useCookie } from "@/lib/useCookie";
import { jwtDecode } from "jwt-decode";
import { AppIcon } from "@/components/basic/icons/AppIcon";

export function Header() {

    const [credential] = useCookie("credential");
    const profile = credential ? jwtDecode(credential) : null;

    return (
        <header className='bg-slate-300 p-4 px-32 flex justify-between items-center'>
            <a href='/' className="flex items-center gap-4">
                <AppIcon className='size-20' />
                <h1 className='text-3xl font-medium tracking-wide'>Locatopedia</h1>
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
                        <p>Log In</p>
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


