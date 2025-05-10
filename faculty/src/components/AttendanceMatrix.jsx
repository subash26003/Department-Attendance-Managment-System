import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

const AttendanceMatrix = ({ students, absents }) => {
  
  const [datePeriods, setDatePeriods] = useState([]);

  useEffect(() => {
    const uniqueSet = new Set();

    absents.forEach((record) => {
      const date = dayjs(record.recordedAt).format("YYYY-MM-DD");
      const key = `${date}-P${record.period}`;
      uniqueSet.add(key);
    });

    const sorted = Array.from(uniqueSet).sort((a, b) => {
      const [dateA, periodA] = a.split("-P");
      const [dateB, periodB] = b.split("-P");
      return dayjs(dateA).isAfter(dayjs(dateB))
        ? 1
        : dayjs(dateA).isBefore(dayjs(dateB))
        ? -1
        : Number(periodA) - Number(periodB);
    });

    setDatePeriods(sorted);
  }, [absents]);

  const isAbsent = (studentId, key) => {
    const [date, period] = key.split("-P");
    return absents.some(
      (record) =>
        record.studentId === studentId &&
        dayjs(record.recordedAt).format("YYYY-MM-DD") === date &&
        record.period === Number(period)
    );
  };

  return (
    <div className="overflow-auto max-w-full max-h-[70vh] border">
      <table className="table-auto border-collapse min-w-full text-sm">
        <thead className="sticky top-0 z-10 bg-white">
          <tr>
            <th className="border p-2 sticky left-0 z-20 bg-gray-100">
              Student
            </th>
            {datePeriods.map((dp, i) => (
              <th
                key={i}
                className="border px-3 py-2 bg-gray-200 whitespace-nowrap"
              >
                {dp.replace("-P", " | P")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.studentId}>
              <td className="border p-2 font-medium sticky left-0 bg-white z-10 truncate w-20">
                {student.name}
              </td>
              {datePeriods.map((dp) => (
                <td
                  key={dp}
                  className={`border w-6 h-6 ${
                    isAbsent(student.studentId, dp)
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                ></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceMatrix;
