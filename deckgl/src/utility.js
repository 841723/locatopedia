import WebMercatorViewport from "viewport-mercator-project"
import { polyfill } from "h3-js"

/**
 * Taken from https://stackoverflow.com/questions/56646664/how-can-i-get-the-h3-hexagons-on-a-react-map-gl-deck-gl-viewport
 *
 * @param {Object} viewport
 *
 * @returns - bounding box for the given viewport
 */

export function bboxFromViewport(viewport) {
    const projection = new WebMercatorViewport(viewport)
    const { height, width } = viewport

    const [west, north] = projection.unproject([0, 0])
    const [east, south] = projection.unproject([width, height])

    return { north, south, east, west }
}

/**
 *
 * @param {Object} - bounding box dimensions
 * @param {Number} resolution - resolution of hexagons
 
* @returns - an array of h3 indices within the given bounding box
 */
export function getH3IndicesForBB(
    { north, south, east, west },
    resolution = 12
) {
    const nw = [north, west]
    const ne = [north, east]
    const sw = [south, west]
    const se = [south, east]

    const hexes = polyfill([nw, ne, se, sw], resolution)

    return hexes
}

/**
 *
 * @param {*} multipolygon
 * @returns
 */

export function getGeoJson(multipolygon) {
    const geoJsonFormat = {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "MultiPolygon",
                    coordinates: multipolygon,
                },
            },
        ],
    }

    return JSON.stringify(geoJsonFormat)
}
