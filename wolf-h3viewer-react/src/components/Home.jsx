import { useFetch } from "@/hooks/useFetch";
import { ArticleCard } from "@/components/ArticleCard";

export function Home() {
    const { data } = useFetch("http://localhost:3000/api/wiki/popular?limit=4");

    return (
        <>
            <a
                href='/new'
                className='w-fit bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 self-end'
            >
                Create new article
            </a>
            <div className='flex flex-col gap-20 mt-10'>
                <section className='bg-zinc-100 rounded p-2'>
                    <h1 className='text-4xl font-bold mb-2'>Popular</h1>
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
                    <h1 className='text-4xl font-bold mb-2'>Close to you</h1>
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
                        Article of the day
                    </h1>
                    <ul className='grid grid-cols-1 gap-5 mx-[10%]'>
                        {data && <ArticleCard item={data[0]} />}
                    </ul>
                </section>
            </div>
        </>
    );
}
