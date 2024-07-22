import { useState } from "react";

const levels = {
    1: {
        as: "h3",
        className: "text-2xl font-semibold mt-2",
    },
    2: {
        as: "h4",
        className: "text-[22px] font-semibold mt-2",
    },
    3: {
        as: "h5",
        className: "text-xl font-medium mt-2",
    },
    4: {
        as: "h6",
        className: "text-lg font-semibold mt-2",
    },
};

function getHeader(header) {
    switch (header.level) {
        case 0:
            return null;
        case 1:
            return <h3 className={levels[1].className}>{header.headerName}</h3>;
        case 2:
            return <h4 className={levels[2].className}>{header.headerName}</h4>;
        case 3:
            return <h5 className={levels[3].className}>{header.headerName}</h5>;
        case 4:
            return <h6 className={levels[4].className}>{header.headerName}</h6>;
        default:
            return null;
    }
}

export function PageContent({ contents }) {
    if (!contents) {
        return null;
    }

    return (
        <div>
            {contents.map((header, index) => (
                <HeaderAndContent key={index} header={header} />
            ))}
        </div>
    );
}

function HeaderAndContent({ header }) {
    const [expanded, setExpanded] = useState(true);
    const identation = "";
    return (
        <div>
            <button
                className='flex items-center'
                onClick={() => setExpanded((prev) => !prev)}
            >
                {getHeader(header)}
            </button>

            <div className={`${expanded ? "block" : "hidden"}`}>
                <TextContent text={header.content} />
                <div className={identation}>
                    <PageContent contents={header.headersInside} />
                </div>
            </div>
        </div>
    );
}

function TextContent({ text }) {
    const lines = text.split("\n");
    return (
        <div>
            {lines.map((line, index) => (
                <p key={index}>{line}</p>
            ))}
        </div>
    );
}
