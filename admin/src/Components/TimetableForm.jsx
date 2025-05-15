import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import api from "../api/api";
import { toast } from "react-toastify";
import Tab from "./stateLessComponents/Tab";
import {  WEEK_DAYS } from "../app/appConstants";

const availablePeriods = ["1", "2", "3", "4", "5", "6", "7"];
const availableTimings = [
  "09:10 - 10:00",
  "10:00 - 10:50",
  "11:10 - 12:00",
  "12:00 - 12:50",
  "1:50 - 2:40",
  "2:40 - 3:30",
  "3:40 - 4:30",
];

// Filter out weekends (Saturday and Sunday)
const weekDaysWithoutWeekends = WEEK_DAYS.filter(day => 
  !['Sunday', 'Saturday'].includes(day)
);

export default function TimetableForm() {
  const { classList, subjectList, status } = useSelector((state) => state.department);
  const { demoTable } = useSelector((state) => state.timetable);

  const [selectedClass, setSelectedClass] = useState(classList[0] || '');
  const [timetable, setTimetable] = useState([]);

  const filteredSubject = useMemo(() => {
    return subjectList.filter((item) => item.year === selectedClass);
  }, [selectedClass, subjectList]);

  useEffect(() => {
    let list = getFilteredTable();
    setTimetable(list);
  }, [selectedClass, status, demoTable, subjectList]);

  const getFilteredTable = () => {
    let list = demoTable.filter((item) => item.year === selectedClass);
    
    if (list.length <= 0) {
      return weekDaysWithoutWeekends.map((day) => ({
        day,
        periods: Array(availablePeriods.length).fill(""),
      }));
    }

    return weekDaysWithoutWeekends.map((day) => {
      const dayTimeTable = list.find((item) => item.day === day) || {
        day,
        periods: Array(availablePeriods.length).fill(""),
      };
      return {
        ...dayTimeTable,
        periods: [...dayTimeTable.periods], // Ensure we have a copy
      };
    });
  };

  const handleChange = (dayIndex, periodIndex, value) => {
    setTimetable((prev) => {
      const updated = [...prev];
      updated[dayIndex] = {
        ...updated[dayIndex],
        periods: [...updated[dayIndex].periods],
      };
      updated[dayIndex].periods[periodIndex] = value;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formatedData = timetable.map((item) => ({
      ...item,
      year: selectedClass,
    }));

    try {
      const response = await api.post("/uploadTimeTable", { formatedData });
      const responseData = response.data;
      
      if (responseData.success) {
        toast.success(responseData.message);
      } else {
        toast.info(responseData.message);
      }
    } catch (error) {
      console.error("Error submitting timetable", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="p-3 max-w-screen overflow-y-auto">
      <div className="flex-1">
        <Tab
          tabList={classList}
          currentTab={selectedClass}
          setCurrentTab={setSelectedClass}
        />
        <form onSubmit={handleSubmit} className="p-6 rounded-xl overflow-auto">
          <table className="border-collapse border border-gray-300 w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Day</th>
                {availableTimings.map((time, index) => (
                  <th key={index} className="border border-gray-300 px-4 py-2">
                    {time}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timetable.map((row, dayIndex) => (
                <tr key={dayIndex} className="text-center">
                  <td className="border border-gray-300 px-4 py-2 font-semibold bg-gray-100">
                    {row.day}
                  </td>
                  {row.periods.map((subject, periodIndex) => (
                    <td
                      key={periodIndex}
                      className="border border-gray-300 px-4 py-2"
                    >
                      <select
                        value={subject}
                        onChange={(e) =>
                          handleChange(dayIndex, periodIndex, e.target.value)
                        }
                        className="w-full px-2 py-1 border rounded-md"
                      >
                        <option value="">Select</option>
                        {filteredSubject.map((subj, idx) => (
                          <option key={idx} value={subj.name}>
                            {subj.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="submit"
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Submit Timetable
          </button>
        </form>
      </div>
    </div>
  );
}