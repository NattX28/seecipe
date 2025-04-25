import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [socket, setSocket] = useState(null);

  // Connect to socket.io when component mounts
  useEffect(() => {
    const socketInstance = io({
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

  return <div>NotificationDropdown</div>;
};
export default NotificationDropdown;
