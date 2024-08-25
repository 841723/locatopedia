import useFetch from "@/hooks/useFetch";

export function Home() {
    const { data } = useFetch("http://localhost:3000/api/wiki/popular?limit=4");

    return (
        <>
            <h1 className='text-4xl mb-5 font-bold'>Home</h1>
            <div>
                <ul>
                    {data?.map((item) => (
                        <li key={item.hash}>
                            <a
                                href={`/wiki/${item.hash}`}
                                className='text-blue-500 hover:underline hover:text-blue-900'
                            >
                                {item.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
            <a
                href='/new'
                className='mt-10 w-fit text-sm border border-gray-900 px-2 py-1 rounded-md transition hover:bg-gray-200'
            >
                <span>create new page</span>
            </a>
        </>
    );
}
