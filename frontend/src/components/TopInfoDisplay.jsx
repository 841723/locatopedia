import { use } from "react";
import { TopInfoDisplayContext } from "../context/TopInfoDisplay";

export function TopInfoDisplay() {
    const { state, text, setState } = use(TopInfoDisplayContext);

    const invisibleHeight = state == 0 ? "h-0" : 
                            state == 1 ? "h-1" :
                            state == 2 ? "h-12" : ""; 

    return (
        state > 0 && (
            <>
                <div className='fixed z-50 w-full h-12'>
                    {state == 1 && (
                        <div
                            className='my-auto h-1 bg-green-400 origin-left animate-fill w-full rounded-full will-change-transform'
                            style={{ transform: "translateX(-100%)" }}
                        />
                    )}
                    {state == 2 && (
                        <div className='w-full h-12 bg-green-200'>
                            <div className='h-full flex justify-between max-w-screen-lg mx-auto text-lg font-bold text-green-800 items-center px-4 md:p-0'>
                                <span id='loader-text' className=''>
                                    {text}
                                </span>

                                <button
                                    onClick={() => {
                                        setState(0);
                                    }}
                                >
                                    &times;
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className={`${invisibleHeight} w-full`} />
            </>
        )
    );
}
