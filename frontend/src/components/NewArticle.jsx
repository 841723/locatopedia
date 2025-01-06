import { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { useNavigate } from "react-router-dom";
import { Map } from "@/components/Map";
import { Button } from "@/components/basic/Button";
import { AutoSaveImage } from "@/components/AutoSaveImage";
import { use } from "react";
import { AccountContext } from "@/context/Account";
import { TopInfoDisplayContext } from "@/context/TopInfoDisplay";
import { Modal } from "@/lib/modal";

import { BACKEND_API_URL } from "@/lib/env";


export function NewArticle() {
    const mapImageRef = useRef(null);
    const navigate = useNavigate();

    const [disabled, setDisabled] = useState(true);
    const [validCuids, setValidCuids] = useState(false);
    const [selectedCells, setSelectedCells] = useState([]);
    const [published, setPublished] = useState(false);

    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [contents, setContents] = useState("");

    const { setState, setText } = use(TopInfoDisplayContext);
    const { getData } = use(AccountContext);
    const [email_user] = useState(getData()?.email);

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
                    text: "Yes",
                    className: "bg-green-500 text-black hover:bg-green-600",
                    action: () => {
                        setPublished(true);
                    },
                },
                {
                    text: "No",
                    className: "bg-red-500 text-white hover:bg-red-600",
                    action: () => {
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
    }

    useEffect(() => {
        if (published) {
            document.body.style.overflow = "hidden";
            const div = document.createElement("div");
            div.id = "mapid2";
            document.body.appendChild(div);
            ReactDOM.createRoot(document.getElementById("mapid2")).render(
                <AutoSaveImage ref={mapImageRef}>
                    <Map
                        selectedInitial={selectedCells}
                        handleSetSelectedCells={() => {}}
                        map4DownloadImage={true}
                    />
                </AutoSaveImage>
            );
            setTimeout(async () => {
                const imgData = await mapImageRef.current.saveImage();
                document.body.style.overflow = "auto";
                div.remove();

                console.log({imgData});

                const res = await fetch(`${BACKEND_API_URL}/api/wiki/add`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        cuids: selectedCells,
                        title: title,
                        subtitle: subtitle,
                        content: contents,
                        imgData: imgData,
                        emailUser: email_user,
                    }),
                });
                if (res.status !== 201) {
                    console.error("Error adding new article");
                    return;
                }
                setText("Article created successfully");
                setState(2);

                console.log("res", res);
                const data = await res.json();
                console.log("data", data);
                navigate(`/wiki/${data.hash}`);
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
            console.log("selectedCells", selectedCells);

            fetch(
                `${BACKEND_API_URL}/api/wiki/validnewcuids?cuids=${selectedCells.join(",")}`
            )
                .then((res) => res.json())
                .then((res) => {
                    setValidCuids(res.valid);
                })
                .catch((err) => {
                    console.error(err);
                    setDisabled(true);
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
                        defaultValue={""}
                        className='resize-none w-full text-4xl font-medium h-12 outline'
                        minLength={1}
                        placeholder='Page title'
                        required
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                        id='subtitle-textarea'
                        defaultValue={""}
                        className='resize-none w-full mt-2 text-xl text-gray-600 h-8 outline'
                        minLength={1}
                        placeholder='Page subtitle'
                        required
                        onChange={(e) => setSubtitle(e.target.value)}
                    />
                </div>
            </div>

            {!published ? (
                <Map
                    selectedInitial={[]}
                    handleSetSelectedCells={setSelectedCells}
                    allowMapResize={true}
                    initialMapSize={"small"}
                />
            ) : (
                <div className='w-full h-80' />
            )}

            <hr className='w-full my-4 border border-gray-900' />

            <textarea
                id='contents-textarea'
                className='w-full h-80 p-2 outline'
                defaultValue={""}
                autoComplete='off'
                autoFocus
                required
                onChange={(e) => setContents(e.target.value)}
            />

            <div className='flex gap-8 justify-end mt-4'>
                <Button onClick={() => navigate('/')}>cancel</Button>
                <Button
                    onClick={handleClick}
                    disabled={disabled}
                >
                    publish
                </Button>
            </div>
        </>
    );
}
