import { useEffect, useState } from "react";

const DEFAULT_OPTIONS = {
    headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    },
};

export default function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(url, DEFAULT_OPTIONS)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                return res.json()
            })
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch((e) => {
                console.error(e);
                setLoading(false);
                setError(e);
            });
    }, [url]);

    return { data, loading, error };
}
