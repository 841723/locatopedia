import Markdown from "react-markdown";

import "@/lib/markdown.css";


export function PageContent({ contents }) {
    if (!contents) {
        return null;
    }

    return (
        <Markdown className='markdown'>{contents}</Markdown>
    );
}
