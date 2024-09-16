import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Map } from "@/components/Map";
import { PageContent } from "@/components/PageContent";
import { Button } from "@/components/basic/Button";
import { useFetch } from "@/hooks/useFetch.jsx";
import { parseObjectsToText, parseTextToObjects } from "@/lib/markdown.js";

export function Page() {
    const { hash } = useParams();
    const navigate = useNavigate();
    let url = `http://localhost:3000/api/wiki?hash=${hash}`;

    const { data, loading, error } = useFetch(url);
    const [contents, setContents] = useState([]);
    const [editing, setEditing] = useState(false);
    const [selectedCells, setSelectedCells] = useState([]);
    const [titles, setTitles] = useState({ title: "", subtitle: "" });

    useEffect(() => {
        if (error) {
            navigate("/");
        }
    }, [error]);

    useEffect(() => {
        if (data) {
            const res = parseTextToObjects(data.content);
            if (!res.OK) {
                console.error(res.error);
            } else {
                setContents(res.result);
            }

            setTitles({ title: data.title, subtitle: data.subtitle });
            if (data.cuids) {
                setSelectedCells(data.cuids);
            }
        }
    }, [data]);

    useEffect(() => {
        if (editing) {
            document
                .getElementById("contents-textarea")
                .scrollIntoView({ behavior: "smooth" });
        }
    }, [editing]);

    function handleClick() {
        if (editing) {
            const titleTA = document.getElementById("title-textarea").value;
            const subtitleTA =
                document.getElementById("subtitle-textarea").value;
            const contentsTA =
                document.getElementById("contents-textarea").value;

            if (!titleTA || !subtitleTA || !contentsTA) {
                console.error("All fields are required");
                return;
            }

            console.log("Saving changes...");

            const textParsedToObjects = parseTextToObjects(contentsTA);
            if (!textParsedToObjects.OK) {
                console.error(textParsedToObjects.error);
            } else {
                if (
                    titleTA === titles.title &&
                    subtitleTA === titles.subtitle &&
                    contentsTA === parseObjectsToText(contents)
                ) {
                    console.log("No changes detected");
                    setEditing(false);
                    return;
                }
                // TODO update BBDD
                fetch(`http://localhost:3000/api/wiki/update`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        hash: hash,
                        title: titleTA,
                        subtitle: subtitleTA,
                        content: contentsTA,
                    }),
                })
                    .then((res) => res.json())
                    .then((res) => {
                        setTitles({ title: res.title, subtitle: res.subtitle });
                        setContents(parseTextToObjects(res.content).result);
                        setEditing(false);
                    });
            }
        } else {
            setEditing(true);
        }
    }

    if (loading || !titles.title) {
        return <div>Loading..</div>;
    }

    // const { title, subtitle } = data;

    return (
        <>
            <div className='flex justify-between mb-4'>
                <div className='flex-1 flex flex-col mr-10'>
                    {editing ? (
                        <>
                            <textarea
                                id='title-textarea'
                                defaultValue={titles.title}
                                className='resize-none hover:resize-y w-full text-4xl font-medium h-12 outline'
                                minLength={1}
                                placeholder='Page title'
                                required
                            />
                            <textarea
                                id='subtitle-textarea'
                                defaultValue={titles.subtitle}
                                className='resize-none hover:resize-y w-full mt-2 text-xl text-gray-600 h-8 outline'
                                minLength={1}
                                placeholder='Page subtitle'
                                required
                            />
                        </>
                    ) : (
                        <>
                            <h1 className='text-4xl font-medium h-12'>
                                {titles.title}
                            </h1>
                            <h2 className='mt-2 text-xl text-gray-600 h-8'>
                                {titles.subtitle}
                            </h2>
                        </>
                    )}
                </div>
                <div className='flex flex-col justify-end'>
                    <Button onClick={handleClick}>
                        {editing ? "save changes" : "edit page"}
                    </Button>
                </div>
            </div>

            <Map className={"w-full h-80"} selected={selectedCells} />

            <hr className='w-full my-4 border border-gray-900' />

            {editing ? (
                <textarea
                    id='contents-textarea'
                    className='w-full h-80 p-2 outline'
                    defaultValue={parseObjectsToText(contents)}
                    autoComplete='off'
                    autoFocus
                />
            ) : (
                <PageContent contents={contents} />
            )}
        </>
    );
}

// e.preventDefault();
// const writtenText = e.target[0].value;
// const res = parseTextToObjects(writtenText);
// if (!res.OK) {
//     console.error(res.error);
// } else {
//     setContents(res.result);
//     setEditing(false);
// }
