import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

export function LogIn({ loggedIn }) {
    const navigate = useNavigate();

    const toggleViewLogIn = () => {
        navigate("/");
    };

    return (
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md z-10 p-8 bg-white flex flex-col gap-4 items-center justify-center'>
            <GoogleLogin
                locale="en"
                shape='rect'
                width="300"
                text='continue_with'
                onSuccess={(res) => loggedIn(res)}
                onFailure={(res) => console.error(res)}
            />

            <button
                onClick={toggleViewLogIn}
                className='mt-20 h-fit bg-white text-black px-2 py-1 rounded-md hover:bg-gray-200 border border-gray-300 flex items-center text-sm'
            >
                cancel
            </button>
        </div>
    );
}
