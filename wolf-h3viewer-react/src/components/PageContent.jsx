export function PageContent({ contents }) {
    console.log(contents)

    if (!contents) {
        return null
    }

    const identation = 'ml-10'

    return (
        <div>
            {contents.map((header1, index) => (
                <div key={index}>
                    <h3 className="text-2xl font-semibold">{header1.headerName}</h3>
                    <div>{header1.content}</div>

                    {header1.headersInside.map((header2, index) => (
                        <div className={identation} key={index}>
                            <h4 className="text-[22px] font-semibold">{header2.headerName}</h4>
                            <div>{header2.content}</div>
                    
                            {header2.headersInside.map((header3, index) => (
                                <div className={identation} key={index}>
                                    <h5 className="text-xl font-medium">{header3.headerName}</h5>
                                    <div>{header3.content}</div>
                    
                                    {header3.headersInside.map((header4, index) => (
                                        <div className={identation} key={index}>
                                            <h6 className="text-lg font-semibold">{header4.headerName}</h6>
                                            <div>{header4.content}</div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}
