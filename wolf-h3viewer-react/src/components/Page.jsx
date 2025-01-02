import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Map } from "@/components/Map";
import { PageContent } from "@/components/PageContent";
import { Button } from "@/components/basic/Button";
import { useFetch } from "@/hooks/useFetch.jsx";

import { AccountContext } from "@/context/Account";
import { use } from "react";

function formatDate(date) {
    return new Date(date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",

        hour: "numeric",
        minute: "numeric",
    });
}

export function Page() {
    const { getData } = use(AccountContext);
    const { hash } = useParams();
    
    const navigate = useNavigate();
    let url = `http://localhost:3000/api/wiki?hash=${hash}`;
    
    const [emailUser] = useState(getData()?.email);
    const { data, loading, error } = useFetch(url);
    const [content, setContent] = useState({ title: "", subtitle: "" , content: "", date: "", email_user: "" });
    const [editing, setEditing] = useState(false);

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
            setContent({
                title: data.title,
                subtitle: data.subtitle,
                content: data.content,
                date: formatDate(data.date),
                email_user: data.email_user,
            });
        }
    }, [data]);

    useEffect(() => {
        if (editing) {
            document
                .getElementById("contents-textarea")
                .scrollIntoView({ behavior: "smooth" });
        }
    }, [editing]);

    async function handleClick() {
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
                titleTA === content.title &&
                subtitleTA === content.subtitle &&
                contentsTA === content.content
            ) {
                console.log("No changes detected");
                setEditing(false);
                return;
            }
            fetch(`http://localhost:3000/api/wiki/newversion`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    hash: hash,
                    title: titleTA,
                    subtitle: subtitleTA,
                    content: contentsTA,
                    email_user: emailUser,
                }),
            })
                .then((res) => res.json())
                .then((res) => {

                    console.log(res.date);
                    setContent({
                        title: res.title,
                        subtitle: res.subtitle,
                        content: res.content,
                        date: formatDate(res.date),
                        email_user: res.email_user,
                    });
                    setEditing(false);
                });
        } else {
            setEditing(true);
        }
    }

    if (loading) {
        return <div>Loading..</div>;
    }

    return (
        <>
            {content &&
                content.email_user &&
                content.email_user !== "" &&
                content.date &&
                content.date !== "" && (
                    <div className='text-sm text-gray-500 self-end'>
                        Last changes made by <em>{content.email_user}</em> on {content.date}
                    </div>
                )}
            <div className='flex justify-between mb-4'>
                <div className='flex-1 flex flex-col mr-10'>
                    {editing ? (
                        <>
                            <textarea
                                id='title-textarea'
                                defaultValue={content.title ?? ""}
                                className='resize-none hover:resize-y w-full text-4xl font-medium h-12 outline'
                                minLength={1}
                                placeholder='Page title'
                                required
                            />
                            <textarea
                                id='subtitle-textarea'
                                defaultValue={content.subtitle ?? ""}
                                className='resize-none hover:resize-y w-full mt-2 text-xl text-gray-600 h-8 outline'
                                minLength={1}
                                placeholder='Page subtitle'
                                required
                            />
                        </>
                    ) : (
                        <>
                            <h1 className='text-4xl font-medium h-12'>
                                {content.title ?? ""}
                            </h1>
                            <h2 className='mt-2 text-xl text-gray-600 h-8'>
                                {content.subtitle ?? ""}
                            </h2>
                        </>
                    )}
                </div>
                {emailUser && (
                    <div className='flex flex-col justify-end'>
                        <Button onClick={handleClick}>
                            {editing ? "save changes" : "edit page"}
                        </Button>
                    </div>
                )}
            </div>
            {data?.cuids && (
                <Map
                    selectedInitial={data.cuids}
                    allowMapResize={true}
                    initialMapSize={"small"}
                />
            )}

            <hr className='w-full my-4 border border-gray-900' />

            {editing ? (
                <textarea
                    id='contents-textarea'
                    className='w-full h-80 p-2 outline'
                    defaultValue={content.content}
                    autoComplete='off'
                    autoFocus
                />
            ) : (
                <PageContent contents={content.content} />
            )}
        </>
    );
}
