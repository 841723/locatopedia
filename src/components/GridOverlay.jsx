import { useEffect, useState } from 'react';
import { useMap, Polygon, useMapEvents } from 'react-leaflet';
import PropTypes from 'prop-types';

const sideMapRelations = {
    1: 16.384,
    2: 12.288,
    3: 8.192,
    4: 4.096,
    5: 2.048,
    6: 1.024,
    7: 0.512,
    8: 0.256,
    9: 0.128,
    10: 0.064,
    11: 0.032,
    12: 0.016,
    13: 0.008,
    14: 0.004,
    15: 0.002,
    16: 0.0010,
    17: 0.0005,
    18: 0.0002,
}


export function GridOverlay() {
    const map = useMap();
    const [grid, setGrid] = useState([]);
    const [sideLength, setSideLength] = useState(0.001);

    useMapEvents({
        zoomend() {
            const zoom = map.getZoom();
            console.log(zoom);
            console.log(sideMapRelations[zoom]);
            setSideLength(sideMapRelations[zoom]);
        },
    });

    useEffect(() => {


        const updateGrid = () => {
            const bounds = map.getBounds();
            console.log(bounds);
            const minLat = Math.floor(bounds.getSouthWest().lat / sideLength) * sideLength;
            const maxLat = Math.ceil(bounds.getNorthEast().lat / sideLength) * sideLength;
            const minLng = Math.floor(bounds.getSouthWest().lng / sideLength) * sideLength;
            const maxLng = Math.ceil(bounds.getNorthEast().lng / sideLength) * sideLength;

            const newGrid = [];
            for (let lat = minLat; lat < maxLat; lat += sideLength) {
                for (let lng = minLng; lng < maxLng; lng += sideLength) {
                    newGrid.push([
                        [lat, lng],
                        [lat, lng + sideLength],
                        [lat + sideLength, lng + sideLength],
                        [lat + sideLength, lng],
                    ]);
                }
            }

            setGrid(newGrid);
        };

        map.on('moveend', updateGrid);
        updateGrid(); // Inicializa la malla en el montaje del componente

        return () => {
            map.off('moveend', updateGrid);
        };
    }, [map, sideLength]);

    return (
        <>
            {grid.map((square, idx) => (
                <GridCell key={idx} positions={square}/>
            ))}
        </>
    );
}


function GridCell({ positions }) {
    const [marked, setMarked] = useState(false);

    const color = marked ? 'white' : 'black';

    const handleClick = () => {
        console.log('click cell');
        setMarked((prev) => !prev);
    }

    return (
        <Polygon eventHandlers={{ click: handleClick }} positions={positions} pathOptions={{color:color}} weight={1} />
    )
}
GridCell.propTypes = {
    positions: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
}
