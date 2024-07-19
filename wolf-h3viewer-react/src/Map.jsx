import { useEffect, useState, useRef } from "react";

export function Map() {

    console.log("RENDERING MAP");

    const [map, setMap] = useState(undefined);
    var hexLayer = useRef(null);
    const [selectedCellsIDs, setSelectedCellsIDs] = useState(["8182bffffffffff", "8182fffffffffff"]);

    useEffect(() => {
        setMap(L.map('mapid'));
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
        if (selectedCellsIDs.includes(h3id)) {
            setSelectedCellsIDs(selectedCellsIDs.filter((id) => id !== h3id));
        }
        else {
            setSelectedCellsIDs((prev) => [...prev, h3id]);
        }
    }

    useEffect(() => {
        console.log("selectedCellsIDs changed to", selectedCellsIDs);
        if (!map) return;
        updateMapDisplay();
    }, [selectedCellsIDs]);

    function updateMapDisplay() {
        // console.log("updateMapDisplay - hexLayer", hexLayer);
        if (hexLayer.current) {
            hexLayer.current.remove();
        }

        hexLayer.current = L.layerGroup().addTo(map);

        const zoom = map.getZoom();
        const currentH3Res = getH3ResForMapZoom(zoom);
        const { _southWest: sw, _northEast: ne } = map.getBounds();

        // TODO: change padding to be based on the map size
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

        const h3s = h3.polygonToCells(boundsPolygon, currentH3Res);

        for (const h3id of h3s) {

            const polygonLayer = L.layerGroup()
                .addTo(hexLayer.current);

            if (h3id === "81823ffffffffff") {
                console.log ("selectedCellsIDs.includes(81823ffffffffff);", selectedCellsIDs.includes(h3id));
                console.log("selectedCellsIDs", selectedCellsIDs);
            }
            const isSelected = selectedCellsIDs.includes(h3id);

            const style = isSelected ? { fillColor: "orange" } : {};

            const h3Bounds = h3.cellToBoundary(h3id);
            const averageEdgeLength = computeAverageEdgeLengthInMeters(h3Bounds);
            const cellArea = h3.cellArea(h3id, "m2");

            const tooltipText = `
            Cell ID: <b>${h3id}</b>
            <br />
            Average edge length (m): <b>${averageEdgeLength.toLocaleString()}</b>
            <br />
            Cell area (m^2): <b>${cellArea.toLocaleString()}</b>
            `;

            const h3Polygon = L.polygon(h3BoundsToPolygon(h3Bounds), style)
                .on('click', () => handleClickCell(h3id))
                .bindTooltip(tooltipText)
                .addTo(polygonLayer);

            // less SVG, otherwise perf is bad
            if (true) {
                var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svgElement.setAttribute('xmlns', "http://www.w3.org/2000/svg");
                svgElement.setAttribute('viewBox', "0 0 200 200");
                svgElement.innerHTML = `<text x="20" y="70" class="h3Text">${h3id}</text>`;
                var svgElementBounds = h3Polygon.getBounds();
                L.svgOverlay(svgElement, svgElementBounds).addTo(polygonLayer);
            }
        }

        // setHexLayer(hexLayerTmp);
    }

    useEffect(() => {
        console.log("hexLayer changed to", hexLayer);
    }, [hexLayer]);

    function findH3() {
        if (!h3.isValidCell(searchH3Id)) {
            return;
        }
        const h3Boundary = h3.cellToBoundary(searchH3Id);

        let bounds = undefined;

        for ([lat, lng] of h3Boundary) {
            if (bounds === undefined) {
                bounds = new L.LatLngBounds([lat, lng], [lat, lng]);
            } else {
                bounds.extend([lat, lng]);
            }
        }

        map.fitBounds(bounds);

        const newZoom = H3_RES_TO_ZOOM_CORRESPONDENCE[h3.getResolution(searchH3Id)];
        map.setZoom(newZoom);
    }

    useEffect(() => {
        if (!map) return;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            minZoom: 5,
            maxNativeZoom: 19,
            maxZoom: 24,
            attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
        }).addTo(map);

        map.setView([0,0],5);
        map.on("moveend", updateMapDisplay);

        updateMapDisplay();

        return () => {
            map.off("moveend", updateMapDisplay);
        }
    }, [map]);

    return (
        <>
            <div id="mapid" style={{ height: "90vh", width: "100vw" }}></div>
            <button onClick={() => console.log(selectedCellsIDs)}>selectedCellsIDs</button>
            <button onClick={() => console.log(selectedCellsIDs.includes("81823ffffffffff"))}>selectedCellsIDs.includes("81823ffffffffff")</button>
        </>
    );
}

export default Map;