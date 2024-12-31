import { toPng, toSvg } from "html-to-image";
import { useImperativeHandle, useRef } from "react";

export function AutoSaveImage ({children, ref: mapImageRef}) {
    const ref = useRef(null);

    useImperativeHandle(mapImageRef, () => ({
        async saveImage() {
            if (ref.current) {
                
                return toSvg(ref.current, { quality: 1 })
                    .then((dataUrl) => {
                        return dataUrl;
                    })
                    .catch((err) => {
                        console.error("Error capturing the image:", err);
                    });
            }
        },
        async downloadImage() {
            if (ref.current) {
                console.log("ref.current", ref.current.children[0].children);
                const imgPng = await toPng(ref.current, { quality: 1 })
                const a = document.createElement("a");
                a.href = imgPng;
                a.download = "map.png";
                a.click();
            }
        }
    }));

    return (
        <div ref={ref}>
            {children}
        </div>
    );
};