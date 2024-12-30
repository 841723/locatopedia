import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/basic/Button";

export function LogIn({ loggedIn }) {
    const navigate = useNavigate();

    const toggleViewLogIn = () => {
        navigate("/");
    };
    const login = useGoogleLogin({
        onSuccess: (res) => loggedIn(res),
        onFailure: (res) => console.error(res),
        flow: "auth-code",
    });

    return (
        <>
            {/* <div
                className='absolute w-screen h-screen bg-black/40 top-0 left-0 z-0'
                onClick={toggleViewLogIn}
            />
            <div className='z-10 absolute flex flex-col p-4 bg-white w-4/5 h-4/5 rounded top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white'>
                <div className='flex justify-end text-black'>
                    <h1 className='grow text-5xl text-center font-semibold'>
                        Log In
                    </h1>
                    <button className='text-2xl' onClick={toggleViewLogIn}>
                        x
                    </button>
                </div>
                <div className='w-full grow flex justify-center items-center'>
                    <GoogleLogin
                        onSuccess={(res) => loggedIn(res)}
                        onFailure={(res) => console.error(res)}
                    />
                </div>
            </div> */}
            {/* <div
                className='absolute w-screen h-screen bg-black/40 top-0 left-0 -z-10'
                onClick={toggleViewLogIn}
            /> */}
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md z-10 p-8 bg-white flex flex-col gap-4 items-center justify-center'>
                <button
                    onClick={login}
                    className='h-fit bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 border border-gray-300 flex items-center font-normal text-lg'
                >
                    {GoogleLogo("w-6 h-6 mr-2 inline-block")}
                    Sign up / Log In with Google
                </button>

                <button
                    onClick={toggleViewLogIn}
                    className='mt-20 h-fit bg-white text-black px-2 py-1 rounded-md hover:bg-gray-200 border border-gray-300 flex items-center text-sm'
                >
                    cancel
                </button>
            </div>
        </>
    );
}

const GoogleLogo = (className) => {
    return (
        <svg version='1.1' viewBox='0 0 48 48' className={className}>
            <g>
                <path
                    fill='#EA4335'
                    d='M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'
                ></path>
                <path
                    fill='#4285F4'
                    d='M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'
                ></path>
                <path
                    fill='#FBBC05'
                    d='M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z'
                ></path>
                <path
                    fill='#34A853'
                    d='M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z'
                ></path>
                <path fill='none' d='M0 0h48v48H0z'></path>
            </g>
        </svg>
    );
};
