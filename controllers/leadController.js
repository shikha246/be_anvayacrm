import Lead from "../models/Leads.models.js";
import mongoose from "mongoose";
// CREATE LEAD
export const createLead = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("CreateLead hit");
    
    const lead = new Lead(req.body);

    const savedLead = await lead.save();

    res.status(201).json({
      success: true,
      data: savedLead,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// GET LEADS (WITH FILTERS)
export const getLeads = async (req, res) => {
  try {
    const { salesAgent, status, tags, source,sort } = req.query;

    let filter = {};

   if (salesAgent && mongoose.Types.ObjectId.isValid(salesAgent)) {
  filter.salesAgent = salesAgent; // no need for new ObjectId()
}
    if (status) filter.status = status;
    if (source) filter.source = source;
    if (tags) filter.tags = { $in: tags.split(",") };
//This creates MongoDB query using all filters.
   let query = Lead.find(filter); 
// SORTING
if (sort === "time") {
  query = query.sort({ timeToClose: 1 });
}

if (sort === "priority") {

query = query.sort({ priority: 1 });
}

    const leads = await query.populate("salesAgent");
// console.log("CreateLead hit");
// console.log("Query:", req.query);
// console.log("salesAgent from query:", salesAgent);
// console.log("Filter being applied:", filter);
    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get Lead Status Counts
export const getLeadStats = async (req, res) => {
  try {
    const leads = await Lead.find();

    const stats = {
      new: 0,
      contacted: 0,
      qualified: 0,
      proposalSent:0,
      closed:0
    };

    leads.forEach((lead) => {
      if (lead.status === "new") stats.new++;
      if (lead.status === "contacted") stats.contacted++;
      if (lead.status === "qualified") stats.qualified++;
      if (lead.status === "proposalSent") stats.proposalSent++;
      if (lead.status === "closed") stats.closed++;
    });

    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching lead stats:", error);
    res.status(500).json({ message: "Server Error" });
  }
};



// UPDATE LEAD
export const updateLead = async (req, res) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("salesAgent");

    res.status(200).json({
      success: true,
      data: updatedLead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE LEAD
export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET single lead

export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate("salesAgent");

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const unassignLeads = async (req, res) => {
  try {
    const { agentId } = req.params;

    await Lead.updateMany(
      { salesAgent: agentId },
      {
        $set: {
          salesAgent: null,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Leads are now unassigned",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};