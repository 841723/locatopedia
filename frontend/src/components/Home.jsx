import { ArticleList } from "./ArticleList";

export function Home() {

    return (
        <div className='flex flex-col gap-20'>
            <ArticleList
                title='Popular'
                query='/api/wiki/popular?limit=3'
            />
            <ArticleList
                title='Close to you'
                query='/api/wiki/popular?limit=3'
            />
            <ArticleList
                title='Article of the day'
                query='/api/wiki/popular?limit=1'
                showOnlyOne={true}
            />
        </div>
    );
}
