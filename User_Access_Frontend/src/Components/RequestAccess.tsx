import { useEffect, useState } from "react";
import axios from "../api/axios";

interface FormData {
  softwareId: string;
  accessType: string;
  reason: string;
}

export default function RequestAccess() {
  const [formData, setFormData] = useState<FormData>({
    softwareId: "",
    accessType: "",
    reason: "",
  });
  const [softwares, setSoftwares] = useState<any[]>([]);
  const [selectedSoftware, setSelectedSoftware] = useState<string>("");
  const [accessLevels, setAccessLevels] = useState<string[]>([]);
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    axios.get("/software").then((res) => setSoftwares(res.data));
    axios.get("/requests/myreqs").then((res) => setRequests(res.data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSoftwareChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setSelectedSoftware(selected);

    const software = softwares.find((s) => s.name === selected);
    const levels = software?.accessLevels || [];

    setAccessLevels(levels);

    setFormData((prev) => ({
      ...prev,
      softwareId: software?.id || "",
      accessType: levels[0] || "",
    }));
  };

  const handleRequest = async () => {
    if (!formData.softwareId || !formData.accessType || !formData.reason.trim()) {
      alert("Please select software, access level, and enter a reason.");
      return;
    }

    try {
      await axios.post("/requests", formData);
      alert("Request submitted");
      const res = await axios.get("/requests/myreqs");
      setRequests(res.data);
      setFormData({ softwareId: "", accessType: "", reason: "" });
      setSelectedSoftware("");
      setAccessLevels([]);
    } catch (error) {
      alert("Failed to submit request. Try again.");
      console.error(error);
    }
  };

  return (
    <div className="request-access-container">
      <h2>Request Access</h2>

      <div className="form-group">
        <label htmlFor="software-select">Select Software</label>
        <select id="software-select" onChange={handleSoftwareChange} value={selectedSoftware}>
          <option value="">-- Select Software --</option>
          {softwares.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {accessLevels.length > 0 && (
        <div className="form-group">
          <label htmlFor="access-type-select">Access Type</label>
          <select
            id="access-type-select"
            name="accessType"
            value={formData.accessType}
            onChange={handleChange}
          >
            <option value="">-- Select Access Level --</option>
            {accessLevels.map((al, idx) => (
              <option key={idx} value={al}>
                {al}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="reason-input">Reason</label>
        <input
          id="reason-input"
          type="text"
          name="reason"
          placeholder="Enter reason for access"
          value={formData.reason}
          onChange={handleChange}
        />
      </div>

      <button onClick={handleRequest} className="submit-btn">Submit</button>

      <hr />
      <h3>Your Requests</h3>
      {requests.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "50px" }}>No requests found.</p>
      ) : (
        <ul className="request-list">
          {requests.map((r) => (
            <li key={r.id} className="request-item">
              <strong>{r.software.name}</strong> — Access: {r.accessType} — Status:{" "}
              <span className={`status status-${r.status.toLowerCase()}`}>
                {r.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
