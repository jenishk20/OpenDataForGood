import { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchGender, setSearchGender] = useState("");

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/patients").then((response) => {
      setData(response.data);
      setFilteredData(response.data);
    });
  }, []);

  useEffect(() => {
    const lowerName = searchName.toLowerCase();
    const lowerGender = searchGender.toLowerCase();

    const filtered = data.filter((row) => {
      const name = row.resource.name?.[0]?.given?.[0]?.toLowerCase() || "";
      const gender = row.resource.gender?.toLowerCase() || "";

      return name.includes(lowerName) && gender.includes(lowerGender);
    });

    setFilteredData(filtered);
  }, [searchName, searchGender, data]);

  const columns = [
    { name: "ID", selector: (row) => row.resource.id, sortable: true },
    {
      name: "Name",
      selector: (row) => row.resource.name?.[0]?.given?.[0] || "N/A",
      sortable: true,
    },
    { name: "Gender", selector: (row) => row.resource.gender, sortable: true },
    {
      name: "Birth Date",
      selector: (row) => row.resource.birthDate,
      sortable: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
        FHIR Patients Viewer
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-4 justify-center">
        <input
          type="text"
          placeholder="Filter by Name"
          className="p-2 rounded border border-gray-300 w-full md:w-1/3"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <select
          className="p-2 rounded border border-gray-300 w-full md:w-1/4"
          value={searchGender}
          onChange={(e) => setSearchGender(e.target.value)}
        >
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="unknown">Unknown</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4">
        <DataTable
          title="FHIR Patient Records"
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
          responsive
        />
      </div>
    </div>
  );
}

export default App;
