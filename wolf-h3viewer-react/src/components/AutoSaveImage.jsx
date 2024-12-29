import { toSvg } from "html-to-image";
import { useImperativeHandle, useRef } from "react";

export function AutoSaveImage ({children, ref: mapImageRef}) {
    const ref = useRef(null);    

    useImperativeHandle(mapImageRef, () => ({
        async saveImage() {
            if (ref.current) {
                console.log('ref.current', ref.current);
                const elements = ref.current.children[0].children;
                for (const element of elements) {
                    if (element.className !== "leaflet-pane leaflet-overlay-pane") {
                        element.remove();
                    }
                }

                // console.log('ref.current.children[0]', ref.current.children[0]);
                // ref.current.children[0].clean2save();

                const buttons = ref.current.querySelectorAll("button");
                buttons.forEach((button) => button.remove());

                return toSvg(ref.current, { quality: 1 })
                    .then((dataUrl) => {
                        return dataUrl;
                    })
                    .catch((err) => {
                        console.error("Error capturing the image:", err);
                    });
            }
        }
    }));

    return (
        <div>
            <div ref={ref}>
                {children}
            </div>
        </div>
    );
};