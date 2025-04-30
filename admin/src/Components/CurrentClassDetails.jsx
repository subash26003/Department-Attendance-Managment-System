import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

const CurrentClassDetails = ({currentClass}) => {

  const [selectedPeriod, setSelectedPeriod] = useState({});
  const {currentTimetable} = useSelector((state) => state.classDetails)
  const {timings} = useSelector((state) => state.timetable)
  const {todayAbsentList} = useSelector(state => state.dailyUpdate);

  const filteredAbsentList = useMemo(() => {
    return todayAbsentList[currentClass]
  },[currentClass])

  useEffect(() => {

  },[currentTimetable])
  
  const handlePeriod = (index) =>{
    let periodData = {period : currentTimetable.periods[index] , absentList : filteredAbsentList[index]?.list || []}
    setSelectedPeriod(periodData)
  }

  let period = 1;
  return (
    <div className="bg-white rounded flex flex-col  lg:flex-row w-full gap-10 lg-justify-center  ">
      <div className="flex-3 flex  w-full shadow-lg rounded-xl border md:p-2  border-gray-200">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-indigo-600 text-white md:text-lg font-semibold">
              <th className="border border-black py-1 px-0.5 md:p-3">S/No</th>
              <th className="border border-black py-1 px-0.5 md:p-3">Duration</th>
              <th className="border border-black py-1 px-0.5 md:p-3">Subject</th>
              <th className="border border-black py-1 px-0.5 md:p-3">Absentees</th>
            </tr>
          </thead>
          <tbody>
            {currentTimetable?.periods?.map((item, index) => {
              return (
                <tr
                  key={index}
                  className="text-center text-sm md:text-md text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                  onClick={() => handlePeriod(index)}
                >
                  <td className="border py-1 px-0.5 md:p-3">{period++}</td>
                  <td className="border py-1 px-0.5 md:p-3">{timings[index]}</td>
                  <td className="border py-1 px-0.5 md:p-3">{item}</td>
                  <td className="border py-1 px-0.5 md:p-3 text-red-500 font-semibold">{filteredAbsentList ? filteredAbsentList[index] ? filteredAbsentList[index].list.length : 0  : "Not Found"}</td>
                </tr>
                //filteredAbsentList[index]?.list.length ||
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Absentee Info Section */}
      <div className="flex-1 min-h-56 lg:w-52 border border-gray-200 shadow p-2 rounded ">
        <p className=" text-center font-bold text-xl sm:text-2xl text-gray-800 my-2">Absentees</p>
        {Object.keys(selectedPeriod).length !== 0 ? (
          <>
            <p className=" sm:text-xl">
              Subject: {selectedPeriod.period}
            </p>
            <p className=" sm:text-xl text-red-500 font-semibold">
              count: {selectedPeriod.absentList.length}
            </p>
            <ul>
              {
                selectedPeriod.absentList.map((item , index)=> (
                  <li key={index}>
                    {index+1}. {item}
                  </li>
                ) )
              }
            </ul>
          </>
        ) : (
          <p className="text-center text-red-600">Absent List is not updated</p>
        )}
      </div>
    </div>
  );
};

CurrentClassDetails.propTypes = {
  currentTimeTable: PropTypes.node,
  currentClass : PropTypes.node
};

export default CurrentClassDetails;
