import { Map } from "@/components/Map";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function NewArticle() {
    const [bigMap, setBigMap] = useState(false);
    const [selectedCells, setSelectedCells] = useState([]);
    const navigate = useNavigate();

    const handleMakeBig = () => {
        setBigMap(!bigMap);
    };

    const handleConfirmSelection = () => {
        console.log(selectedCells);
        fetch(
            `http://localhost:3000/api/dggstools/generate-auid-hash?cuids=${selectedCells.join(",")}`
        )
            .then((res) => res.json())
            .then((data) => {
                const { hashed_b64 } = data;
                navigate(`/wiki/${hashed_b64}/new`);
            });
    };

    const mapClassName = bigMap
        ? "absolute top-0 left-0 w-full h-full"
        : "w-full h-[40vh]";

    return (
        <>
            <h1 className='text-5xl font-bold mb-5'>New Article</h1>

            <div className={mapClassName}>
                <Map
                    className={"h-full w-full"}
                    selected={[]}
                    handleMakeBig={handleMakeBig}
                    handleSetSelectedCells={setSelectedCells}
                />
            </div>
            <button
                className='w-fit bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-5'
                onClick={handleConfirmSelection}
                // desactivate the button if the user didn't select any cell
                // disabled={true}
            >
                Confirm
            </button>
        </>
    );
}
