import { useEffect, useState } from "react";
import axios from "axios";
import api from "../api/api";
import Loader from "../Components/stateLessComponents/Loader";

const SemesterSetup = () => {
  const [noOfYears, setNoOfYears] = useState(1);
  const [dates, setDates] = useState([{ year: 1, startDate: "", endDate: "" }]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch existing semester data
  useEffect(() => {
    const fetchSemester = async () => {
      try {
        const res = await api.get("/semesters");
        if (res.data) {
          setNoOfYears(res.data.noOfYears);

          setDates(res.data.dates.map(item => {
            let obj = {};
            let sDate = item.startDate.split("T")[0]
            let eDate = item.endDate.split("T")[0]
            obj = {startDate : sDate , endDate : eDate , _id : item._id}
            return obj
          }));
        }
      } catch (err) {
        console.log("No existing semester data");
      } finally {
        setLoading(false);
      }
    };

    fetchSemester();
  }, []);

  const handleYearChange = (e) => {
    const years = parseInt(e.target.value, 10);
    setNoOfYears(years);
    const updatedDates = Array.from({ length: years }, (_, i) => {
      const existing = dates[i] || { year: i + 1, startDate: "", endDate: "" };
      return { year: i + 1, ...existing };
    });
    setDates(updatedDates);
  };

  const handleDateChange = (index, field, value) => {
    const updated = [...dates];
    updated[index][field] = value;
    setDates(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { noOfYears, dates };

    try {
      await api.post("/semesters", payload);
      setSuccess(true);
    } catch (error) {
      console.error("Error saving semester data", error);
    }
  };

  if (loading) return <Loader />

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Semester Setup</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Number of Years</label>
          <input
            type="number"
            min="1"
            value={noOfYears}
            onChange={handleYearChange}
            className="border p-2 w-full"
            required
          />
        </div>

        {dates.map((item, index) => (
          <div key={index} className="border p-4 rounded bg-gray-100">
            <h3 className="font-bold mb-2">Year {item.year}</h3>
            <div className="mb-2">
              <label className="block">Start Date</label>
              <input
                type="date"
                value={item.startDate}
                onChange={(e) =>
                  handleDateChange(index, "startDate", e.target.value)
                }
                className="border p-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block">End Date</label>
              <input
                type="date"
                value={item.endDate}
                onChange={(e) =>
                  handleDateChange(index, "endDate", e.target.value)
                }
                className="border p-2 w-full"
                required
              />
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>

        {success && (
          <p className="text-green-600 font-medium mt-2">
            Semester data saved successfully!
          </p>
        )}
      </form>
    </div>
  );
};

export default SemesterSetup;
