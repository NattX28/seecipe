// Utility function for profile navigation
export const navigateToProfile = (navigate, userId, currentUserId) => {
  if (userId === currentUserId) {
    // Navigate to own profile
    navigate("/profile");
  } else {
    // Navigate to another user's profile
    navigate(`/profile/${userId}`);
  }
};
