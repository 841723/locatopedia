import { Map } from "@/components/Map";
import { PageContent } from "@/components/PageContent";
import { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch.jsx";
import { useNavigate, useParams } from "react-router-dom";

export function Page() {
    const { id } = useParams();
    const navigate = useNavigate();
    let url = `http://localhost:3000/api/wiki?id=${id}`;

    const { data, loading, error } = useFetch(url);
    const [contents, setContents] = useState([]);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        if (error) {
            navigate("/");
        }
    }, [error]);

    useEffect(() => {
        if (data) {
            const res = parseTextToObjects(data.content);
            if (!res.OK) {
                console.error(res.error);
            } else {
                setContents(res.result);
            }
        }
    }, [data]);

    useEffect(() => {
        if (editing) {
            document
                .getElementById("editPageForm")
                .scrollIntoView({ behavior: "smooth" });
        }
    }, [editing]);

    if (loading || !data) {
        return <div>Loading..</div>;
    }

    const { title, subtitle } = data;

    return (
        <>
            <div className='flex justify-between mb-4'>
                <div>
                    <h1 className='text-4xl font-medium'>{title}</h1>
                    <h2 className='mt-1 text-xl text-gray-600'>{subtitle}</h2>
                </div>
                <div className='flex flex-col justify-end'>
                    <button
                        className='text-sm border border-gray-900 px-2 py-1 rounded-md transition hover:bg-gray-200'
                        onClick={() => setEditing((prev) => !prev)}
                    >
                        edit this page
                    </button>
                </div>
            </div>

            <Map className={"w-full h-80"} selected={["883970125bfffff"]} />

            <hr className='w-full my-4 border border-gray-900' />

            {editing ? (
                <form
                    id='editPageForm'
                    onSubmit={(e) => {
                        e.preventDefault();
                        const writtenText = e.target[0].value;
                        const res = parseTextToObjects(writtenText);
                        console.log("res", res);
                        if (!res.OK) {
                            console.error(res.error);
                        } else {
                            setContents(res.result);
                            setEditing(false);
                        }
                    }}
                >
                    <label className='block text-lg'>
                        Contenido de la página
                    </label>
                    <textarea
                        className='w-full h-80 p-2 border-2 border-gray-900'
                        defaultValue={parseObjectsToText(contents)}
                        autoComplete='off'
                        autoFocus
                    />
                    <button
                        className='text-sm border border-gray-900 px-2 py-1 rounded-md transition hover:bg-gray-200'
                        type='submit'
                    >
                        Guardar cambios
                    </button>
                </form>
            ) : (
                <PageContent contents={contents} />
            )}
        </>
    );
}

function parseTextToObjects(text) {
    if (!text) return [];

    const result = [];

    try {
        const lines = text.split("\n");
        let currentObject = null;
        let currentSubHeader = null;
        let currentSubSubHeader = null;
        let currentSubSubSubHeader = null;

        for (const line of lines) {
            const trimmedLine = line.trim();

            if (
                trimmedLine.startsWith("# ") &&
                !trimmedLine.startsWith("## ")
            ) {
                if (currentObject) {
                    if (currentSubSubSubHeader) {
                        currentSubSubHeader.headersInside.push(
                            currentSubSubSubHeader
                        );
                        currentSubSubSubHeader = null;
                    }
                    if (currentSubSubHeader) {
                        currentSubHeader.headersInside.push(
                            currentSubSubHeader
                        );
                        currentSubSubHeader = null;
                    }
                    if (currentSubHeader) {
                        currentObject.headersInside.push(currentSubHeader);
                        currentSubHeader = null;
                    }
                    result.push(currentObject);
                }
                currentObject = {
                    level: 1,
                    headerName: trimmedLine.substring(2).trim(),
                    content: "",
                    headersInside: [],
                };
            } else if (
                trimmedLine.startsWith("## ") &&
                !trimmedLine.startsWith("### ")
            ) {
                if (currentSubSubSubHeader) {
                    currentSubSubHeader.headersInside.push(
                        currentSubSubSubHeader
                    );
                    currentSubSubSubHeader = null;
                }
                if (currentSubSubHeader) {
                    currentSubHeader.headersInside.push(currentSubSubHeader);
                    currentSubSubHeader = null;
                }
                if (currentSubHeader) {
                    currentObject.headersInside.push(currentSubHeader);
                }
                currentSubHeader = {
                    level: 2,
                    headerName: trimmedLine.substring(3).trim(),
                    content: "",
                    headersInside: [],
                };
            } else if (
                trimmedLine.startsWith("### ") &&
                !trimmedLine.startsWith("#### ")
            ) {
                if (currentSubSubSubHeader) {
                    currentSubSubHeader.headersInside.push(
                        currentSubSubSubHeader
                    );
                    currentSubSubSubHeader = null;
                }
                if (currentSubSubHeader) {
                    currentSubHeader.headersInside.push(currentSubSubHeader);
                }
                currentSubSubHeader = {
                    level: 3,
                    headerName: trimmedLine.substring(4).trim(),
                    content: "",
                    headersInside: [],
                };
            } else if (trimmedLine.startsWith("#### ")) {
                if (currentSubSubSubHeader) {
                    currentSubSubHeader.headersInside.push(
                        currentSubSubSubHeader
                    );
                }
                currentSubSubSubHeader = {
                    level: 4,
                    headerName: trimmedLine.substring(5).trim(),
                    content: "",
                    headersInside: [],
                };
            } else {
                if (currentSubSubSubHeader) {
                    currentSubSubSubHeader.content += line + "\n";
                } else if (currentSubSubHeader) {
                    currentSubSubHeader.content += line + "\n";
                } else if (currentSubHeader) {
                    currentSubHeader.content += line + "\n";
                } else if (currentObject) {
                    currentObject.content += line + "\n";
                } else {
                    currentObject = {
                        level: 0,
                        headerName: "",
                        content: line + "\n",
                        headersInside: [],
                    };
                }
            }
        }

        if (currentObject) {
            if (currentSubSubSubHeader) {
                currentSubSubHeader.headersInside.push(currentSubSubSubHeader);
            }
            if (currentSubSubHeader) {
                currentSubHeader.headersInside.push(currentSubSubHeader);
            }
            if (currentSubHeader) {
                currentObject.headersInside.push(currentSubHeader);
            }
            result.push(currentObject);
        }

        result.forEach((obj) => {
            obj.content = obj.content.trim();
            obj.headersInside.forEach((subObj) => {
                subObj.content = subObj.content.trim();
                subObj.headersInside.forEach((subSubObj) => {
                    subSubObj.content = subSubObj.content.trim();
                    subSubObj.headersInside.forEach((subSubSubObj) => {
                        subSubSubObj.content = subSubSubObj.content.trim();
                    });
                });
            });
        });
        return { OK: true, result };
    } catch (e) {
        return { OK: false, error: e.message };
    }
}

function parseObjectsToText(objects) {
    let result = "";
    objects.forEach((obj) => {
        if (result === "" && obj.headerName === "") {
            result += obj.content + "\n";
        } else {
            result += `# ${obj.headerName}\n${obj.content}\n`;
            obj.headersInside.forEach((subObj) => {
                result += `## ${subObj.headerName}\n${subObj.content}\n`;
                subObj.headersInside.forEach((subSubObj) => {
                    result += `### ${subSubObj.headerName}\n${subSubObj.content}\n`;
                    subSubObj.headersInside.forEach((subSubSubObj) => {
                        result += `#### ${subSubSubObj.headerName}\n${subSubSubObj.content}\n`;
                    });
                });
            });
        }
    });
    return result;
}
