import { jwtDecode } from "jwt-decode";
import { LogIn } from "@/components/LogIn";
import { useCookie } from "@/lib/useCookie";
import { useFetch } from "@/hooks/useFetch";
import { ArticleCard } from "@/components/ArticleCard";
import { useNavigate } from "react-router-dom";

export function Account() {
    const [credentialCookie, credentialUpdateCookie, credentialDeleteCookie] =
        useCookie("credential");
    const credential = credentialCookie ? jwtDecode(credentialCookie) : null;
    const navigate = useNavigate();

    const loggedIn = (res) => {
        credentialUpdateCookie(res.credential, { expires: 1 });
    };

    const loggedOut = () => {
        navigate("/");
        credentialDeleteCookie();
    };

    const { data } = useFetch("http://localhost:3000/api/wiki/popular?limit=4");

    return (
        <main className='w-full'>
            {!credentialCookie && <LogIn loggedIn={loggedIn} />}
            <div className='flex w-full justify-between items-center'>
                <h1 className='text-5xl font-bold'>
                    {credential ? credential.email : "Your email"}
                </h1>
                {credential && (
                    <button
                        onClick={loggedOut}
                        className='w-fit bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 self-end'
                    >
                        Log Out
                    </button>
                )}
            </div>

            <div className='flex flex-col gap-20 mt-10'>
                <section className='bg-zinc-100 rounded p-2'>
                    <h1 className='text-4xl font-bold mb-2'>Own articles</h1>
                    <ul className='grid grid-cols-3 gap-5'>
                        {data?.map((item) => (
                            // WARNING: this should be item.id
                            <li key={crypto.randomUUID()}>
                                <ArticleCard item={item} />
                            </li>
                        ))}
                    </ul>
                </section>

                <section className='bg-zinc-100 rounded p-2'>
                    <h1 className='text-4xl font-bold mb-2'>Edited by you</h1>
                    <ul className='grid grid-cols-3 gap-5'>
                        {data?.map((item) => (
                            // WARNING: this should be item.id
                            <li key={crypto.randomUUID()}>
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
                            // WARNING: this should be item.id
                            <li key={crypto.randomUUID()}>
                                <ArticleCard item={item} />
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </main>
    );
}
