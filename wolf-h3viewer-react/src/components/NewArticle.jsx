import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Map } from "@/components/Map";
import { Button } from "@/components/basic/Button";
import { AutoSaveImage } from "@/components/AutoSaveImage";

export function NewArticle() {
    const mapImageRef = useRef(null);
    const mapRef = useRef(null);
    
    const navigate = useNavigate();

    const [selectedCells, setSelectedCells] = useState([]);

    async function handleClick() {
        const titleTA = document.getElementById("title-textarea").value;
        const subtitleTA = document.getElementById("subtitle-textarea").value;
        const contentsTA = document.getElementById("contents-textarea").value;

        if (!titleTA || !subtitleTA || !contentsTA) {
            console.error("All fields are required");
            return;
        }

        await mapRef.current.clean2save();
        // document.render(
        //     <Map
        //         ref={mapRef}
        //         className={"w-full h-80"}
        //         selectedInitial={selectedCells}
        //         handleSetSelectedCells={setSelectedCells}
        //     ></Map>
        // );

        // await mapRef.current.clean2save();
        const imgData = await mapImageRef.current.saveImage(mapRef);
        console.log("lenght imgData", imgData.length);

        const res = await fetch(`http://localhost:3000/api/wiki/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                cuids: selectedCells,
                title: titleTA,
                subtitle: subtitleTA,
                content: contentsTA,
                imgData: imgData,
            }),
        });
        if (res.status !== 201) {
            console.error("Error adding new article");
            return;
        }
        console.log("res", res);
        const data = await res.json();
        console.log("data", data);
        navigate(`/wiki/${data.hashed_b64}`);
        return;
    }

    return (
        <>
            <div className='flex justify-between mb-4'>
                <div className='flex-1 flex flex-col mr-10'>
                    <textarea
                        id='title-textarea'
                        defaultValue={""}
                        className='resize-none hover:resize-y w-full text-4xl font-medium h-12 outline'
                        minLength={1}
                        placeholder='Page title'
                        required
                    />
                    <textarea
                        id='subtitle-textarea'
                        defaultValue={""}
                        className='resize-none hover:resize-y w-full mt-2 text-xl text-gray-600 h-8 outline'
                        minLength={1}
                        placeholder='Page subtitle'
                        required
                    />
                </div>
                <div className='flex flex-col justify-end'>
                    <Button onClick={handleClick}>publish</Button>
                </div>
            </div>
            <Button
                onClick={async () => {
                    await mapRef.current.clean2save();
                    const r = await mapImageRef.current.saveImage();
                    const img = document.createElement("img");
                    img.src = r;
                    document.body.appendChild(img);
                }}
            >
                cancel
            </Button>

            <AutoSaveImage ref={mapImageRef}>
                <Map
                    ref={mapRef}
                    className={"w-full h-80"}
                    selectedInitial={[]}
                    handleSetSelectedCells={setSelectedCells}
                />
            </AutoSaveImage>

            <hr className='w-full my-4 border border-gray-900' />

            <textarea
                id='contents-textarea'
                className='w-full h-80 p-2 outline'
                defaultValue={"contents"}
                autoComplete='off'
                autoFocus
            />
        </>
    );
}
