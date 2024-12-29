import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Map } from "@/components/Map";
import { PageContent } from "@/components/PageContent";
import { Button } from "@/components/basic/Button";
import { useFetch } from "@/hooks/useFetch.jsx";

export function Page() {
    const { hash } = useParams();

    const navigate = useNavigate();
    let url = `http://localhost:3000/api/wiki?hash=${hash}`;

    const { data, loading, error } = useFetch(url);
    const [contents, setContents] = useState([]);
    const [editing, setEditing] = useState(false);
    const [titles, setTitles] = useState({ title: "", subtitle: "" });

    useEffect(() => {
        if (error) {
            console.error(error);
            navigate("/");
        }
    }, [error]);

    useEffect(() => {
        if (!loading) {
            if (!data) {
                console.error("No data returned");
                return;
            }
            document.title = `${data.title} - Locatopedia`;
            setContents(data.content);
            setTitles({ title: data.title, subtitle: data.subtitle });
            if (data.cuids) {
                console.log("setting selected cells");
                // setSelectedCells(data.cuids);
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

    async function handleClick () {
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

            if (
                titleTA === titles.title &&
                subtitleTA === titles.subtitle &&
                contentsTA === contents
            ) {
                console.log("No changes detected");
                setEditing(false);
                return;
            }
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
                    setContents(res.content);
                    setEditing(false);
                });
        } 
        else {
            setEditing(true);
        }
    }

    if (loading) {
        return <div>Loading..</div>;
    }

    return (
        <>
            <div className='flex justify-between mb-4'>
                <div className='flex-1 flex flex-col mr-10'>
                    {editing ? (
                        <>
                            <textarea
                                id='title-textarea'
                                defaultValue={titles.title ?? ""}
                                className='resize-none hover:resize-y w-full text-4xl font-medium h-12 outline'
                                minLength={1}
                                placeholder='Page title'
                                required
                            />
                            <textarea
                                id='subtitle-textarea'
                                defaultValue={titles.subtitle ?? ""}
                                className='resize-none hover:resize-y w-full mt-2 text-xl text-gray-600 h-8 outline'
                                minLength={1}
                                placeholder='Page subtitle'
                                required
                            />
                        </>
                    ) : (
                        <>
                            <h1 className='text-4xl font-medium h-12'>
                                {titles.title ?? ""}
                            </h1>
                            <h2 className='mt-2 text-xl text-gray-600 h-8'>
                                {titles.subtitle ?? ""}
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

            {data?.cuids && (
                <Map className={"w-full h-80"} selectedInitial={data.cuids} />
            )}

            <hr className='w-full my-4 border border-gray-900' />

            {editing ? (
                <textarea
                    id='contents-textarea'
                    className='w-full h-80 p-2 outline'
                    defaultValue={contents}
                    autoComplete='off'
                    autoFocus
                />
            ) : (
                <PageContent contents={contents} />
            )}
        </>
    );
}
