export function parseTextToObjects(text) {
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

export function parseObjectsToText(objects) {
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
