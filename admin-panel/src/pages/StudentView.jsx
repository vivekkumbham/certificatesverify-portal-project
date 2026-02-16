import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";

export default function StudentView() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [docs, setDocs] = useState(null);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    loadStudent();
    loadDocs();
  }, []);

  const loadStudent = async () => {
    try {
      const res = await axios.get(`/api/admin/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudent(res.data.student);
    } catch (err) {
      console.error(err);
    }
  };

  const loadDocs = async () => {
    try {
      const res = await axios.get(`/api/admin/students/${id}/docs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocs(res.data.docs);
    } catch (err) {
      console.error(err);
    }
  };

  if (!student) return <div>Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Navbar />

        <div className="p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4">Student Details</h1>

          {/* PERSONAL DETAILS */}
          <div className="grid grid-cols-2 gap-6 bg-white p-6 rounded shadow mb-6">
            <Detail label="Full Name" value={docs?.fields?.fullName} />
            <Detail label="Phone Number" value={docs?.fields?.phone} />
            <Detail label="Email ID" value={docs?.fields?.email} />
            <Detail label="Gender" value={docs?.fields?.gender} />
            <Detail label="State" value={docs?.fields?.state} />
            <Detail label="Country" value={docs?.fields?.country} />
            <Detail label="College Name" value={docs?.fields?.collegeName} />
            <Detail label="Group" value={docs?.fields?.group} />
            <Detail label="Roll Number" value={docs?.fields?.rollNumber} />
            <Detail label="10th Hall Ticket No" value={docs?.fields?.tenthHallTicket} />
          </div>

          {/* DOCUMENT LINKS */}
          <div className="grid grid-cols-2 gap-6 bg-white p-6 rounded shadow mb-6">
            <DocLink label="10th Certificate" file={docs?.requiredFiles?.tenthCertificate} />
            <DocLink label="Inter Certificate" file={docs?.requiredFiles?.interCertificate} />
            <DocLink label="Graduation Certificate" file={docs?.requiredFiles?.graduationCertificate} />
            <DocLink label="Transfer Certificate (TC)" file={docs?.requiredFiles?.transferCertificate} />
          </div>

          {/* IMAGE DOCUMENTS */}
          <div className="grid grid-cols-3 gap-6 bg-white p-6 rounded shadow">
            <ImageDoc label="Passport Size Photo" file={docs?.requiredFiles?.passportPhoto} />
            <ImageDoc label="Aadhaar Front" file={docs?.requiredFiles?.aadhaarFront} />
            <ImageDoc label="Aadhaar Back" file={docs?.requiredFiles?.aadhaarBack} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- REUSABLE COMPONENTS ---------- */

const Detail = ({ label, value }) => (
  <div>
    <p className="font-semibold">{label}:</p>
    <p>{value || "—"}</p>
  </div>
);

const DocLink = ({ label, file }) => (
  <div>
    <p className="font-semibold">{label}:</p>
    {file?.url ? (
      <a href={file.url} target="_blank" className="text-blue-600 underline">
        View Document
      </a>
    ) : (
      "—"
    )}
  </div>
);

const ImageDoc = ({ label, file }) => (
  <div>
    <p className="font-semibold mb-2">{label}:</p>
    {file?.url ? (
      <img
        src={file.url}
        alt={label}
        className="h-40 w-full object-cover border rounded"
      />
    ) : (
      "—"
    )}
  </div>
);
