import { use } from "react";
import { TopInfoDisplayContext } from "../context/TopInfoDisplay";

export function TopInfoDisplay() {
    const { state, text, setState } = use(TopInfoDisplayContext);
    return (
        state > 0 && (
            <>
                <div className='fixed z-50 w-full h-8'>
                    {state == 1 && (
                        <div
                            className='my-auto h-1 bg-green-400 origin-left animate-fill w-full rounded-full will-change-transform'
                            style={{ transform: "translateX(-100%)" }}
                        />
                    )}
                    {state == 2 && (
                        <div className='w-full h-8 bg-green-100'>
                            <div className='flex justify-between max-w-screen-lg mx-auto text-lg font-bold text-green-500 items-center'>
                                <span id='loader-text' className=''>
                                    {text}
                                </span>

                                <button onClick={() => {setState(0)}}>&times;</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className='h-8 w-full' />
            </>
        )
    );
}
