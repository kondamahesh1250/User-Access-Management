import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function PendingRequests() {
  const [requests, setRequests] = useState<any[]>([]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("/requests");
      setRequests(res.data);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    }

  }
  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await axios.patch(`/requests/${id}`, { status });
      fetchRequests();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  return (
    <div className="pending-container">
      <h2>Pending Requests</h2>
      {
        requests.length === 0 ? (
          <p style={{textAlign:"center", padding:"50px"}}>No pending requests.</p>
        ) : (
          <ul className="request-list">
            {requests.map((r) => (
              <li key={r.id} className="request-item">
                <div className="request-info">
                  <strong>{r.user.username}</strong> &rarr;{" "}
                  <em>{r.software.name}</em> ({r.accessType}) &nbsp;
                  <span className={`status status-${r.status.toLowerCase()}`}>
                    [{r.status}]
                  </span>
                </div>
                <div className="request-actions">
                  <button
                    onClick={() => updateStatus(r.id, "Approved")}
                    // disabled={updatingId === r.id || r.status === "Approved"}
                    className="approve-btn"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(r.id, "Rejected")}
                    // disabled={updatingId === r.id || r.status === "Rejected"}
                    className="reject-btn"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
    </div>
  );
}
