import { useState } from "react";
import { MapContainer, TileLayer, Tooltip, useMapEvents } from "react-leaflet";
import {CustomMarker} from "../components/CustomMarker";
import { GridOverlay } from "../components/GridOverlay";




export function Map() {

    function LocationMarker() {
        const [position, setPosition] = useState(null);
        useMapEvents({
            click(e) {
                setPosition(e.latlng);
            },
        });

        return position === null ? null : (
            <CustomMarker position={position}>
                <Tooltip direction="top" offset={[-15,-15]} opacity={1} permanent>
                    <div>
                        Latitude: {position.lat.toFixed(4)} <br />
                        Longitude: {position.lng.toFixed(4)}
                    </div>
                </Tooltip>
            </CustomMarker>
        );
    }

    return (
        <MapContainer center={[40.5956, 0.5690]} zoom={20} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />

            <GridOverlay />

        </MapContainer>
    );
}
