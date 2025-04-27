import { useState } from "react";
import ButtonMod from "./../main/ButtonMod";
import { rateRecipe } from "../../../api/recipe";
import { useParams } from "react-router";

const ReviewModal = ({ onReviewSubmitted }) => {
  const [score, setScore] = useState(0);
  const [hoverScore, setHoverScore] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { id } = useParams();

  const handleRate = async () => {
    try {
      setSubmitting(true);
      const result = await rateRecipe(id, score, review);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const success = await handleRate();

      if (success && onReviewSubmitted) {
        // Call the callback function to notify parent component
        onReviewSubmitted();
      }

      // Reset form and close modal
      setScore(0);
      setReview("");
      setHoverScore(0);
      document.getElementById("review_modal").close();
    } catch (err) {
      console.log("Cannot rate recipe :(", err);
      setScore(0);
      setReview("");
      setHoverScore(0);
      document.getElementById("review_modal").close();
    }
  };

  const StarIcon = ({ filled }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`w-8 h-8 transition-all duration-200 ${
        filled ? "text-yellow-400 drop-shadow-md" : "text-gray-300"
      }`}>
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <dialog id="review_modal" className="modal">
      <div className="modal-box relative bg-white rounded-lg shadow-xl max-w-md mx-auto p-6">
        {/* Close button */}
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition-colors duration-200">
            ✕
          </button>
        </form>

        {/* Title */}
        <h2 className="text-2xl font-bold text-main-color text-center mb-6">
          Share Your Experience
        </h2>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-6"></div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-6">
          {/* Star Rating */}
          <div className="flex flex-col items-center w-full">
            <label className="text-lg font-medium mb-3 text-gray-700">
              How would you rate your experience?
            </label>
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none transform hover:scale-110 transition-transform duration-200"
                  onClick={() => setScore(star)}
                  onMouseEnter={() => setHoverScore(star)}
                  onMouseLeave={() => setHoverScore(0)}>
                  <StarIcon filled={star <= (hoverScore || score)} />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2 min-h-5">
              {score === 1 && "Poor"}
              {score === 2 && "Fair"}
              {score === 3 && "Good"}
              {score === 4 && "Very Good"}
              {score === 5 && "Excellent"}
              {score === 0 && "\u00A0"}{" "}
              {/* Non-breaking space to maintain height */}
            </p>
          </div>

          {/* Comment Text Area */}
          <div className="w-full">
            <label className="text-lg font-medium mb-2 block text-gray-700">
              Your Review
            </label>
            <textarea
              placeholder="Tell us what you liked or what could be improved..."
              className="textarea textarea-bordered w-full h-32 p-4 rounded-lg border-2 border-gray-300 focus:border-main-color focus:ring focus:ring-main-color/20 transition-all duration-200 resize-none"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
            />
          </div>

          <div className="w-full flex justify-center mt-2">
            <button type="submit" disabled={submitting}>
              <ButtonMod
                text={submitting ? "Submitting..." : "Submit Review"}
                color="#ffa725"
                classOther={`px-10 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                  submitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              />
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default ReviewModal;
