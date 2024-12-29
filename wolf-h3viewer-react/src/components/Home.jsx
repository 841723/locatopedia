import { useFetch } from "@/hooks/useFetch";
import { ArticleCard } from "@/components/ArticleCard";

export function Home() {
    const { data: data1 } = useFetch(
        "http://localhost:3000/api/wiki/popular?limit=3"
    );
    const { data: data2 } = useFetch(
        "http://localhost:3000/api/wiki/popular?limit=3"
    );
    const { data: data3 } = useFetch(
        "http://localhost:3000/api/wiki/popular?limit=1"
    );

    return (
        <>
            <a
                href='/wiki/new'
                className='w-fit bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 self-end'
            >
                Create new article
            </a>
            <div className='flex flex-col gap-20 mt-10'>
                <section className='bg-zinc-100 rounded p-2'>
                    <h1 className='text-4xl font-bold mb-2'>Popular</h1>
                    <ul className='grid grid-cols-3 gap-5'>
                        {data1?.map((item) => (
                            // WARNING: this should be item.id
                            <li key={crypto.randomUUID()}>
                                <ArticleCard item={item} />
                            </li>
                        ))}
                    </ul>
                </section>

                <section className='bg-zinc-100 rounded p-2'>
                    <h1 className='text-4xl font-bold mb-2'>Close to you</h1>
                    <ul className='grid grid-cols-3 gap-5'>
                        {data2?.map((item) => (
                            // WARNING: this should be item.id
                            <li key={crypto.randomUUID()}>
                                <ArticleCard item={item} />
                            </li>
                        ))}
                    </ul>
                </section>

                <section className='bg-zinc-100 rounded p-2'>
                    <h1 className='text-4xl font-bold mb-2'>
                        Article of the day
                    </h1>
                    <ul className='grid grid-cols-1 gap-5 mx-[10%]'>
                        {data3 && <ArticleCard item={data3[0]} />}
                    </ul>
                </section>
            </div>
        </>
    );
}
