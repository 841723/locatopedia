import { useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { formatDate } from "@/lib/date";

import { BACKEND_API_URL } from "@/lib/env";


export function VersionDisplay() {
    const { hash } = useParams();

    const { data, loading } = useFetch(
        `${BACKEND_API_URL}/api/wiki/${hash}/versions`
    );

    const maxVersion = data?.reduce((acc, version) => {
        return acc.id_version > version.id_version ? acc : version;
    }).id_version;

    const minVersion = data?.reduce((acc, version) => {
        return acc.id_version < version.id_version ? acc : version;
    }).id_version;

    if (loading) return <div>Loading...</div>;

    return (
        <ol className='space-y-4'>
            {data.map((version) => (
                <VersionArticle
                    first={version.id_version === minVersion}
                    current={version.id_version === maxVersion}
                    version={version}
                    key={`${version.hash}-${version.id_version}`}
                />
            ))}
        </ol>
    );
}

function VersionArticle({ first, current, version }) {
    return (
        <li>
            <a
                href={`/wiki/${version.hash}/${version.id_version}`}
                className='border py-2 px-4 flex gap-4 hover:bg-gray-100 rounded-md transition-colors group max-w-full overflow-hidden'
            >
                <article className='grow flex flex-col md:flex-row md:justify-between gap-4'>
                    <aside>
                        <h2 className='text-xl font-medium hover:underline'>
                            {version.title}
                        </h2>
                        <h3 className='text-base text-gray-500'>
                            {version.subtitle}
                        </h3>
                    </aside>
                    <aside className='text-sm text-gray-500 my-auto flex flex-col md:flex-row md:gap-2 md:items-center '>
                        <div></div>
                        {first && (
                            <span className='min-w-fit text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full mr-0 mb-2 md:mr-2 md:mb-0'>
                                First version
                            </span>
                        )}
                        {current && (
                            <span className='min-w-fit text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full mr-0 mb-2 md:mr-2 md:mb-0'>
                                Current version
                            </span>
                        )}
                        <div className='min-w-fit flex flex-col'>
                            <span className='min-w-fit md:text-right m-0'>
                                {first ? "Created by" : "Edited by"}{" "}
                                <em>{version.email_user}</em>{" "}
                            </span>
                            <span className='md:text-right inline'>
                                {formatDate(version.date)}
                            </span>
                        </div>
                    </aside>
                </article>

                <aside className='text-sm text-gray-500 my-auto inline-block rounded-md transition-all min-w-fit'>
                    <svg
                        className='transition-all group-hover:scale-110'
                        width={36}
                        height={36}
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth={1}
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    >
                        <path d='M9 6l6 6l-6 6' />
                    </svg>
                </aside>
            </a>
        </li>
    );
}
