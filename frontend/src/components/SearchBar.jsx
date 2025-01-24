import { debounce } from "@/lib/debounce";
import { useEffect, useRef, useState } from "react";
import { userfetch } from "@/hooks/useFetch";
import { Map as MapIcon } from "@/components/basic/icons/Map";

import { BACKEND_API_URL } from "@/lib/env";
import { MapArea } from "./MapArea";

import * as h3 from "h3-js";
import * as turf from "@turf/turf";



function calculateMergedPolygon(h3Indexes) {
    // Convertir celdas H3 en polígonos GeoJSON
    const polygons = h3Indexes.map((h3Index) => {
        const boundary = h3.cellToBoundary(h3Index, false); // true devuelve [lng, lat]
        return turf.polygon([boundary.concat([boundary[0]])]); // Cerrar el polígono
    });

    const allPolygons = turf.featureCollection(polygons);
    const mergedPolygon = turf.union(allPolygons);

    return mergedPolygon;
}


function isOverlappingPolygon(polygon1, polygon2) {
    const turfPolygon1 = turf.polygon([polygon1]);
    const res = turf.booleanIntersects(turfPolygon1, polygon2);
    return res;
    
    // return turf.booleanOverlap(turfPolygon1, polygon2);
}

export function SearchBar() {
    const inputRef = useRef(null);

    const [searchResults, setSearchResults] = useState([]);

    const [searchParam, setSearchParam] = useState("");
    const [selectedArea, setSelectedArea] = useState(null);
    const [showMap, setShowMap] = useState(false);

    useEffect(() => {
        if (searchParam === "" && !selectedArea) return;

        const fetchData = async () => {
            console.log("Fetching data for search param:", searchParam);

            const { data, error } = await userfetch(
                `${BACKEND_API_URL}/api/wiki/search?query=${searchParam}`
            );
            if (error) {
                console.error(error);
                return;
            }

            var filteredData = data;

            if (selectedArea) {
                const isInSelectedArea = (article) => {
                    if (!article.cuids) return false;

                    const uniqueArea = calculateMergedPolygon(article.cuids);
                    return isOverlappingPolygon(selectedArea, uniqueArea);
                };
                filteredData = data.filter(isInSelectedArea);
            }

            if (filteredData.length === 0) {
                filteredData.push({
                    title: "No results found",
                    subtitle: "Try searching for something else",
                });
            }
            setSearchResults(filteredData);
        };

        fetchData();
    }, [searchParam, selectedArea]);

    const debouncedHandleChange = debounce(async (value) => {
        setSearchParam(value);

        if (value === "" && !selectedArea) {
            handleCloseResults();
            return;
        }
    }, 200);

    const handleCloseResults = () => {
        setSearchResults([]);
        setSelectedArea(null);
        setShowMap(false);
        inputRef.current.value = "";
    };

    const handleChangePolygon = (polygon) => {
        setSelectedArea(polygon);
    };

    const showBlackScreen = searchResults.length > 0 || showMap;

    return (
        <>
            {(searchResults.length > 0 || showMap) && (
                <div
                    onClick={handleCloseResults}
                    className='absolute z-[1000] inset-0 bg-black/20 h-screen w-screen'
                />
            )}
            <div className='relative flex flex-col justify-start items-center w-full focus-within:ring-2 rounded-lg'>
                <aside className='relative w-full flex justify-center items-center rounded-lg'>
                    <input
                        ref={inputRef}
                        type='text'
                        className={`bg-white flex-grow w-full px-2 py-1 xl:p-2 border-l border-t border-b focus:outline-none border-gray-300 ${showBlackScreen ? "rounded-tl-lg z-[2000]" : "rounded-l-lg"}`}
                        placeholder='Search for articles...'
                        onChange={(e) => debouncedHandleChange(e.target.value)}
                    />
                    <div
                        className={`bg-white px-2 py-1 xl:p-2 border-r border-t border-b flex border-gray-300 ${showBlackScreen ? "rounded-tr-lg z-[2000]" : "rounded-r-lg"} text-slate-400`}
                    >
                        {selectedArea && (
                            <span className='whitespace-nowrap select-none text-sm font-normal self-center mr-3 text-slate-400/90'>
                                (Area selected)
                            </span>
                        )}
                        <button onClick={() => {
                            setShowMap((prev) => !prev);
                            setSelectedArea(null);
                        }}>
                            <MapIcon className='w-6 h-6  hover:text-gray-700 transition-all' />
                        </button>
                    </div>
                </aside>
                <div className='relative w-full'>
                    <aside className='w-full absolute z-[2000] rounded-lg'>
                        {showMap && (
                            <div className='w-full z-[2000] '>
                                <MapArea
                                    className='w-full h-96'
                                    allowMapResize={false}
                                    idMap='search-map'
                                    handleChangePolygon={handleChangePolygon}
                                />
                            </div>
                        )}
                        {searchResults.length > 0 && (
                            <ul className='z-[2000] pt-4 w-full border bg-white rounded-b-lg p-2'>
                                {searchResults.map((result) => (
                                    <li
                                        key={result.hash || result.title}
                                        className={`px-2 py-4 rounded-lg transition-colors ${result.hash ? "hover:bg-gray-200" : ""}`}
                                    >
                                        {result.hash ? (
                                            <a href={`/wiki/${result.hash}`}>
                                                <h2 className='text-lg font-medium'>
                                                    {result.title}
                                                </h2>
                                                <p className='text-sm'>
                                                    {result.subtitle}
                                                </p>
                                            </a>
                                        ) : (
                                            <div>
                                                <h2 className='text-lg font-medium'>
                                                    {result.title}
                                                </h2>
                                                <p className='text-sm'>
                                                    {result.subtitle}
                                                </p>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </aside>
                </div>
            </div>
        </>
    );
}

const data = [
    {
        hash: "4W2pF8ErT0Utxp5HLU4rikyKgVA=",
        title: "CPS",
        subtitle: "Centro Politecnico Superior de Zaragoza",
        img_url: "/api/images/4W2pF8ErT0Utxp5HLU4rikyKgVA=.webp",
    },
    {
        hash: "TlDy5lMOz4sRH-Ulfvj28eveDFs=",
        title: "Zaragoza",
        subtitle: "Capital de Aragón",
        img_url: "/api/images/TlDy5lMOz4sRH-Ulfvj28eveDFs=.webp",
    },
    {
        hash: "MHq90v59SVFBkHknOaRaq3XokeU=",
        title: "Pirineos",
        subtitle:
            "Los Pirineos: Naturaleza en su Máxima Expresión y tanto que si maximmo son chulisimosssss",
        img_url: "/api/images/MHq90v59SVFBkHknOaRaq3XokeU=.webp",
    },
];
