

import Lead from "../models/Leads.models.js";
import mongoose from "mongoose";

export const getReports = async (req, res) => {
  try {
    const { range } = req.query;

    // 📅 Date filter logic
    let dateFilter = {};
    const now = new Date();

    if (range === "7days") {
      dateFilter.createdAt = { $gte: new Date(now.setDate(now.getDate() - 7)) };
    } else if (range === "30days") {
      dateFilter.createdAt = { $gte: new Date(now.setDate(now.getDate() - 30)) };
    } else if (range === "90days") {
      dateFilter.createdAt = { $gte: new Date(now.setDate(now.getDate() - 90)) };
    }

    // 🔢 TOTAL LEADS
    const totalLeads = await Lead.countDocuments(dateFilter);

    // ✅ CLOSED LEADS
    const closedLeads = await Lead.countDocuments({
      ...dateFilter,
      status: "closed",
    });

    // 🔄 PIPELINE LEADS (everything except Closed)
    const pipelineLeads = await Lead.countDocuments({
      ...dateFilter,
      status: { $ne: "closed" },
    });

    // 📊 STATUS DISTRIBUTION
    const statusDistributionRaw = await Lead.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const statusDistribution = statusDistributionRaw.map((item) => ({
      status: item._id || "Unknown",
      count: item.count,
    }));

    // 👨‍💼 LEADS CLOSED BY AGENT
    const leadsByAgentRaw = await Lead.aggregate([
      {
        $match: {
          ...dateFilter,
          status: "closed",
          salesAgent: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$salesAgent",
          closed: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "salesagents", // ⚠️ make sure your collection name is correct
          localField: "_id",
          foreignField: "_id",
          as: "agent",
        },
      },
      {
        $unwind: {
          path: "$agent",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          agent: "$agent.name",
          closed: 1,
        },
      },
    ]);

    const leadsByAgent = leadsByAgentRaw.map((item) => ({
      agent: item.agent || "Unknown",
      closed: item.closed,
    }));

    // 📦 FINAL RESPONSE
    res.json({
      totalLeads,
      closedLeads,
      pipelineLeads,
      leadsByAgent,
      statusDistribution,
    });
  } catch (error) {
    console.error("REPORT ERROR:", error);
    res.status(500).json({
      message: "Failed to generate reports",
      error: error.message,
    });
  }
};