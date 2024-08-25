import { useNavigate } from "react-router-dom";

export function LogIn({hideLogIn}) {
    const navigate = useNavigate();
    
    const toggleViewLogIn = () => {
        navigate('/')
    };
    return (
        <>
            <div
                className='absolute w-screen h-screen bg-black/40 top-0 left-0 z-0'
                onClick={toggleViewLogIn}
            />
            <div className='z-10 absolute flex flex-col p-4 bg-slate-600 w-4/5 h-4/5 rounded top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white'>
                <div className='flex justify-end'>
                    <h1 className='grow text-5xl text-center font-semibold'>
                        LogIn
                    </h1>
                    <button className='text-2xl' onClick={toggleViewLogIn}>
                        x
                    </button>
                </div>
                <div className='w-full grow flex justify-center items-center'>
                    <button className='text-slate-900 bg-slate-200 rounded p-2 text-lg hover:bg-slate-50 transition-colors'>
                        Log In with Google
                    </button>
                </div>
            </div>
        </>
    );
}