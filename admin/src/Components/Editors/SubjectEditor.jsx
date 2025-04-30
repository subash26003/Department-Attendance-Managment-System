import React from "react";
import { useLocation } from "react-router";
import SubjectForm from "../registerPageComponents/SubjectForm";

const SubjectEditor = () => {
  const { subjectData } = useLocation().state;

  return subjectData ? <SubjectForm mode="edit" subjectData={subjectData}/> : <p>No Subject Data</p>;
};

export default SubjectEditor;
