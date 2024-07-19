import { Marker } from "react-leaflet";
import PropTypes from "prop-types";


export function CustomMarker({ children, position}) {
    return (
        <Marker position={position}>
            {children}
        </Marker>
    );
}

CustomMarker.propTypes = {
    children: PropTypes.node,

    // expects an object with lat and lng properties
    position: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
    }).isRequired,
}