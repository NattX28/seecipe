import Button from "./Button";

const LoginModal = () => {
  return (
    <dialog id="login_modal" className="modal">
      <div className="modal-box relative">
        {/* Close button */}
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        {/* Title */}
        <h2 className="text-2xl font-bold text-main-color text-center mb-8">
          Login
        </h2>

        {/* Form */}
        <form method="dialog" className="flex flex-col items-center gap-4">
          <input
            type="text"
            placeholder="Username"
            className="input input-bordered w-full max-w-xs"
          />
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full max-w-xs"
          />

          {/* Centered Button */}
          <Button text={"Login"} color={"#ffa725"} classOther="px-16 mt-4" />
        </form>
      </div>
    </dialog>
  );
};

export default LoginModal;
