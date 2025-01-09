import { Heart } from "@/components/basic/icons/Heart";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { BACKEND_API_URL } from "@/lib/env.js";

export function HeartCounter({initialLikes, initialLiked, hash, email}) {
    const navigate = useNavigate();
    const [liked, setLiked] = useState(initialLiked);
    const [likes, setLikes] = useState(Number(initialLikes));

    const handleLike = () => {
        if (!email) {
            navigate("/account");
            return;
        }

        fetch(`${BACKEND_API_URL}/api/wiki/like`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                hash,
                email
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
