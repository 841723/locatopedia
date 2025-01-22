import { LogIn } from "@/components/LogIn";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { use } from "react";
import { AccountContext } from "@/context/Account";

import { ArticleList } from "@/components/ArticleList";


export function Account() {
    const [openLogin, setOpenLogin] = useState(true);

    const { login, logout, getData, isLoggedIn } = use(AccountContext);
    const credential = getData();
    const isLogged = isLoggedIn();
    const navigate = useNavigate();

    const loggedIn = (res) => {
        login(res);
    };

    const loggedOut = () => {
        logout();
        navigate("/");
    };

    useEffect(() => {
        setOpenLogin(!isLogged);
    }, [credential]);

    document.body.style.overflow = !openLogin ? "auto" : "hidden";

    return (
        <main id='main' className='w-full'>
            {openLogin ? (
                <>
                    <LogIn loggedIn={loggedIn} />
                    <div className='h-screen'></div>
                </>
            ) : (
                <>
                    <div className='flex flex-col md:flex-row gap-4 w-full justify-between items-center'>
                        <h1 className='text-xl md:text-5xl max-w-full font-bold'>
                            {credential ? credential.email : "Your email"}
                        </h1>
                        {credential && (
                            <div className='flex gap-5 flex-row-reverse'>
                                <button
                                    id='getImage'
                                    onClick={loggedOut}
                                    className='w-fit bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600'
                                >
                                    Log Out
                                </button>
                                {credential && (
                                    <a
                                        href='/wiki/new'
                                        className='w-fit bg-[var(--color-button)] text-white px-4 py-2 rounded-md hover:bg-[var(--color-button-hover)] self-end transition-colors'
                                    >
                                        Create new article
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    <div className='flex flex-col gap-20 mt-10'>
                        <ArticleList
                            title='Liked by you'
                            query={"/api/wiki/auth/liked"}
                        />

                        <ArticleList
                            title='Created by you'
                            query={"/api/wiki/auth/created"}
                        />

                        <ArticleList
                            title='Edited by you'
                            query={"/api/wiki/auth/edited"}
                        />

                        {/* <ArticleList
                            title='Close to you'
                            query='/api/wiki/popular?limit=4'
                        /> */}
                    </div>
                </>
            )}
        </main>
    );
}
