import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  getNotifications,
  getUnreadCount,
  markAsReadNoti,
} from "../../../api/notification";
import NotificationItem from "./NotificationItem";

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [socket, setSocket] = useState(null);

  // Connect to socket.io when component mounts
  useEffect(() => {
    const socketInstance = io(import.meta.env.VITE_SOCKET_SERVER_URL, {
      withCredentials: true, // automitically sent cookie in every request
    });

    setSocket(socketInstance);

    return () => {
      if (socketInstance) socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("notification", (newNotificaton) => {
      setUnreadCount((prev) => prev + 1);
      if (isNotificationOpen) {
        setNotifications((prev) => [newNotificaton, ...prev]);
      }
    });

    return () => {
      socket.off("notification");
    };
  }, [socket, isNotificationOpen]);

  const fetchUnreadCount = async () => {
    try {
      const response = await getUnreadCount();
      setUnreadCount(response);
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      setNotifications(response);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  const markAsRead = async () => {
    try {
      await markAsReadNoti();
      setUnreadCount(0);
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    }
  };

  const handleOpenNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
    if (!isNotificationOpen && unreadCount > 0) {
      markAsRead();
    }
  };

  return (
    <div className="dropdown dropdown-end">
      <button
        tabIndex={0}
        role="button"
        onClick={handleOpenNotification}
        className="relative cursor-pointer transition-transform duration-100 hover:scale-[1.02]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="3"
          stroke="currentColor"
          class="size-6 text-third-color">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
          />
        </svg>
        {/* if have unread noti */}
        {unreadCount < 0 && (
          <div className="absolute bottom-1 right-0 status status-warning animate-bounce"></div>
        )}
      </button>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-1 w-80 p-2 shadow-sm max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <li className="text-center py-4 text-gray-500">No notifications</li>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))
        )}
        {notifications.length > 0 && (
          <li className="mt-2 text-center">
            <button
              className="text-sm text-blue-500 hover:text-blue-700"
              onClick={() => {
                window.location.href = "/notification";
              }}>
              View all notifications
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};
export default NotificationDropdown;
