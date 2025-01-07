import { useFetch } from "@/hooks/useFetch";
import { ArticleCard } from "@/components/ArticleCard";

import { BACKEND_API_URL } from "@/lib/env";

export function ArticleList({ title, query, showOnlyOne }) {
    const { data } = useFetch(`${BACKEND_API_URL}${query}`);

    const ulClassName = `grid ${showOnlyOne ? "grid-cols-1 mx-[10%]" : "grid-cols-2 md:grid-cols-3 gap-5 "}`

    return (
        <section className='bg-zinc-100 rounded p-2'>
            <h1 className='text-4xl font-bold mb-2'>{title}</h1>
            <ul className={ulClassName}>
                {data?.length === 0 ? (
                    <li>
                        <h2 className='text-2xl font-medium'>
                            No articles found
                        </h2>
                    </li>
                ) : (
                    data?.map((item) => (
                        <li key={item.hash}>
                            <ArticleCard item={item} />
                        </li>
                    ))
                )}
            </ul>
        </section>
    );
}
