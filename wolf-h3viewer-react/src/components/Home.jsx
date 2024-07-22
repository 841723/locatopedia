import { useEffect } from "react";
import useFetch from "../hooks/useFetch";

export function Home() {
    const { data } = useFetch("http://localhost:3000/api/wiki/popular?limit=4");

    useEffect(() => {
        console.log(data);
    }, [data]);

    return (
        <>
            <h1 className='text-4xl mb-5 font-bold'>Home</h1>
            <div>
                <ul>
                    {data?.map((item) => (
                        <li key={item.id}>
                            <a
                                href={`/wiki/${item.id}`}
                                className='text-blue-500 hover:underline hover:text-blue-900'
                            >
                                {item.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default Home;
