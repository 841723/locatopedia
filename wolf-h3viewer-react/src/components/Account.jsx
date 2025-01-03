import { LogIn } from "@/components/LogIn";
import { useFetch } from "@/hooks/useFetch";
import { ArticleCard } from "@/components/ArticleCard";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { use } from "react";
import { AccountContext } from "@/context/Account";
import { TopInfoDisplayContext } from "@/context/TopInfoDisplay";

export function Account() {
    const [openLogin, setOpenLogin] = useState(true);

    const { setState } = use(TopInfoDisplayContext);

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

    const { data } = useFetch("http://localhost:3000/api/wiki/popular?limit=4");
    document.body.style.overflow = !openLogin ? "auto" : "hidden";

    return (
        <main className='w-full'>
            {openLogin ? (
                <>
                    <LogIn loggedIn={loggedIn} />
                    <div className='h-screen'></div>
                </>
            ) : (
                <>
                    <div className='flex w-full justify-between items-center'>
                        <h1 className='text-5xl font-bold'>
                            {credential ? credential.email : "Your email"}
                        </h1>
                        {credential && (
                            <div className='flex gap-5 flex-row-reverse'>
                                <button
                                    onClick={loggedOut}
                                    className='w-fit bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600'
                                >
                                    Log Out
                                </button>
                                <button
                                    className='w-fit bg-[var(--color-button)] text-white px-4 py-2 rounded-md hover:bg-[var(--color-button-hover)]'
                                    onClick={() => {
                                        setState((prev) => (prev+1)%3);
                                    }}
                                >
                                    Change use
                                </button>
                            </div>
                        )}
                    </div>

                    <div className='flex flex-col gap-20 mt-10'>
                        <section className='bg-zinc-100 rounded p-2'>
                            <h1 className='text-4xl font-bold mb-2'>
                                Own articles
                            </h1>
                            <ul className='grid grid-cols-3 gap-5'>
                                {data?.map((item) => (
                                    <li key={item.hash}>
                                        <ArticleCard item={item} />
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className='bg-zinc-100 rounded p-2'>
                            <h1 className='text-4xl font-bold mb-2'>
                                Edited by you
                            </h1>
                            <ul className='grid grid-cols-3 gap-5'>
                                {data?.map((item) => (
                                    <li key={item.hash}>
                                        <ArticleCard item={item} />
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className='bg-zinc-100 rounded p-2'>
                            <h1 className='text-4xl font-bold mb-2'>
                                Discussions you are in
                            </h1>
                            <ul className='grid grid-cols-3 gap-5'>
                                {data?.map((item) => (
                                    <li key={item.hash}>
                                        <ArticleCard item={item} />
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>
                </>
            )}
        </main>
    );
}
