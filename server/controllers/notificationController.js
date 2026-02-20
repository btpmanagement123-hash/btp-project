import Notification from '../models/Notification.js';

/* ===============================
   CREATE NOTIFICATION (ADMIN)
================================= */
export const createNotification = async (req, res) => {
  try {
    const { audience, session, title, message, validTill } = req.body;

    console.log("========== CREATE NOTIFICATION ==========");
    console.log("Incoming Body:", req.body);

    const doc = await Notification.create({
      audience: audience || 'all',
      session: session ? session.trim() : null,
      title,
      message,
      validTill: validTill || null
    });

    console.log("Saved Notification:", doc);
    console.log("=========================================");

    return res.json(doc);
  } catch (err) {
    console.log("CREATE ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};


/* ===============================
   GET MY NOTIFICATIONS
================================= */
export const getMyNotifications = async (req, res) => {
  try {
    console.log("\n\n========== GET MY NOTIFICATIONS ==========");

    if (!req.user) {
      console.log("❌ No req.user found");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const role = req.user.role?.toLowerCase();
    const userSession = req.user.session ? req.user.session.trim() : null;
    const now = new Date();

    console.log("USER OBJECT:", req.user);
    console.log("ROLE:", role);
    console.log("USER SESSION:", userSession);
    console.log("CURRENT TIME:", now);

    // Role → Audience mapping
    const roleAudienceMap = {
      student: 'students',
      professor: 'faculty'
    };

    const audienceForRole = roleAudienceMap[role];

    console.log("AUDIENCE FOR ROLE:", audienceForRole);

    const query = {
      $and: [
        {
          $or: [
            { audience: 'all' },
            audienceForRole ? { audience: audienceForRole } : null
          ].filter(Boolean)
        },
        {
          $or: [
            { session: null },
            { session: userSession }
          ]
        },
        {
          $or: [
            { validTill: null },
            { validTill: { $gte: now } }
          ]
        }
      ]
    };

    console.log("FINAL MONGO QUERY:", JSON.stringify(query, null, 2));

    const allNotifications = await Notification.find({});
    console.log("ALL NOTIFICATIONS IN DB:");
    console.log(allNotifications);

    const notifs = await Notification.find(query).sort({ createdAt: -1 });

    console.log("MATCHED NOTIFICATIONS COUNT:", notifs.length);
    console.log("MATCHED DATA:", notifs);
    console.log("==========================================\n\n");

    return res.json(notifs);

  } catch (err) {
    console.log("GET ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};