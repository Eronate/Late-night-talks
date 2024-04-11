import { useState } from "react"

interface SearchBoxProps {

}

interface SearchBoxProps {
    placeholder?: string,
    search: string,
    setSearch: React.Dispatch<React.SetStateAction<string>>
}

export default function SearchBox({placeholder, search, setSearch}: SearchBoxProps) {
    return <div className="border-navylight text-xs w-full">
            <input type="text"
                value={search}
                placeholder={placeholder}
                onChange={(e) => setSearch(e.target.value)}
                className="p-2 rounded-sm ring-navylight ring-1 focus:ring-2 focus:outline-none w-full text-navycustom shadow-xl"
            />
    </div>
}
