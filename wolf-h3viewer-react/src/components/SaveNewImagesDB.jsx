import { useRef } from "react";
import ReactDOM from "react-dom/client";
import { AutoSaveImage } from "@/components/AutoSaveImage";
import { Map } from "@/components/Map";


export function SaveNewImagesDB() {
    const mapImageRef = useRef(null);

    const handleClick = async () => {
        const res = await fetch("http://localhost:3000/api/wiki/all", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await res.json();
        console.log(data);

        var count = 0;
        for (const item of data) {
            count++;
            
            const dggsres = await fetch(
                `http://localhost:3000/api/dggstools/cuids-from-auid?auid=${item.auid}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const dggsdata = await dggsres.json();
            
            const div = document.createElement("div");
            div.id = `mapid${count}`;
            document.body.appendChild(div);
            ReactDOM.createRoot(
                document.getElementById(`mapid${count}`)
            ).render(
                <AutoSaveImage ref={mapImageRef}>
                    <Map
                        selectedInitial={dggsdata.cuids}
                        handleSetSelectedCells={() => {}}
                        map4DownloadImage={true}
                        idMap={`mapid-${count}`}
                    />
                </AutoSaveImage>
            );
            // create the time out and wait until then
            await new Promise((resolve) => setTimeout(resolve, 100));
            const dataUrl = await mapImageRef.current.saveImage();

            const res = await fetch(
                "http://localhost:3000/api/wiki/update/imgData",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        hash: item.hash,
                        title: item.title,
                        subtitle: item.subtitle,
                        content: item.content,
                        imgData: dataUrl,
                    }),
                }
            );
            const data = await res.json();
            console.log(data);
        }
    };

    return (
        <button
            onClick={handleClick}
            className='w-fit bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 self-end'
        >
            Reload all article images
        </button>
    );
}