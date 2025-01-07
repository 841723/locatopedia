import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Map } from "@/components/Map";
import { PageContent } from "@/components/PageContent";
import { Button } from "@/components/basic/Button";
import { useFetch } from "@/hooks/useFetch.jsx";

import { AccountContext } from "@/context/Account";
import { TopInfoDisplayContext } from "@/context/TopInfoDisplay";
import { use } from "react";
import { formatDate } from "@/lib/date";
import { Modal } from "@/lib/modal";

import { BACKEND_API_URL } from "@/lib/env";
import { HeartCounter } from "@/components/HeartCounter";

export function Page() {
    const { getData } = use(AccountContext);
    const { setText, setState } = use(TopInfoDisplayContext);
    const { hash, version } = useParams();

    const navigate = useNavigate();
    
    const [emailUser] = useState(getData()?.email);
    const [content, setContent] = useState({
        title: "",
        subtitle: "",
        content: "",
        date: "",
        email_user: "",
    });
    
    const [editedContent, setEditedContent] = useState({
        title: "",
        subtitle: "",
        content: "",
    });
    
    const [editing, setEditing] = useState(false);
    
    let url = `${BACKEND_API_URL}/api/wiki?hash=${hash}${version ? `&version=${version}` : ""}${emailUser ? `&email=${emailUser}` : ""}`;
    const { data, loading, error } = useFetch(url);

    useEffect(() => {
        if (editing) {
            setEditedContent({
                title: content.title,
                subtitle: content.subtitle,
                content: content.content,
            });
        }
    }, [editing]);

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
                like_count: data.like_count,
                user_liked: data.user_liked,
            });
        }
    }, [data]);

    useEffect(() => {
        console.log("editedContent", editedContent);
    }, [editedContent]);

    async function saveChanges() {
        fetch(`${BACKEND_API_URL}/api/wiki/newversion`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                hash: hash,
                title: editedContent.title,
                subtitle: editedContent.subtitle,
                content: editedContent.content,
                email_user: emailUser,
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res.date);
                setContent((prev) => ({
                    ...prev,
                    title: res.title,
                    subtitle: res.subtitle,
                    content: res.content,
                    date: formatDate(res.date),
                    email_user: res.email_user,
                }));
                setEditing(false);
                setText("Changes saved successfully");
                setState(2);
                if (version) {
                    navigate(`/wiki/${hash}`);
                } else {
                    // update the content
                }
                // navigate(`/wiki/${hash}`);
            });
    }

    function handleClick() {
        if (editing) {
            console.log("editedContent", editedContent);

            if (
                editedContent.title === "" ||
                editedContent.subtitle === "" ||
                editedContent.content === ""
            ) {
                console.error("All fields are required");
                return;
            }

            console.log("Saving changes...");

            if (
                editedContent.title === content.title &&
                editedContent.subtitle === content.subtitle &&
                editedContent.content === content.content
            ) {
                console.log("No changes detected");
                setEditing(false);
                return;
            }

            setState(1);
            Modal.createAndOpenModal({
                question: "Are you sure you want to publish these changes?",
                text: "This action cannot be undone. Make sure you have reviewed your changes.",
                buttons: [
                    {
                        text: "No",
                        className: "bg-red-500 text-white hover:bg-red-600",
                        action: () => {
                            console.log("No");
                        },
                    },
                    {
                        text: "Yes",
                        className: "bg-green-600 text-white hover:bg-green-700",
                        action: () => {
                            console.log("Yes");
                            saveChanges();
                        },
                    },
                ],
                options: {
                    closeButton: false,
                    closeOnBackgroundClick: true,
                    closeOnEscape: true,
                    closeOnButton: true,

                    onClose: () => {
                        console.log("Modal closed");
                    },
                },
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
            <div className='flex justify-between mb-4'>
                <div className='flex-1 flex flex-col mr-2'>
                    {editing ? (
                        <>
                            <textarea
                                id='title-textarea'
                                defaultValue={content.title ?? ""}
                                className='resize-none hover:resize-y w-full text-4xl font-medium h-12 outline'
                                minLength={1}
                                placeholder='Page title'
                                required
                                onChange={(e) => {
                                    setEditedContent((prev) => ({
                                        ...prev,
                                        title: e.target.value,
                                    }));
                                }}
                            />
                            <textarea
                                id='subtitle-textarea'
                                defaultValue={content.subtitle ?? ""}
                                className='resize-none hover:resize-y w-full mt-2 text-xl text-gray-600 h-8 outline'
                                minLength={1}
                                placeholder='Page subtitle'
                                required
                                onChange={(e) => {
                                    setEditedContent((prev) => ({
                                        ...prev,
                                        subtitle: e.target.value,
                                    }));
                                }}
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

                <div className='flex items-center gap-4'>
                    {content &&
                        content.like_count &&
                        content.user_liked !== undefined && (
                            <HeartCounter
                                initialLikes={content.like_count}
                                initialLiked={content.user_liked}
                                hash={hash}
                                email={emailUser}
                            />
                        )}
                </div>
            </div>
            {data?.cuids && (
                <Map
                    selectedInitial={data.cuids}
                    allowMapResize={true}
                    initialMapSize={"small"}
                />
            )}

            <hr className='w-full my-4 border border-gray-900' />

            {data?.content && (
                <PageContent
                    initialContents={data.content}
                    onChange={(newContent) =>
                        setEditedContent((prev) => ({
                            ...prev,
                            content: newContent,
                        }))
                    }
                    editing={editing}
                />
            )}

            {emailUser && (
                <div className='flex gap-8 justify-end mt-4'>
                    {editing && (
                        <Button onClick={() => setEditing(false)}>
                            cancel
                        </Button>
                    )}
                    <Button
                        onClick={handleClick}
                        className='px-14'
                        disabled={
                            editing &&
                            ((editedContent.title === content.title &&
                                editedContent.subtitle === content.subtitle &&
                                editedContent.content === content.content) ||
                                editedContent.title === "" ||
                                editedContent.subtitle === "" ||
                                editedContent.content === "")
                        }
                    >
                        {editing ? "save changes" : "edit page"}
                    </Button>
                </div>
            )}
            <footer className='flex flex-col md:flex-row gap-4 justify-between text-sm text-gray-500 mt-4'>
                <a href={`/wiki/${hash}/versions`} className='hover:underline'>
                    See other versions of this page
                </a>
                {content &&
                    content.email_user &&
                    content.email_user !== "" &&
                    content.date &&
                    content.date !== "" && (
                        <div className=''>
                            Last changes made by <em>{content.email_user}</em>{" "}
                            <br className='block md:hidden' />
                            {content.date}
                        </div>
                    )}
            </footer>
        </>
    );
}
