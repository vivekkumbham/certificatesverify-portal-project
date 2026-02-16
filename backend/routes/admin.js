// VERIFY / REJECT DOCUMENT
router.post("/docs/verify/:id", async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !["Verified", "Rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updated = await UploadDocs.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.json({
      success: true,
      message: `Document ${status}`,
      doc: updated,
    });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
