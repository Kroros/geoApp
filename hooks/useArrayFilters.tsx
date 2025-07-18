import { useEffect } from "react";

export default function useArrayFilters (linkAppendix: string, filterArray: string[], setQuery: React.Dispatch<React.SetStateAction<string>>) {
    useEffect ( () => {
        let queryAppendix: string = ``;

        filterArray.forEach(u => {
            queryAppendix += `&${linkAppendix}=${u}`
        });

        setQuery(queryAppendix);
    }, [filterArray]);
}