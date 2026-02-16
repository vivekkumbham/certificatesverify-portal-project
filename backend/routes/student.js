router.get("/docs/status", async (req, res) => {
  try {
    const studentId = req.user.id;

    const docs = await UploadDocs.find({ student: studentId })
      .sort({ createdAt: -1 });

    res.json({ docs });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch status" });
  }
});

