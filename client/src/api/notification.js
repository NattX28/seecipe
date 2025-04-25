import api from "./axios";

export const getNotifications = async () => {
  try {
    const response = await api.get(`/notification`);
    return response.data.data;
  } catch (err) {
    console.log("Error in getNotification", err);
    throw err;
  }
};

export const markAsReadNoti = async () => {
  try {
    const response = await api.put(`/notifications/mark-read`);
    return response.data;
  } catch (err) {
    console.log("Error in markAsRead", err);
    throw err;
  }
};

export const deleteNotification = async (id) => {
  try {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  } catch (err) {
    console.log("Error in markAsRead", err);
    throw err;
  }
};

export const getUnreadCount = async () => {
  try {
    const response = await api.get(`/notifications/unread-count`);
    return response.data.data;
  } catch (err) {
    console.log("Error in markAsRead", err);
    throw err;
  }
};
