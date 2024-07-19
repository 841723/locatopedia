import { useEffect, useState } from 'react';
import { useMap, useMapEvents, Polygon } from 'react-leaflet';
import PropTypes from 'prop-types';

const sideMapRelations = {
    1: 32.768,
    2: 16.384,
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
    16: 0.001,
    17: 0.0005,
    18: 0.00025,
}


export function GridOverlay() {
    const map = useMap();
    const [sideLength, setSideLength] = useState(sideMapRelations[map.getZoom()]);
    const [grid, setGrid] = useState([]);
    const [selected, setSelected] = useState([]);

    const callback = (positions) => {
        setSelected((prev) => {
            const newSelected = [...prev];
            // mirar si hay algúna celda seleccionada dentro de este cuadrado
            const [latNW, lngNW] = positions[0];
            const [latSE, lngSE] = positions[2];

            const toRemove = newSelected.filter(([dNW, dSE]) => {
                return latNW <= dNW[0] && dSE[0] <= latSE && lngNW <= dNW[1] && dSE[1] <= lngSE;
            });

            toRemove.forEach((pos) => {
                const idx = newSelected.findIndex((pos2) => pos2 === pos);
                newSelected.splice(idx, 1);
            });

            // mirar si este cuadrado ya está seleccionado
            const idx = newSelected.findIndex((pos) => pos === positions);
            if (idx === -1) {
                newSelected.push(positions);
            } else {
                newSelected.splice(idx, 1);
            }

            console.log(newSelected);
            return newSelected;
        });
    }

    useMapEvents({
        zoomend() {
            const zoom = map.getZoom();
            setSideLength(sideMapRelations[zoom]);
        },
    });

    useEffect(() => {


        const updateGrid = () => {
            const bounds = map.getBounds();
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
            <Polygon positions={selected} pathOptions={{ color: 'black', fillColor:'red' }} />
            {grid.map((square, idx) => (
                <GridCell key={idx} positions={square} callback={callback} />
            ))}
        </>
    );
}


function GridCell({ positions,callback }) {

    const handleClick = () => {
        callback(positions);
    }

    return (
        <Polygon eventHandlers={{ click: handleClick }} positions={positions} fillColor={"#00000000"} pathOptions={{color:"black"}} weight={1} />
    )
}
GridCell.propTypes = {
    positions: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    callback: PropTypes.func.isRequired,
}
