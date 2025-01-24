import { ArticleList } from "@/components/ArticleList";

export function Home() {
    return (
        <>
            <div className='flex flex-col gap-20'>
                <ArticleList
                    title='Popular'
                    query='/api/wiki/popular?limit=3'
                />

                <ArticleList
                    title='Recently updated'
                    query='/api/wiki/newest/versions?limit=8'
                />

                <ArticleList
                    title='Recently created'
                    query='/api/wiki/newest/articles?limit=8'
                />

                <ArticleList
                    title='Article of the day'
                    query='/api/wiki/random?limit=1'
                    showOnlyOne={true}
                />
            </div>
        </>
    );
}