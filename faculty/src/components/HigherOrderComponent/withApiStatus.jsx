import { useContext } from "react";
import { API_STATUS, DataContext } from "../../context/DataProvider";
import Failure from "../stateLessComponents/Failure";
import Loader from "../stateLessComponents/Loader";

const renderView = (apiStatus,WrappedComponent, props) => {
    console.log(apiStatus);
    
  switch (apiStatus.status) {
    case API_STATUS.LOADING:
      return <Loader />;
    case API_STATUS.FAILURE:
      return <Failure message={apiStatus.err}/>;
    case API_STATUS.SUCCESS:
      return <WrappedComponent  {...props}/>;
      default:
        return null
  }
};

const withApiStatus = (WrappedComponent , title) => {
  
  return function (props) {
    const {apiStatus} = useContext(DataContext)
    return (
      <>
        <h1 className="text-2xl sm:text-3xl font-bold text-center mt-5">{title}</h1>
        {renderView(apiStatus ,WrappedComponent, props)}
      </>
    );
  };
};

export default withApiStatus;
