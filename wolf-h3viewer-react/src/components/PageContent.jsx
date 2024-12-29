/* eslint-disable no-unused-vars */
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function PageContent({ contents }) {
    if (!contents) {
        return null;
    }

    return (
        <Markdown 
            remarkPlugins={[remarkGfm]}
            components={
                {
                    h1( props ) { 
                        const {node, ...rest} = props 
                        return <h1 {...rest} className='max-w-full text-3xl font-medium' />
                    },
                    h2( props ) { 
                        const {node, ...rest} = props 
                        return <h2 {...rest} className='max-w-full text-2xl font-medium' />
                    },
                    h3( props ) { 
                        const {node, ...rest} = props 
                        return <h3 {...rest} className='max-w-full text-xl font-medium' />
                    },
                    h4( props ) { 
                        const {node, ...rest} = props 
                        return <h4 {...rest} className='max-w-full text-lg font-medium' />
                    },
                    h5( props ) { 
                        const {node, ...rest} = props 
                        return <h5 {...rest} className='max-w-full text-base font-medium' />
                    },
                    h6( props ) { 
                        const {node, ...rest} = props 
                        return <h6 {...rest} className='max-w-full text-sm font-medium' />
                    },
                    p( props ) { 
                        const {node, ...rest} = props 
                        return <p {...rest} className='max-w-full text-base' />
                    },
                    em( props ) {
                        const {node, ...rest} = props 
                        return <em {...rest} className='max-w-full italic' />
                    },
                    a( props ) { 
                        const {node, ...rest} = props 
                        return <a {...rest} className='max-w-full text-blue-600 hover:text-blue-400' />
                    },
                    ul( props ) { 
                        const {node, ...rest} = props 
                        return <ul {...rest} className='max-w-full list-disc  ml-10' />;
                    },
                    ol( props ) { 
                        const {node, ...rest} = props 
                        return <ol {...rest} className='max-w-full list-decimal  ml-10' />;
                    },
                    li( props ) { 
                        const {node, ...rest} = props 
                        return <li {...rest} className='max-w-full text-base' />
                    },
                    blockquote( props ) { 
                        const {node, ...rest} = props 
                        return <blockquote {...rest} className='max-w-full border-l-4 border-gray-400 pl-4' />
                    },
                    pre( props ) { 
                        const {node, ...rest} = props 
                        return <pre {...rest} className='max-w-full bg-gray-200 p-4 rounded-md' />
                    },
                    code( props ) { 
                        const {node, ...rest} = props 
                        return <code {...rest} className='max-w-full bg-gray-200 p-1 rounded-md' />
                    },
                    img( props ) { 
                        const {node, ...rest} = props 
                        return <img {...rest} className='max-w-full mx-auto size-60' />
                    },
                    hr( props ) { 
                        const {node, ...rest} = props 
                        return <hr {...rest} className='max-w-full w-full my-4' />
                    },
                    table( props ) {
                        const {node, ...rest} = props 
                        return <table {...rest} className='max-w-full border-collapse w-full my-4' />
                    },
                    thead( props ) {
                        const {node, ...rest} = props 
                        return <thead {...rest} className='max-w-full ' />
                    },
                    th( props ) {
                        const {node, ...rest} = props 
                        return <th {...rest} className='max-w-full px-4 py-2 text-left border-b-2 border-gray-300' />
                    },
                    tbody( props ) {
                        const {node, ...rest} = props 
                        return (
                            <tbody
                                {...rest}
                                className='max-w-full [&>*:nth-child(odd)]:bg-gray-100'
                            />
                        );
                    },
                    tr( props ) {
                        const {node, ...rest} = props 
                        return (
                            <tr
                                {...rest}
                                className='max-w-full [&:not(:first-child)]:border-t-2'
                            />
                        );
                    },
                    td( props ) {
                        const {node, ...rest} = props 
                        return <td {...rest} className='max-w-full px-4 py-2' />
                    },
                }
           
            }
        >
            {contents.toString()}
        </Markdown>
    );
}
