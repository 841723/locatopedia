import { useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { formatDate } from "@/lib/date";

export function VersionDisplay() {
    const { hash } = useParams();

    const { data, loading } = useFetch(
        `http://localhost:3000/api/wiki/${hash}/versions`
    );

    const maxVersion = data?.reduce((acc, version) => {
        return acc.id_version > version.id_version ? acc : version;
    });

    console.log("data", data);
    console.log("maxVersion", maxVersion);
    if (loading) return <div>Loading...</div>;

    return (
        <ol className='space-y-4'>
            {data.map((version) => (
                <VersionArticle
                    current={version.id_version === maxVersion.id_version}
                    version={version}
                    key={`${version.hash}-${version.id_version}`}
                />
            ))}
        </ol>
    );
}

function VersionArticle({ current, version }) {
    return (
        <li className=''>
            <a
                href={`/wiki/${version.hash}/${version.id_version}`}
                className='border py-2 px-4 flex flex-row justify-between gap-4 hover:bg-gray-100 rounded-md transition-colors group'
            >
                <aside>
                    <h2 className='text-xl font-medium'>{version.title}</h2>
                    <h3 className='text-base text-gray-500'>
                        {version.subtitle}
                    </h3>
                </aside>
                <aside className='grow text-right text-sm text-gray-500 my-auto inline-block'>
                    {current && (
                        <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full mr-2">
                            Current version
                        </span>
                    )}
                    Edited by <em>{version.email_user}</em>{" "}
                    {formatDate(version.date)}
                </aside>
                <aside className='text-sm text-gray-500 my-auto inline-block rounded-md transition-all group-hover:scale-110'>
                    <svg
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
