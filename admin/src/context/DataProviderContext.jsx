import { createContext, useState } from "react";

export const DataProviderContext = createContext()

const DataProvider = ({children}) => {

    const [timetables , setTimetables] = useState()

    const getTimetableData = async () => {

    }

    const value = {
        data : "message"
    }
    
    return (
        <DataProviderContext.Provider value={value}>
            {children}
        </DataProviderContext.Provider>
    )
}

export default DataProvider