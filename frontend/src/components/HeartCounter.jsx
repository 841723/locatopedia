import { Heart } from "@/components/basic/icons/Heart";
import { useState, use } from "react";
import { useNavigate } from "react-router-dom";

import { BACKEND_API_URL } from "@/lib/env.js";
import { AccountContext } from "@/context/Account";
import { userfetch } from "@/hooks/useFetch";

export function HeartCounter({initialLikes, initialLiked, hash, email}) {
    const { getToken } = use(AccountContext);
    const token = getToken();
    const navigate = useNavigate();
    const [liked, setLiked] = useState(initialLiked);
    const [likes, setLikes] = useState(Number(initialLikes));

    const handleLike = () => {
        if (!email) {
            navigate("/account");
            return;
        }

        userfetch(`${BACKEND_API_URL}/api/wiki/auth/like`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                hash,
                email,
            }),
        });
        setLiked(!liked);
        setLikes(liked ? likes - 1 : likes + 1);
    }

    return (
        <button
            onClick={handleLike}
            className='flex items-center gap-1 hover:bg-slate-100 px-4 py-2 rounded-full transition-all'
        >
            <p className='text-base select-none'>{likes}</p>
            <Heart
                className={`size-6 transition-all duration-500 hover:scale-110 ${liked ? "text-red-500" : "text-transparent"}`}
            />
        </button>
    );
}
