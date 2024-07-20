import { Map } from '@/components/Map'
import { PageContent } from '@/components/PageContent'
import { useEffect, useState } from 'react';

const textContent = `
Hi everyone, this is a test page for the h3viewer project.
This page is a demo of a wikiplace page, where you can see the content of a page and edit it.


# Header 1
This is the content of header 1

## Header 1.1
This is the content of header 1.1

## Header 1.3
This is the content of header 1.3

### Header 1.1.1
This is the content of header 1.1.1

#### Header 1.1.1.1
This is the content of header 1.1.1.1
Lorem ipsum dolor sit amet, consectetur adipiscing elit

### Header 1.1.2
This is the content of header 1.1.2

## Header 1.2
This is the content of header 1.2

# Header 2
This is the content of header 2

## Header 2.1
This is the content of header 2.1

## Header 2.2
This is the content of header 2.2

    `



export function Page() {

    const [contents, setContents] = useState(parseTextToObjects(textContent));
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        if (editing) {
            document.getElementById('editPageForm').scrollIntoView({ behavior: 'smooth' });
        }
    }, [editing]);

    return (
        <>
            <div className='flex justify-between mb-4'>
                <div>
                    <h1 className='text-4xl font-medium'>Título de la página</h1>
                    <h2 className='mt-1 text-xl text-gray-600'>Este es el subtitulo de esta pagina</h2>
                </div>
                <div className='flex flex-col justify-end'>
                    <button
                        className='text-sm border border-gray-900 px-2 py-1 rounded-md transition hover:bg-gray-200'
                        onClick={() => setEditing((prev) => !prev)}
                    >
                        editar esta pagina
                    </button>
                </div>
            </div>
            
            <Map className={'w-full h-80'} selected={["883970125bfffff"]} />

            <hr className='w-full my-4 border border-gray-900'/>

            {
                editing ? (
                    <form
                        id='editPageForm'
                        onSubmit={(e) => {
                            e.preventDefault();
                            const text = e.target[0].value;
                            setContents(parseTextToObjects(text));
                            setEditing(false);
                        }}
                    >
                        <label className='block text-lg'>Contenido de la página</label>
                        <textarea
                            className='w-full h-80'
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
                )
                :
                    (<PageContent contents={contents} />)
            }
        </>
    )
}



function parseTextToObjects(text) {
    const lines = text.split('\n');
    const result = [];
    let currentObject = null;
    let currentSubHeader = null;
    let currentSubSubHeader = null;
    let currentSubSubSubHeader = null;

    let foundAnyHeader = false;

    for (const line of lines) {
        const trimmedLine = line.trim();

        if (trimmedLine.startsWith('# ') && !trimmedLine.startsWith('## ')) {
            if (currentObject) {
                if (currentSubSubSubHeader) {
                    currentSubSubHeader.headersInside.push(currentSubSubSubHeader);
                    currentSubSubSubHeader = null;
                }
                if (currentSubSubHeader) {
                    currentSubHeader.headersInside.push(currentSubSubHeader);
                    currentSubSubHeader = null;
                }
                if (currentSubHeader) {
                    currentObject.headersInside.push(currentSubHeader);
                    currentSubHeader = null;
                }
                result.push(currentObject);
            }
            currentObject = {
                headerName: trimmedLine.substring(2).trim(),
                content: '',
                headersInside: []
            };
        } else if (trimmedLine.startsWith('## ') && !trimmedLine.startsWith('### ')) {
            if (currentSubSubSubHeader) {
                currentSubSubHeader.headersInside.push(currentSubSubSubHeader);
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
                headerName: trimmedLine.substring(3).trim(),
                content: '',
                headersInside: []
            };
        } else if (trimmedLine.startsWith('### ') && !trimmedLine.startsWith('#### ')) {
            if (currentSubSubSubHeader) {
                currentSubSubHeader.headersInside.push(currentSubSubSubHeader);
                currentSubSubSubHeader = null;
            }
            if (currentSubSubHeader) {
                currentSubHeader.headersInside.push(currentSubSubHeader);
            }
            currentSubSubHeader = {
                headerName: trimmedLine.substring(4).trim(),
                content: '',
                headersInside: []
            };
        } else if (trimmedLine.startsWith('#### ')) {
            if (currentSubSubSubHeader) {
                currentSubSubHeader.headersInside.push(currentSubSubSubHeader);
            }
            currentSubSubSubHeader = {
                headerName: trimmedLine.substring(5).trim(),
                content: '',
                headersInside: []
            };
        } else {
            if (currentSubSubSubHeader) {
                currentSubSubSubHeader.content += line + '\n';
            } else if (currentSubSubHeader) {
                currentSubSubHeader.content += line + '\n';
            } else if (currentSubHeader) {
                currentSubHeader.content += line + '\n';
            } else if (currentObject) {
                currentObject.content += line + '\n';
            } else {
                currentObject = {
                    headerName: '',
                    content: line + '\n',
                    headersInside: []
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

    result.forEach(obj => {
        obj.content = obj.content.trim();
        obj.headersInside.forEach(subObj => {
            subObj.content = subObj.content.trim();
            subObj.headersInside.forEach(subSubObj => {
                subSubObj.content = subSubObj.content.trim();
                subSubObj.headersInside.forEach(subSubSubObj => {
                    subSubSubObj.content = subSubSubObj.content.trim();
                });
            });
        });
    });

    return result;
}

function parseObjectsToText(objects) {
    let result = '';
    objects.forEach(obj => {
        
        result += `# ${obj.headerName}\n${obj.content}\n`;
        obj.headersInside.forEach(subObj => {
            result += `## ${subObj.headerName}\n${subObj.content}\n`;
            subObj.headersInside.forEach(subSubObj => {
                result += `### ${subSubObj.headerName}\n${subSubObj.content}\n`;
                subSubObj.headersInside.forEach(subSubSubObj => {
                    result += `#### ${subSubSubObj.headerName}\n${subSubSubObj.content}\n`;
                });
            });
        });
    });
    return result;
}
