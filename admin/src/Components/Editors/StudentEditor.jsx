import React from "react";
import { useLocation } from "react-router";
import StudentFrom from "../registerPageComponents/StudentFrom";

const StudentEditor = () => {
  const { state } = useLocation();
  const { studentData } = state;
  return (
    <div>
      {studentData ? (
        <StudentFrom mode="edit" studentData={studentData} />
      ) : (
        <p>No Student Data Found</p>
      )}
    </div>
  );
};

export default StudentEditor;
