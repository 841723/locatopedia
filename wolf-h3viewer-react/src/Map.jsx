import { useEffect, useState, useRef } from "react";

export function Map() {

    const [map, setMap] = useState(undefined);
    var hexLayer = useRef(null);
    const [selectedCellsIDs, setSelectedCellsIDs] = useState([]);

    const [showSelected, setShowSelected] = useState(true);

    useEffect(() => {
        const m = L.map('mapid');

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            minZoom: 5,
            maxZoom: 24,
            attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
        }).addTo(m);

        m.setView([40.5956, 0.5690], 17);
        setMap(m);
    }, []);

    const GeoUtils = {
        EARTH_RADIUS_METERS: 6371000,
        radiansToDegrees: (r) => r * 180 / Math.PI,
        degreesToRadians: (d) => d * Math.PI / 180,
        getDistanceOnEarthInMeters: (lat1, lon1, lat2, lon2) => {
            const lat1Rad = GeoUtils.degreesToRadians(lat1);
            const lat2Rad = GeoUtils.degreesToRadians(lat2);
            const lonDelta = GeoUtils.degreesToRadians(lon2 - lon1);
            const x = Math.sin(lat1Rad) * Math.sin(lat2Rad) +
                Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.cos(lonDelta);
            return GeoUtils.EARTH_RADIUS_METERS * Math.acos(Math.max(Math.min(x, 1), -1));
        }
    };

    const ZOOM_TO_H3_RES_CORRESPONDENCE = {
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
        return ZOOM_TO_H3_RES_CORRESPONDENCE[mapZoom] ?? Math.floor((mapZoom - 1) * 0.7);
    };

    const h3BoundsToPolygon = (lngLatH3Bounds) => {
        lngLatH3Bounds.push(lngLatH3Bounds[0]); // "close" the polygon
        return lngLatH3Bounds;
    };

    function computeAverageEdgeLengthInMeters(vertexLocations) {
        let totalLength = 0;
        let edgeCount = 0;
        for (let i = 1; i < vertexLocations.length; i++) {
            const [fromLat, fromLng] = vertexLocations[i - 1];
            const [toLat, toLng] = vertexLocations[i];
            const edgeDistance = GeoUtils.getDistanceOnEarthInMeters(fromLat, fromLng, toLat, toLng);
            totalLength += edgeDistance;
            edgeCount++;
        }
        return totalLength / edgeCount;
    }

    function handleClickCell(h3id) {
        setSelectedCellsIDs(prev => {
            if (prev.includes(h3id)) {
                return prev.filter((id) => id !== h3id);
            } else {
                return [...prev, h3id];
            }
        });
    }

    useEffect(() => {
        if (!map) return;

        function updateMapDisplay() {
            if (hexLayer.current) {
                hexLayer.current.remove();
            }

            hexLayer.current = L.layerGroup().addTo(map);

            const zoom = map.getZoom();
            const currentH3Res = getH3ResForMapZoom(zoom);
            const { _southWest: sw, _northEast: ne } = map.getBounds();

            const padding = 0.1;
            const extraPaddingLat = (ne.lat - sw.lat) * padding;
            const extraPaddingLng = (ne.lng - sw.lng) * padding;

            const boundsPolygon = [
                [sw.lat - extraPaddingLat, sw.lng - extraPaddingLng],
                [ne.lat + extraPaddingLat, sw.lng - extraPaddingLng],
                [ne.lat + extraPaddingLat, ne.lng + extraPaddingLng],
                [sw.lat - extraPaddingLat, ne.lng + extraPaddingLng],
                [sw.lat - extraPaddingLat, sw.lng - extraPaddingLng],
            ];

            if (showSelected) {
                for (const h3id of selectedCellsIDs) {
                    const polygonLayer = L.layerGroup().addTo(hexLayer.current);
    
                    const h3Bounds = h3.cellToBoundary(h3id);
    
                    L.polygon(h3BoundsToPolygon(h3Bounds), { fillColor: "black", fillOpacity: 1, stroke: false })
                        .addTo(polygonLayer);
                }
            }


            const h3s = h3.polygonToCells(boundsPolygon, currentH3Res);

            for (const h3id of h3s) {
                const polygonLayer = L.layerGroup().addTo(hexLayer.current);

                const h3Bounds = h3.cellToBoundary(h3id);

                const style = !showSelected && !selectedCellsIDs.includes(h3id) ? { fillColor: "red", fillOpacity: 0.9, stroke: false } : { fillOpacity: 0.1, weight: 1 };

                const h3Polygon = L.polygon(h3BoundsToPolygon(h3Bounds), style)
                    .on('click', () => handleClickCell(h3id))
                    .addTo(polygonLayer);

                if (false) {
                    var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    svgElement.setAttribute('xmlns', "http://www.w3.org/2000/svg");
                    svgElement.setAttribute('viewBox', "0 0 200 200");
                    svgElement.innerHTML = `<text x="20" y="70" class="h3Text">${h3id}</text>`;
                    var svgElementBounds = h3Polygon.getBounds();
                    L.svgOverlay(svgElement, svgElementBounds).addTo(polygonLayer);
                }
            }
        }

        if (!map) return;

        const debouncedUpdateMapDisplay = debounce(updateMapDisplay, 200);

        map.on("moveend", debouncedUpdateMapDisplay);

        updateMapDisplay();

        return () => {
            map.off("moveend", debouncedUpdateMapDisplay);
        };
    }, [map, selectedCellsIDs, showSelected]);

    return (
        <>
            <div id="mapid" style={{ height: "90vh", width: "100vw" }}></div>
            <button onClick={() => console.log(selectedCellsIDs)}>selectedCellsIDs</button>
            <button onClick={() => setShowSelected((prev) => !prev)}>invert colors</button>
            <button onClick={() => setSelectedCellsIDs([])}>clear selected</button>
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

