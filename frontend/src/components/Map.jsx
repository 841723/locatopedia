/* eslint-disable no-undef */
import { useEffect, useState, useRef } from "react";
import { union, featureCollection } from "@turf/turf";
import * as h3 from "h3-js";
import { WindowSizeDecrease, WindowSizeIncrease } from "@/components/basic/icons/WindowResize";

const GeoUtils = {
    EARTH_RADIUS_METERS: 6371000,
    radiansToDegrees: (r) => (r * 180) / Math.PI,
    degreesToRadians: (d) => (d * Math.PI) / 180,
    getDistanceOnEarthInMeters: (lat1, lon1, lat2, lon2) => {
        const lat1Rad = GeoUtils.degreesToRadians(lat1);
        const lat2Rad = GeoUtils.degreesToRadians(lat2);
        const lonDelta = GeoUtils.degreesToRadians(lon2 - lon1);
        const x =
            Math.sin(lat1Rad) * Math.sin(lat2Rad) +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.cos(lonDelta);
        return (
            GeoUtils.EARTH_RADIUS_METERS *
            Math.acos(Math.max(Math.min(x, 1), -1))
        );
    },
};

const ZOOM_TO_H3_RES_CORRESPONDENCE = {
    4: 0,
    5: 1,
    6: 2,
    7: 3,
    8: 3,
    9: 4,
    10: 5,
    11: 6,
    12: 6,
    13: 7,
    14: 8,
    15: 9,
    16: 9,
    17: 10,
    18: 10,
    19: 11,
    20: 11,
    21: 12,
    22: 13,
    23: 14,
    24: 15,
};

const H3_RES_TO_ZOOM_CORRESPONDENCE = {};
for (const [zoom, res] of Object.entries(ZOOM_TO_H3_RES_CORRESPONDENCE)) {
    H3_RES_TO_ZOOM_CORRESPONDENCE[res] = zoom;
}

const getH3ResForMapZoom = (mapZoom) => {
    return (
        ZOOM_TO_H3_RES_CORRESPONDENCE[mapZoom] ??
        Math.floor((mapZoom - 1) * 0.7)
    );
};

const h3BoundsToPolygon = (lngLatH3Bounds) => {
    lngLatH3Bounds.push(lngLatH3Bounds[0]); // "close" the polygon
    return lngLatH3Bounds;
};

/**
 *
 * @param selectedInitial the selectedCellsIDs cells are highlighted in the map, user cannot select cells. If empty or undefined, user can select cells
 * @param className the class name of the map container
 *
 */
export function Map({
    selectedInitial,
    allowMapResize = true,
    handleSetSelectedCells = () => {},
    initialMapSize = "small",
    map4DownloadImage = false,
    idMap = "mapid",
}) {

    const smallMapClassName = "w-full h-80";
    const bigMapClassName =
        "absolute bottom-0 left-0 w-screen h-[calc(100dvh-96px)] z-10";

    const [mapSize, setMapSize] = useState(initialMapSize);
    const [className, setClassName] = useState(
        mapSize === "big" ? bigMapClassName : smallMapClassName
    );

    const [selectedInicialCellsIDs] = useState(
        selectedInitial ? selectedInitial : []
    );
    const [selectedCellsIDs, setSelectedCellsIDs] = useState(
        selectedInitial ? selectedInitial : []
    );

    var map = useRef(null);
    var hexLayer = useRef(null);

    function handleClickCell(h3id) {
        const allowSelectingCells =
            !selectedInicialCellsIDs ||
            (Array.isArray(selectedInicialCellsIDs) &&
                selectedInicialCellsIDs.length === 0);

        if (!allowSelectingCells) return;

        setSelectedCellsIDs((prev) => {
            if (prev.includes(h3id)) {
                return prev.filter((id) => id !== h3id);
            } else {
                return [...prev, h3id];
            }
        });
    }

    function handleToggleMapSize() {
        if (mapSize === "small") {
            document.body.style.overflow = "hidden";
            window.scrollTo(0, 0);
        }
        else {
            document.body.style.overflow = "auto";
        }
        
        setClassName(() =>
            mapSize === "small" ? bigMapClassName : smallMapClassName
        );
        setMapSize((prev) => (prev === "big" ? "small" : "big"));
    }

    useEffect(() => {
        handleSetSelectedCells(selectedCellsIDs);
    }, [selectedCellsIDs, handleSetSelectedCells]);

    useEffect(() => {
        if (map.current) map.current.remove();
        map.current = L.map(idMap, {
            zoomControl: !map4DownloadImage,
            attributionControl: !map4DownloadImage,
        });
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            minZoom: 4,
            maxZoom: 24,
            attribution:
                '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
        }).addTo(map.current);
        map.current.setView([51.509865, -0.118092], 10);
        if (selectedCellsIDs.length === 0) {
            // get user gps position 
            // set zoom to 13
            map.current.locate({ setView: true, maxZoom: 13 });
            map.current.on("locationfound", (e) => {
                // set zoom to 13
                map.current.setView(e.latlng, 13);
            });
        } else {
            const polygonVertex = h3.cellsToMultiPolygon(
                selectedCellsIDs,
                false
            );
            const bounds = L.latLngBounds(polygonVertex);
            map.current.fitBounds(bounds);
        }
    }, [className]);

    useEffect(() => {
        const allowSelectingCells =
            !selectedInicialCellsIDs ||
            (Array.isArray(selectedInicialCellsIDs) &&
                selectedInicialCellsIDs.length === 0);

        if (allowSelectingCells) return;

        for (const h3id of selectedCellsIDs) {
            if (!h3.isValidCell(h3id)) {
                console.error(`Invalid H3 ID: ${h3id}`);
                return;
            }
        }

        const polygonVertex = h3.cellsToMultiPolygon(selectedCellsIDs, false);
        const bounds = L.latLngBounds(polygonVertex);

        map.current.fitBounds(bounds);

        setSelectedCellsIDs(selectedCellsIDs);
    }, [selectedCellsIDs]);

    useEffect(() => {
        function updateMapDisplay() {
            if (!map.current) return;

            const allowSelectingCells =
                !selectedInicialCellsIDs ||
                (Array.isArray(selectedInicialCellsIDs) &&
                    selectedInicialCellsIDs.length === 0);

            if (hexLayer.current) {
                hexLayer.current.remove();
            }

            hexLayer.current = L.layerGroup().addTo(map.current);

            const zoom = map.current.getZoom();
            const currentH3Res = getH3ResForMapZoom(zoom);
            const { _southWest: sw, _northEast: ne } = map.current.getBounds();

            const padding = 1;
            const extraPaddingLat = (ne.lat - sw.lat) * padding;
            const extraPaddingLng = (ne.lng - sw.lng) * padding;

            const boundsPolygon = [
                [sw.lat - extraPaddingLat, sw.lng - extraPaddingLng],
                [ne.lat + extraPaddingLat, sw.lng - extraPaddingLng],
                [ne.lat + extraPaddingLat, ne.lng + extraPaddingLng],
                [sw.lat - extraPaddingLat, ne.lng + extraPaddingLng],
                [sw.lat - extraPaddingLat, sw.lng - extraPaddingLng],
            ];

            if (allowSelectingCells) {
                for (const h3id of selectedCellsIDs) {
                    const polygonLayer = L.layerGroup().addTo(hexLayer.current);

                    const h3Bounds = h3.cellToBoundary(h3id);

                    // MAPS WITH USER SELECTED CELLS
                    // selected cells by user
                    L.polygon(h3BoundsToPolygon(h3Bounds), {
                        fillColor: "black",
                        fillOpacity: 0.5,
                        stroke: false,
                    }).addTo(polygonLayer);
                }

                const h3s = h3.polygonToCells(boundsPolygon, currentH3Res);
                for (const h3id of h3s) {
                    const polygonLayer = L.layerGroup().addTo(hexLayer.current);

                    const h3Bounds = h3.cellToBoundary(h3id);

                    L.polygon(h3BoundsToPolygon(h3Bounds), {
                        weight: 1.5,
                        fillOpacity: 0.1,
                    })
                        .on("click", () => handleClickCell(h3id))
                        .addTo(polygonLayer);
                }
            } else {
                // allowSelectingCells === false

                // MAPS WITH ALREADY SELECTED CELLS
                const color = "black";
                const config = {
                    fillColor: color,
                    fillOpacity: 0.4,
                    stroke: true,
                    color: color,
                    weight: 5,
                };
                if (selectedCellsIDs.length > 0) {
                    const selectedCellsJSON = selectedCellsIDs.map((id) => {
                        const h3Bounds = h3.cellToBoundary(id);

                        const h3BoundsPolygon = h3BoundsToPolygon(h3Bounds);
                        return L.polygon(h3BoundsPolygon, {}).toGeoJSON();
                    });

                    if (selectedCellsJSON.length === 1) {
                        L.geoJSON(selectedCellsJSON[0], config).addTo(
                            hexLayer.current
                        );
                    } else {
                        const unioned = union(
                            featureCollection(selectedCellsJSON)
                        );
                        const multiPolygon = L.geoJSON(unioned)
                            .getLayers()[0]
                            .getLatLngs();

                        L.polygon(multiPolygon, config).addTo(hexLayer.current);
                    }
                }
            }
        }

        if (!map.current) return;

        const debouncedUpdateMapDisplay = debounce(updateMapDisplay, 200);

        map.current.on("moveend", debouncedUpdateMapDisplay);

        updateMapDisplay();

        return () => {
            map.current.off("moveend", debouncedUpdateMapDisplay);
        };
    }, [map.current, selectedCellsIDs, className]);

    return (
        <>
            <div className={className}>
                <div id={idMap} className='w-fill h-full'>
                    {allowMapResize && (
                        <button
                            className='absolute z-[2000] p-1 right-0 mt-[10px] mr-[10px] bg-slate-100 rounded flex items-center justify-center'
                            onClick={handleToggleMapSize}
                        >
                            {mapSize === "big" ? (
                                <WindowSizeDecrease />
                            ) : (
                                <WindowSizeIncrease />
                            )}
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}

export default Map;

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
