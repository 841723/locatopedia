/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/basic/Button";

export function PageContent({ initialContents, editing, onChange}) {
    const [showPreviewWhileEditing, setShowPreviewWhileEditing] = useState(false);
    const [contents, setContents] = useState(initialContents);
    const textareaRef = useRef(null);
    

    function handleNewContent(e) {
        if (!e) {
            return;
        }

        onChange(e.target.value);
        setContents(e.target.value);
    }

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [contents]);

    useEffect(() => {
        const textarea = document.getElementById("contents-textarea");
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [editing, showPreviewWhileEditing]);

    useEffect(() => {
        if (!editing) {
            console.log('setting contents to initialContents');
            setContents(initialContents);
        }
    }, [editing]);

    useEffect(() => {
        setContents(initialContents);
    }, [initialContents]);

    return editing ? (
        <div className='border border-black p-2'>
            <Button 
                onClick={() => setShowPreviewWhileEditing(!showPreviewWhileEditing)}
            >
                {showPreviewWhileEditing ? 'edit' : 'preview'}
            </Button>
            <div className='mt-2'>
                {showPreviewWhileEditing ? (
                    <MarkdownVisualizer contents={contents} />
                ) : (
                    <textarea
                        ref={textareaRef}
                        id='contents-textarea'
                        className='w-full h-auto p-2 overflow-hidden outline'
                        defaultValue={contents}
                        autoComplete='off'
                        autoFocus
                        onChange={handleNewContent}
                    />
                )}
            </div>
        </div>
    ) : (
        <MarkdownVisualizer contents={initialContents} />
    );
}


function MarkdownVisualizer({ contents }) {
    return (
        <Markdown 
            remarkPlugins={[remarkGfm]}
            components={
                {
                    h1( props ) { 
                        const {node, ...rest} = props 
                        return <h1 {...rest} className='max-w-full text-2xl font-medium mt-4' />
                    },
                    h2( props ) { 
                        const {node, ...rest} = props 
                        return <h2 {...rest} className='max-w-full text-xl font-medium mt-4' />
                    },
                    h3( props ) { 
                        const {node, ...rest} = props 
                        return <h3 {...rest} className='max-w-full text-lg text-gray-500 font-medium mt-4' />
                    },
                    h4( props ) { 
                        const {node, ...rest} = props 
                        return <h4 {...rest} className='max-w-full text-md font-medium mt-1' />
                    },
                    h5( props ) { 
                        const {node, ...rest} = props 
                        return <h5 {...rest} className='max-w-full text-md font-medium mt-1' />
                    },
                    h6( props ) { 
                        const {node, ...rest} = props 
                        return <h6 {...rest} className='max-w-full text-md font-medium mt-1' />
                    },
                    p( props ) { 
                        const {node, ...rest} = props 
                        return <p {...rest} className='max-w-full text-base mt-1' />
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
                        return <thead {...rest} className='max-w-full' />
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