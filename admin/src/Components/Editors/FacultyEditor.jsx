import { useLocation } from "react-router"
import FacultyForm from "../registerPageComponents/FacultyForm"

const FacultyEditor = () => {

    const {facultyData} = useLocation().state

  return (facultyData) ? <FacultyForm mode="edit" facultyData={facultyData} /> : (<p>No Faculty Found</p>)
}

export default FacultyEditor