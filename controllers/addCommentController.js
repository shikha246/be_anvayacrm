import Lead from "../models/Leads.models.js";

export const addComment = async (req, res) => {
  try {
    const { text, author } = req.body;

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    const newComment = {
      text,
      author,
    };

    lead.comments.push(newComment);

    await lead.save();

    res.status(200).json({
      success: true,
      data: lead.comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};