import { useEffect, useState, use } from "react";
import { AccountContext } from "@/context/Account";

const DEFAULT_OPTIONS = {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
};

export async function userfetch(url, options) {
    var status = -1;
    return fetch(url, options)
        .then((res) => {
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            status = res.status;
            return res.json();
        })
        .then((data) => {
            return {data: data, status:status, error: null};
        })
        .catch((e) => {
            console.log("Error fetching data");
            return {data: null, error: e};
        });
}


export function useFetch(url) {
    const { getToken } = use(AccountContext);
    const credential = getToken();
    if (credential) {
        DEFAULT_OPTIONS.headers.Authorization = `Bearer ${credential}`;
    }

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            const { data, error } = await userfetch(url, DEFAULT_OPTIONS);
            setData(data);
            setError(error);
            setLoading(false);
        })();
        // fetch(url, DEFAULT_OPTIONS)
        //     .then((res) => {
        //         if (!res.ok) {
        //             throw new Error("Network response was not ok");
        //         }
        //         return res.json();
        //     })
        //     .then((data) => {
        //         setData(data);
        //         setLoading(false);
        //     })
        //     .catch((e) => {
        //         console.error(e);
        //         setLoading(false);
        //         setError(e);
        //     });
    }, [url]);

    return { data, loading, error };
}
