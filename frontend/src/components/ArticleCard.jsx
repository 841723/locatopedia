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
                setImgUrl("/sample.jpg");
            }
        })();
    }, [img_url]);

    return (
        <article className='w-full h-64 rounded p-2 hover:contrast-100 contrast-[90%] hover:bg-slate-100 transition-all hover:shadow-lg'>
            <a
                href={`/wiki/${item.hash}`}
                className='flex flex-col gap-2 justify-between h-full'
            >
                <img
                    src={img_url}
                    alt=''
                    className='object-cover h-40 grow rounded'
                />
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
