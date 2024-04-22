import User from "../models/User.js";

const auth = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = await User.findById(req.session.userId);
    next();
  } catch (error) {
    next(error);
  }
};

export default auth;
