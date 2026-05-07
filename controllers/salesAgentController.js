import SalesAgent from "../models/SalesAgent.models.js";

export const createAgent = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    const agent = await SalesAgent.create({ name, email });

    res.status(201).json({
      success: true,
      data: agent,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
export const getAgents = async (req, res) => {
  try {
    const agents = await SalesAgent.find();

    res.status(200).json({
      success: true,
      data: agents,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ Update agent
export const updateAgent = async (req, res) => {
  try {
    const updatedAgent = await SalesAgent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedAgent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.json(updatedAgent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete agent
export const deleteAgent = async (req, res) => {
  try {
    console.log("ID received:", req.params.id);

    const deletedAgent = await SalesAgent.findByIdAndDelete(req.params.id);

    if (!deletedAgent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE ERROR:", error); // 👈 THIS WILL TELL EVERYTHING
    res.status(500).json({ error: error.message });
  }
};