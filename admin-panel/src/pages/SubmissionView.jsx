import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
export default function SubmissionView() {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [files, setFiles] = useState([]);
  const [comments, setComments] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken") || "admintoken";
  useEffect(() => {
    load();
  }, []);
  const load = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/admin/all", {
        headers: { "x-admin-token": token },
      });
      const item = (res.data.list || []).find((i) => i._id === id);
      setSubmission(item);
    } catch (e) {
      console.error(e);
    }
  };
  const uploadAndSetStatus = async (status) => {
    if (!submission) return;
    const fd = new FormData();
    files.forEach((f) => fd.append("adminFiles", f));
    fd.append("status", status);
    fd.append("comments", comments);
    try {
      await axios.post(`/api/admin/verify/${submission._id}`, fd, {
        headers: { "x-admin-token": token },
      });
      alert("Updated");
      navigate("/");
    } catch (e) {
      console.error(e);
      alert("Failed to update");
    }
  };
  if (!submission) return <div>Loading...</div>;
  return (
    <div>
      <h3>Submission for {submission.fields && submission.fields.fullName}</h3>
      <div>
        <b>Phone:</b> {submission.student && submission.student.phone}
      </div>
      <div style={{ marginTop: 12 }}>
        <h4>Student files</h4>
        {submission.requiredFiles &&
          Object.entries(submission.requiredFiles).map(
            ([k, v]) =>
              v && (
                <div key={k}>
                  <a href={v.url} target="_blank" rel="noreferrer">
                    {k} — {v.filename}
                  </a>
                </div>
              )
          )}
      </div>
      <div style={{ marginTop: 12 }}>
        <h4>Upload scanned/stamped files</h4>
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files))}
        />
        <div>
          <textarea
            placeholder="Comments (optional)"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            style={{ width: "100%", height: 80 }}
          />
        </div>
        <button onClick={() => uploadAndSetStatus("Verified")}>
          Mark Verified
        </button>
        <button onClick={() => uploadAndSetStatus("Rejected")}>Reject</button>
      </div>
      <div style={{ marginTop: 12 }}>
        <h4>Admin uploaded files</h4>
        {submission.adminFiles &&
          submission.adminFiles.scannedCopies &&
          submission.adminFiles.scannedCopies.map((f, i) => (
            <div key={i}>
              <a href={f.url} target="_blank" rel="noreferrer">
                {f.filename}
              </a>
            </div>
          ))}
      </div>
    </div>
  );
}
