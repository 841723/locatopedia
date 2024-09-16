import { UserIcon } from "@/components/basic/icons/UserIcon.jsx";
import { useCookie } from "@/lib/useCookie";
import { jwtDecode } from "jwt-decode";

export function Header() {

    const [credential] = useCookie("credential");
    const profile = credential ? jwtDecode(credential) : null;

    console.log(profile);

    return (
        <header className='bg-slate-300 p-4 px-32 flex justify-between items-center '>
            <a href='/'>
                <h1 className='text-2xl'>H3 Viewer</h1>
            </a>
            <a
                href='/account'
                className='flex justify-end gap-3 items-center hover:bg-slate-200 px-2 rounded-full'
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


