import React, { useEffect, useState } from "react";
import axios from "axios";
import StudentLayout from "../layouts/StudentLayout";

const BASE_URL = "http://localhost:4000";

export default function Dashboard() {
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${BASE_URL}/api/docs/my-submissions`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSubs(res.data.subs || []);
      } catch (err) {
        console.error("Failed to load submissions", err);
      }
    };

    load();
  }, []);

  return (
    <StudentLayout>
      <h1 className="text-3xl font-bold mb-10 text-sky-700">Student Updates</h1>

      {subs.length === 0 && (
        <p className="text-center text-gray-600">No submissions found.</p>
      )}

      <div className="space-y-10">
        {subs.map((s) => (
          <div
            key={s._id}
            className="bg-white rounded-2xl shadow-lg border border-sky-100 p-6 space-y-6"
          >
            {/* ================= STUDENT DETAILS ================= */}
            <div className="bg-gradient-to-r from-sky-50 to-green-50 border border-sky-100 rounded-xl p-5">
              <h3 className="text-xl font-semibold text-sky-700 mb-4">
                Student Details
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Field label="First Name" value={s.fields?.firstName} />
                <Field label="Phone" value={s.fields?.phone} />
                <Field label="Email" value={s.fields?.email} />
                <Field label="DOB" value={s.fields?.dob} />
                <Field label="Gender" value={s.fields?.gender} />
                <Field label="State" value={s.fields?.state} />
                <Field label="Country" value={s.fields?.country} />
                <Field label="College" value={s.fields?.collegeName} />
                <Field label="Group" value={s.fields?.group} />
                <Field
                  label="Registered No"
                  value={s.fields?.registeredNumber}
                />
              </div>
            </div>

            {/* ================= STATUS BAR ================= */}
            <div className="flex flex-wrap justify-between items-center bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Status:</span>
                <StatusPill status={s.status} />
              </div>

              <div className="text-sm text-gray-500">
                <span className="font-semibold">Submitted:</span>{" "}
                {new Date(s.createdAt).toLocaleString()}
              </div>
            </div>

            {/* ================= FILES SECTION ================= */}
            <details className="bg-sky-50 border border-sky-100 rounded-xl p-5">
              <summary className="cursor-pointer text-sky-700 font-semibold text-lg">
                View Uploaded Files
              </summary>

              {/* STUDENT FILES */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-800 mb-3">
                  Your Uploaded Files
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {s.requiredFiles &&
                    Object.entries(s.requiredFiles).map(([key, file]) =>
                      file ? (
                        <FileCard
                          key={key}
                          file={file}
                          label={key}
                          status={s.status}
                        />
                      ) : null
                    )}
                </div>
              </div>

              {/* ADMIN FILES */}
              {s.adminFiles?.scannedCopies?.length > 0 && (
                <div className="mt-8">
                  <h4 className="font-semibold text-green-700 mb-3">
                    Admin Uploaded Files
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {s.adminFiles.scannedCopies.map((file, i) => (
                      <FileCard
                        key={i}
                        file={file}
                        label={`Admin File ${i + 1}`}
                        accent="green"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ADMIN COMMENTS */}
              {s.adminComments && (
                <div className="mt-6 bg-white border-l-4 border-green-500 p-4 rounded-lg">
                  <p className="font-semibold text-gray-800">Admin Comments</p>
                  <p className="text-gray-600 mt-1">{s.adminComments}</p>
                </div>
              )}
            </details>
          </div>
        ))}
      </div>
    </StudentLayout>
  );
}

/* ================== COMPONENTS ================== */

const Field = ({ label, value }) => (
  <div className="bg-white rounded-lg p-3 border border-gray-100">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-semibold text-gray-800">{value || "—"}</p>
  </div>
);

const StatusPill = ({ status }) => {
  const styles = {
    Verified: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Rejected: "bg-red-100 text-red-700",
  };

  

  return (
    <span
      className={`px-4 py-1 rounded-full text-sm font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
};

const downloadStampedImage = (imageUrl, status) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Stamp background
      ctx.fillStyle =
        status === "Verified"
          ? "rgba(22, 163, 74, 0.75)"
          : "rgba(220, 38, 38, 0.75)";

      const stampWidth = img.width * 0.6;
      const stampHeight = img.height * 0.15;

      ctx.fillRect(
        (img.width - stampWidth) / 2,
        (img.height - stampHeight) / 2,
        stampWidth,
        stampHeight
      );

      // Stamp text
      ctx.font = `bold ${img.width / 10}px Arial`;
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(status.toUpperCase(), img.width / 2, img.height / 2);

      // Download
      const link = document.createElement("a");
      link.download = `${status}-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  };

const FileCard = ({ file, label, accent = "sky", status }) => {
  const fullUrl = `http://localhost:4000${file.url}`;
  const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(file.filename);

  return (
    <div className="bg-white border rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
      {isImage ? (
        <div className="relative overflow-hidden">
          <img
            src={fullUrl}
            alt={file.filename}
            className="h-40 w-full object-cover hover:scale-110 transition"
          />

          {/* STATUS STAMP */}
          {status !== "Pending" && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span
                className={`px-4 py-2 rounded-full text-lg font-extrabold tracking-widest uppercase ${
                  status === "Verified"
                    ? "bg-green-600/80 text-white"
                    : "bg-red-600/80 text-white"
                }`}
              >
                {status}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="h-40 flex items-center justify-center bg-gray-100 text-gray-500 text-4xl">
          📄
        </div>
      )}

      <div className="p-3">
        <p className="text-sm font-semibold truncate">{label}</p>
        <p className="text-xs text-gray-500 truncate">{file.filename}</p>

        <a
          href={fullUrl}
          download
          target="_blank"
          rel="noreferrer"
          onClick={() => downloadStampedImage(fullUrl, status)}
          className={`mt-3 inline-block w-full text-center text-sm font-semibold py-2 rounded-lg bg-${accent}-600 text-white hover:bg-${accent}-700 transition`}
        >
          Download
        </a>
      </div>
    </div>
  );
};
