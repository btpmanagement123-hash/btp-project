import { chatWithAdvisor } from "../utils/chatbotService.js";
import ChatHistory from "../models/ChatHistory.js";
import facultyData from "../utils/facultyData.js";

// @desc    Create a new chat session
// @route   POST /api/chat/session
// @access  Private

export const createSession = async (req, res, next) => {
  try {
    const sessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    const chatHistory = await ChatHistory.create({
      sessionId,
      userId: req.user._id,
      messages: [],
    });

    res.status(201).json({
      success: true,
      data: {
        sessionId: chatHistory.sessionId,
        createdAt: chatHistory.createdAt,
      },
      message: "Session created successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message and get project recommendations
// @route   POST /api/chat/:sessionId/message
// @access  Private

export const sendMessage = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        error: "Please provide a question",
        statusCode: 400,
      });
    }

    // Find session scoped to user
    let chatHistory = await ChatHistory.findOne({
      sessionId,
      userId: req.user._id,
    });

    if (!chatHistory) {
      return res.status(404).json({
        success: false,
        error: "Session not found",
        statusCode: 404,
      });
    }

    // ─── Convert DB messages → Gemini history format ───
    const geminiHistory = chatHistory.messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: msg.content,
    }));

    // ─── Call Gemini Advisor ───
    const { reply } = await chatWithAdvisor(question, geminiHistory, facultyData);

    // ─── Parse structured projects from new format ───
    const projects = parseProjectsFromMarkdown(reply);

    // ─── Save latest messages to DB ───
    chatHistory.messages.push(
      {
        role: "user",
        content: question,
        timestamp: new Date(),
      },
      {
        role: "assistant",
        content: reply,
        timestamp: new Date(),
      }
    );

    if (projects.length > 0) {
      chatHistory.projectsSuggested.push(...projects);
    }

    await chatHistory.save();

    res.status(200).json({
      success: true,
      data: {
        question,
        answer: reply,
        projects,
        sessionId,
        chatHistoryId: chatHistory._id,
      },
      message: "Advisor response generated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get full chat history for a session
// @route   GET /api/chat/:sessionId
// @access  Private

export const getSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const chatHistory = await ChatHistory.findOne({
      sessionId,
      userId: req.user._id,
    });

    if (!chatHistory) {
      return res.status(404).json({
        success: false,
        error: "Session not found",
        statusCode: 404,
      });
    }

    res.status(200).json({
      success: true,
      data: chatHistory,
      message: "Session fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all sessions (admin / analytics)
// @route   GET /api/chat/sessions/all
// @access  Private

export const getAllSessions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const sessions = await ChatHistory.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("sessionId messages projectsSuggested createdAt isActive");

    const total = await ChatHistory.countDocuments();

    res.status(200).json({
      success: true,
      data: sessions,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      message: "Sessions fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a session
// @route   DELETE /api/chat/:sessionId
// @access  Private

export const deleteSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const chatHistory = await ChatHistory.findOneAndDelete({
      sessionId,
      userId: req.user._id,
    });

    if (!chatHistory) {
      return res.status(404).json({
        success: false,
        error: "Session not found",
        statusCode: 404,
      });
    }

    res.status(200).json({
      success: true,
      data: {},
      message: "Session deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ─── Helper ────────────────────────────────────────────────────────────────────

/**
 * Parses Gemini markdown response into structured project objects.
 *
 * Matches the new prompt format from chatbotService.js:
 *
 * ### 🔬 Project 1: [Title]
 * **Description:** [text]
 * **Supervisor:** [Professor Name]
 * **Why this supervisor:** [text]
 * ---
 */
const parseProjectsFromMarkdown = (markdownText) => {
  const projects = [];

  // Split by --- to get individual project blocks
  const blocks = markdownText.split("---").filter((b) => b.trim());

  blocks.forEach((block) => {
    // Match: ### 🔬 Project N: Title  (emoji is optional)
    const titleMatch = block.match(/###\s+(?:🔬\s+)?Project\s+\d+:\s+(.+)/i);

    // Match: **Description:** some text
    const descMatch = block.match(/\*\*Description:\*\*\s+(.+?)(?=\n\*\*|$)/s);

    // Match: **Supervisor:** Professor Name  OR  **Best Supervisor:** Name — reason
    const supervisorMatch = block.match(/\*\*(?:Best\s+)?Supervisor:\*\*\s+([^—\n]+)/i);

    if (!titleMatch) return; // skip blocks without a project title

    projects.push({
      title: titleMatch[1].trim(),
      description: descMatch ? descMatch[1].trim() : "",
      suggestedProfessors: supervisorMatch
        ? [supervisorMatch[1].trim()]
        : [],
    });
  });

  return projects;
};