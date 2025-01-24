import { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { useNavigate, useParams } from "react-router-dom";
import { MapCells } from "@/components/MapCells";
import { Button } from "@/components/basic/Button";
import { AutoSaveImage } from "@/components/AutoSaveImage";
import { use } from "react";
import { AccountContext } from "@/context/Account";
import { TopInfoDisplayContext } from "@/context/TopInfoDisplay";
import { Modal } from "@/lib/modal";

import { BACKEND_API_URL } from "@/lib/env";
import { PageContent } from "./PageContent";
import { userfetch } from "@/hooks/useFetch";

export function NewArticle() {
    const { hash, version } = useParams();

    useEffect(() => {
        if (hash || version) {
            (async () => {
                let url = `${BACKEND_API_URL}/api/wiki?hash=${hash}${version ? `&version=${version}` : ""}`;
                const response = await userfetch(url);
                if (response.error) {
                    console.error(response.error);
                }
                setTitle(response.data.title);
                setSubtitle(response.data.subtitle);
                setContents(response.data.content);
                setSelectedCells(response.data.cuids);

                console.log(response.data);
            })();
        }
    }, [hash, version]);

    const mapImageRef = useRef(null);
    const navigate = useNavigate();

    const [disabled, setDisabled] = useState(true);
    const [validCuids, setValidCuids] = useState(false);
    const [published, setPublished] = useState(false);

    const [selectedCells, setSelectedCells] = useState([]);
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [contents, setContents] = useState("");

    const { setState, setText } = use(TopInfoDisplayContext);
    const { getData, getToken } = use(AccountContext);
    const credentials = getData();
    const [email_user] = useState(credentials.email);

    async function handleClick() {
        if (!title || !subtitle || !contents) {
            console.error("All fields are required");
            return;
        }

        setState(1);
        Modal.createAndOpenModal({
            question: "Are you sure you want to create this new article?",
            text: "This action cannot be undone. Make sure you have reviewed the article before publishing.",
            buttons: [
                {
                    text: "No",
                    className: "bg-red-500 text-white hover:bg-red-600",
                    action: () => setState(0),
                },
                {
                    text: "Yes",
                    className: "bg-green-500 text-black hover:bg-green-600",
                    action: () => setPublished(true),
                },
            ],
            options: {
                closeButton: false,
                closeOnBackgroundClick: true,
                closeOnEscape: true,
                closeOnButton: true,

                onClose: () => {
                    setState(0);
                },
            },
        });
    }

    useEffect(() => {
        if (published) {
            document.body.style.overflow = "hidden";
            const div = document.createElement("div");
            div.id = "mapid2";
            document.body.appendChild(div);
            ReactDOM.createRoot(document.getElementById("mapid2")).render(
                <AutoSaveImage ref={mapImageRef}>
                    <MapCells
                        selectedInitial={selectedCells}
                        handleSetSelectedCells={() => {}}
                        map4DownloadImage={true}
                        allowSelectingCells={false}
                    />
                </AutoSaveImage>
            );
            setTimeout(async () => {
                const imgData = await mapImageRef.current.saveImage();
                document.body.style.overflow = "auto";
                div.remove();
                
                console.log({ imgData });
                
                const token = getToken();
                console.log({ token });

                const res = await userfetch(
                    `${BACKEND_API_URL}/api/wiki/auth/add`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            cuids: selectedCells,
                            title: title,
                            subtitle: subtitle,
                            content: contents,
                            imgData: imgData,
                            emailUser: email_user,
                        }),
                    }
                );
                if (res.status !== 201) {
                    console.error("Error adding new article");
                    return;
                }
                setText("Article created successfully");
                setState(2);

                navigate(`/wiki/${res.data.hash}`);
                console.log("published");
                return;
            }, 500);
        }
    }, [published]);

    useEffect(() => {
        (async () => {
            if (selectedCells.length === 0) {
                setDisabled(true);
                return;
            }

            userfetch(
                `${BACKEND_API_URL}/api/wiki/validnewcuids?cuids=${selectedCells.join(",")}`
            ).then((res) => {
                setValidCuids(res.data.valid);
            });
        })();
    }, [selectedCells]);

    useEffect(() => {
        setDisabled(
            title.length === 0 ||
                subtitle.length === 0 ||
                contents.length === 0 ||
                selectedCells.length === 0 ||
                !validCuids
        );
    }, [title, subtitle, contents, selectedCells, validCuids]);
    
    return (
        <>
            <div className='flex justify-between mb-4'>
                <div className='flex-1 flex flex-col'>
                    <textarea
                        id='title-textarea'
                        defaultValue={title}
                        className='resize-none w-full text-4xl font-medium h-12 outline'
                        minLength={1}
                        placeholder='Page title'
                        required
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                        id='subtitle-textarea'
                        defaultValue={subtitle}
                        className='resize-none w-full mt-2 text-xl text-gray-600 h-8 outline'
                        minLength={1}
                        placeholder='Page subtitle'
                        required
                        onChange={(e) => setSubtitle(e.target.value)}
                    />
                </div>
            </div>

            {!published ? (
                !hash || (hash && selectedCells.length > 0) ? (
                    <MapCells
                        selectedInitial={selectedCells}
                        handleSetSelectedCells={setSelectedCells}
                        allowMapResize={true}
                        initialMapSize={"small"}
                        allowSelectingCells={true}
                    />
                ) : null
            ) : (
                <div className='w-full h-80' />
            )}

            <hr className='w-full my-4 border border-gray-900' />

            {/* <textarea
                id='contents-textarea'
                className='w-full h-80 p-2 outline'
                defaultValue={""}
                autoComplete='off'
                autoFocus
                required
                onChange={(e) => setContents(e.target.value)}
            /> */}

            <PageContent
                initialContents={contents}
                editing={true}
                onChange={(value) => setContents(value)}
            />

            <div className='flex gap-8 justify-end mt-4'>
                <Button onClick={() => navigate("/")}>cancel</Button>
                <Button onClick={handleClick} disabled={disabled}>
                    publish
                </Button>
            </div>
        </>
    );
}
