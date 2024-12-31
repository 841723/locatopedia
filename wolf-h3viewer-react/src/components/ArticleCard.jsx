// export function ArticleCard({ item }) {
//     return (
//         <article className='w-full h-32 rounded p-2 hover:bg-slate-100 transition-all hover:shadow-sm hover:scale-[102%]'>
//             <a
//                 href={`/wiki/${item.hash}`}
//                 className='flex gap-2 justify-between'
//             >
//                 <img
//                     src='/sample.jpg'
//                     alt=''
//                     className='object-cover w-28 flex-grow'
//                 />
//                 <div className='flex flex-col'>
//                     <h2 className='text-blue-500 hover:underline hover:text-blue-900 text-lg font-semibold'>
//                         {item.title}
//                     </h2>
//                     <h3 className='text-sm'>{item.subtitle}</h3>
//                 </div>
//             </a>
//         </article>
//     );
// }

// export function ArticleCard({ item }) {
//     return (
//         <article className='w-full h-64 rounded p-2 hover:bg-slate-100 transition-all hover:shadow-lg hover:scale-[102%]'>
//             <a
//                 href={`/wiki/${item.hash}`}
//                 className='flex flex-col gap-2 justify-between h-full'
//             >
//                 <img
//                     src='/sample.jpg'
//                     alt=''
//                     className='object-cover h-40 flex-grow rounded'
//                 />
//                 <div className='flex flex-col justify-end'>
//                     <h2 className='text-blue-500 hover:underline hover:text-blue-900 text-lg font-semibold'>
//                         {item.title}
//                     </h2>
//                     <h3 className='text-sm text-gray-500'>{item.subtitle}</h3>
//                 </div>
//             </a>
//         </article>
//     );
// }

export function ArticleCard({ item }) {
    return (
        <article className='w-full h-64 rounded p-2 hover:contrast-100 contrast-[90%] hover:bg-slate-100 transition-all hover:shadow-lg'>
            <a
                href={`/wiki/${item.hash}`}
                className='flex flex-col gap-2 justify-between h-full'
            >
                <img
                    src={item.img || "/sample.jpg"}
                    alt=''
                    className='object-cover h-40 flex-grow rounded'
                />
                <div className='flex flex-col justify-end'>
                    <h2 className='text-[var(--color-secondary)] hover:underline hover:text-blue-900 text-lg font-semibold'>
                        {item.title}
                    </h2>
                    <h3 className='text-sm text-gray-500'>{item.subtitle}</h3>
                </div>
            </a>
        </article>
    );
}