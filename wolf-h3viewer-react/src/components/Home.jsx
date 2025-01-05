import { useFetch } from "@/hooks/useFetch";
import { ArticleCard } from "@/components/ArticleCard";

import { BACKEND_API_URL } from "@/lib/env";

export function Home() {
    const { data: data1 } = useFetch(
        `${BACKEND_API_URL}/api/wiki/popular?limit=3`
    );
    const { data: data2 } = useFetch(
        `${BACKEND_API_URL}/api/wiki/popular?limit=3`
    );
    const { data: data3 } = useFetch(
        `${BACKEND_API_URL}/api/wiki/popular?limit=3`
    );

    return (
        <>
            <a
                href='/wiki/new'
                className='w-fit bg-[var(--color-button)] text-white px-4 py-2 rounded-md hover:bg-[var(--color-button-hover)] self-end transition-colors'
            >
                Create new article
            </a>
            <div className='flex flex-col gap-20 mt-10'>
                <section className='bg-zinc-100 rounded p-2'>
                    <h1 className='text-4xl font-bold mb-2'>Popular</h1>
                    <ul className='grid grid-cols-3 gap-5'>
                        {data1?.length === 0 ? (
                            <li>
                                <h2 className='text-2xl font-medium'>
                                    No popular articles yet
                                </h2>
                            </li>
                        ) : (
                            data1?.map((item) => (
                                <li key={item.hash}>
                                    <ArticleCard item={item} />
                                </li>
                            ))
                        )}
                    </ul>
                </section>

                <section className='bg-zinc-100 rounded p-2'>
                    <h1 className='text-4xl font-bold mb-2'>Close to you</h1>
                    <ul className='grid grid-cols-3 gap-5'>
                        {data2?.length === 0 ? (
                            <li>
                                <h2 className='text-2xl font-medium'>
                                    No popular articles yet
                                </h2>
                            </li>
                        ) : (
                            data2?.map((item) => (
                                <li key={item.hash}>
                                    <ArticleCard item={item} />
                                </li>
                            ))
                        )}
                    </ul>
                </section>

                <section className='bg-zinc-100 rounded p-2'>
                    <h1 className='text-4xl font-bold mb-2'>
                        Article of the day
                    </h1>
                    <ul className='grid grid-cols-1 gap-5 mx-[10%]'>
                        {data3 && data3.length>0 && <ArticleCard item={data3[0]} />}
                    </ul>
                </section>
            </div>
        </>
    );
}
