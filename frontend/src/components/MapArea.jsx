/* eslint-disable no-undef */
import { useEffect, useState, useRef } from "react";
import * as turf from "@turf/turf";
import {
    WindowSizeDecrease,
    WindowSizeIncrease,
} from "@/components/basic/icons/WindowResize";
import { debounce } from "@/lib/debounce";

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
export function MapArea({
    allowMapResize = true,
    initialMapSize = "small",
    idMap = "mapidarea",
    handleChangePolygon,
}) {
    const smallMapClassName = "w-full h-80";
    const bigMapClassName =
        "absolute bottom-0 left-0 w-screen h-[calc(100dvh-80px)] md:h-[calc(100dvh-96px)] z-10";

    const [mapSize, setMapSize] = useState(initialMapSize);
    const [className, setClassName] = useState(
        mapSize === "big" ? bigMapClassName : smallMapClassName
    );
    const [mapPosition, setMapPosition] = useState(null);

    var map = useRef(null);
    var pointLayer = useRef(null);
    var selectedPoints = useRef(null);


    const circleIcon = L.divIcon({
        className: "custom-icon",
        html: '<div class="size-3 bg-white border-2 border-black rounded-full shadow-md"></div>',
        iconSize: [12, 12],
        iconAnchor: [6, 6],
    });

    function handleToggleMapSize() {
        if (mapSize === "small") {
            document.body.style.overflow = "hidden";
            window.scrollTo(0, 0);
        } else {
            document.body.style.overflow = "auto";
        }

        setClassName(() =>
            mapSize === "small" ? bigMapClassName : smallMapClassName
        );
        setMapSize((prev) => (prev === "big" ? "small" : "big"));
    }

    function handleMarkerClick(e) {
        console.log("marker clicked", e);
        const { lat, lng } = e.latlng;

        selectedPoints.current = selectedPoints.current.filter(
            (point) => point[0] !== lat || point[1] !== lng
        );

        handleMapClick();
    }

    function handleMapClick(e) {

        if (!selectedPoints.current) {
            selectedPoints.current = [];
        }

        if (e) {
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;
            selectedPoints.current.push([lat, lng]);
        }

        if (!pointLayer.current) {
            pointLayer.current = L.layerGroup().addTo(map.current);
        } else {
            pointLayer.current.clearLayers();
        }

        if (selectedPoints.current.length > 2) {
            const turfPoints = {
                type: "FeatureCollection",
                features: selectedPoints.current.map((point) => ({
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: point,
                    },
                    properties: {},
                })),
            };

            const polygon = turf.convex(turfPoints);

            if (polygon) {
                L.polygon(polygon.geometry.coordinates, {
                    color: "blue",
                    fillColor: "lightblue",
                    fillOpacity: 0.5,
                }).addTo(pointLayer.current);

                const vertex = polygon.geometry.coordinates[0];

                handleChangePolygon(vertex);

                vertex.forEach((point) => {
                    const marker = L.marker(point, { icon: circleIcon }).addTo(
                        pointLayer.current
                    );
                    marker.on("click", handleMarkerClick);
                });
            }
        } else {
            handleChangePolygon(null);

            selectedPoints.current.forEach((point) => {
                const marker = L.marker(point, { icon: circleIcon }).addTo(
                    pointLayer.current
                );
                marker.on("click", handleMarkerClick);
            });
        }
    }

    useEffect(() => {
        const handleMoveEnd = () => {
            console.log("moveend");
            setMapPosition({
                position: map.current.getCenter(),
                zoom: map.current.getZoom(),
            });
        };
        if (map.current) {
            map.current.addEventListener("moveend", handleMoveEnd);
        } else {
            console.log("map.current is null");
        }
        return () => map.current?.removeEventListener("moveend", handleMoveEnd);
    }, [map.current]);

    useEffect(() => {
        if (map.current) map.current.remove();

        map.current = L.map(idMap, {
            zoomControl: true,
            attributionControl: true,
        });
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            minZoom: 4,
            maxZoom: 24,
            attribution:
                '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
        }).addTo(map.current);

        map.current.setView([41.64739040268027, -0.882854461669922], 13);
        if (mapPosition) {
            map.current.setView(mapPosition.position, mapPosition.zoom);
        }
    }, [className]);

    useEffect(() => {
        function updateMapDisplay() {
            if (!map.current) return;

            const zoom = map.current.getZoom();
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
        }

        if (!map.current) return;

        const debouncedUpdateMapDisplay = debounce(updateMapDisplay, 200);

        map.current.on("moveend", debouncedUpdateMapDisplay);
        map.current.on("click", handleMapClick);

        updateMapDisplay();

        return () => {
            map.current.off("moveend", debouncedUpdateMapDisplay);
            map.current.off("click", handleMapClick);
        };
    }, [className]);

    return (
        <>
            <div className={className}>
                <div id={idMap} className='w-fill h-full relative'>
                    {allowMapResize && (
                        <button
                            className='absolute z-[2000] p-1 right-0 mt-[10px] mr-[10px] bg-slate-100 rounded flex items-center justify-center text-black'
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
