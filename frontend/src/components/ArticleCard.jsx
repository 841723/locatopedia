import { BACKEND_API_URL } from "@/lib/env.js";
import { useEffect, useState } from "react";

export function ArticleCard({ item }) {
    const [img_url, setImgUrl] = useState(
        item.img_url.split(".").pop() === "webp"
            ? `${BACKEND_API_URL}${item.img_url}`
            : item.img_url || "/sample.jpg"
    );

    // check if the image is getting loaded
    useEffect(() => {
        (async () => {
            const img = await fetch(img_url);
            if (!img.ok) {
                console.error(`Failed to load image: ${img_url}`);
                setImgUrl(null);
            }
        })();
    }, [img_url]);

    return (
        <article className='w-full h-64 rounded p-2 hover:contrast-100 contrast-[90%] hover:bg-slate-100 transition-all hover:shadow-lg'>
            <a
                href={`/wiki/${item.hash}`}
                className='flex flex-col gap-2 justify-between h-full'
            >
                {img_url === null ? (
                    <div className='flex items-center justify-center h-40 bg-gray-100 text-gray-500'>
                        <Loader />
                        {item.img_url.split(".").pop() === "webp"
                            ? `${BACKEND_API_URL}${item.img_url}`
                            : item.img_url || "/sample.jpg"}
                    </div>
                ) : (
                    <img
                        src={img_url}
                        alt=''
                        className='object-cover h-40 grow rounded'
                    />
                )}

                <div className='flex flex-col justify-end'>
                    <h2 className='text-[var(--color-secondary)] hover:underline hover:text-blue-900 text-lg font-semibold truncate'>
                        {item.title}
                    </h2>
                    <h3 className='text-sm text-gray-500 truncate'>
                        {item.subtitle}
                    </h3>
                </div>
            </a>
        </article>
    );
}

function Loader() {
    return (
        <div
            className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]'
            role='status'
        >
            <span className='!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]'>
                Loading...
            </span>
        </div>
    );
}
