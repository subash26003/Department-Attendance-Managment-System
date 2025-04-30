import React, { useState } from "react";
import { withApiStatus } from "../components/HOComponent/withApiStatus";
import Tab from "../components/StatelessComponent/Tab";
import RequestForm from "../components/RequestForm";
import MyRequests from "../components/MyRequests";

const tabList = ['My Requests' , 'Request Form']

const Requests = () => {
  const [currentTab , setcurrentTab] = useState(tabList[0])

  return (
    <div className="min-h-[100%] p-2">
      <Tab currentTab={currentTab} setCurrentTab={setcurrentTab} tabList={tabList} />
      {(() => {
        switch(currentTab){
          case tabList[0]:
            return <MyRequests />
          case tabList[1]:
            return <RequestForm />
          default:
            return null
        }
      })()}
    </div>
  )

};

export default withApiStatus(Requests);
