const NotificationItem = ({ notification }) => {
  // Format the noti based on type
  const formatNotificationMessage = (notification) => {
    switch (notification.type) {
      case "like":
        return `liked your recipe "${notification.recipe.title}"`;
      case "comment":
        return `commented on your recipe "${notification.recipe.title}"`;
      case "follow":
        return `started following you`;
      default:
        return `interacted with your content`;
    }
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return "just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <li className="hover:bg-gray-100 rounded-lg">
      <a href="#" className="flex items-start p-2">
        <div className="flex-shrink-0">
          <img
            src={
              notification.actor.profilePicture || "/images/profile_avatar.png"
            }
            alt={notification.actor.username}
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
        <div className="ml-3 flex-1">
          <div className="flex justify-between">
            <p className="text-sm font-medium">
              <span className="font-bold">{notification.actor.username}</span>{" "}
              {formatNotificationMessage(notification)}
            </p>
            <span className="text-xs text-gray-500">
              {formatDate(notification.createdAt)}
            </span>
          </div>
        </div>
      </a>
    </li>
  );
};
export default NotificationItem;
