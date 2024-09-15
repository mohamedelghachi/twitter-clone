import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "username profileImg",
    });

    await Notification.updateMany({ to: userId }, { read: true });

    res.status(200).json(notifications);
  } catch (error) {
    console.log("Error in getNotifications : ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.deleteMany({ to: userId });

    res.status(200).json({ message: "Notifications deleted successfully" });
  } catch (error) {
    console.log("Error in deleteNotifications : ", error.message);
    res.status(500).json({ error: error.message });
  }
};
export const deleteOneNotification = async (req, res) => {
  try {
    const { id: notificationId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    const notification = await Notification.findById(notificationId);
    if (!notification)
      return res.status(400).json({ error: "Notification not found" });

    if (userId.toString() != notification.to.toString()) {
      return res
        .status(400)
        .json({ error: "You don't have right to delete that notification" });
    }
    await Notification.findByIdAndDelete({ _id: notificationId });

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.log("Error in deleteNotification : ", error.message);
    res.status(500).json({ error: error.message });
  }
};
