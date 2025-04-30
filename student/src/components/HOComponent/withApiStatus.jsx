import { useContext } from "react"
import { API_STATUS, StudentDataContext } from "../../context/StudentDataContext"
import Loader from "../Loader"
import Failure from "../Failure";

const renderView = ( apiStatus, WrapperComponent, props) =>{
    switch(apiStatus.status){
        case API_STATUS.LODING:
            return <Loader />;
        case API_STATUS.FAILURE:
            return <Failure message={apiStatus.errMsg} />
        case API_STATUS.SUCCESS:
            return <WrapperComponent {...props} />
    }
}

export const withApiStatus = (WrapperComponent) => {
    

    return (props) => {
        const {apiStatus} = useContext(StudentDataContext)
        return (
        <>
            {renderView(apiStatus, WrapperComponent , props)}
        </>   ) 
    }
}