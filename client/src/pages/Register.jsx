import { useState } from "react";
import ButtonMod from "./../components/shared/main/ButtonMod";
import { signup } from "../api/auth";
const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const data = await signup({ username, email, password });
      console.log("Register Success:", data);
    } catch (err) {
      console.log("Register failed:", err.response?.data || err.message);
    }
  };

  return (
    <main className="flex justify-center items-center w-full min-h-screen">
      <form onSubmit={handleSignup}>
        <div className="card bg-white w-96 card-xl shadow-md">
          <div className="card-body">
            <h2 className="text-2xl font-bold text-main-color text-center mb-8">
              Welcome To SEE<span className="text-third-color">CIPE</span>
            </h2>
            {/* Username */}
            <input
              className="input validator"
              required
              placeholder="Usesrname"
              pattern="[A-Za-z][A-Za-z0-9\-]*"
              minlength="3"
              maxlength="30"
              title="Only letters, numbers or dash"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <p className="validator-hint mt-0">
              Must be 3 to 30 characters
              <br />
              containing only letters, numbers or dash
            </p>

            {/* Email */}
            <input
              className="input validator"
              type="email"
              required
              placeholder="mail@site.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="validator-hint">Enter valid email address</div>

            {/* Password */}
            <input
              className="input validator"
              type="password"
              required
              placeholder="Password"
              minLength="8"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="validator-hint">
              Must be more than 8 characters, including
              <br />
              At least one number
              <br />
              At least one lowercase letter
              <br />
              At least one uppercase letter
            </p>

            {/* Button submit */}
            <div className="justify-center card-actions">
              <button type="submit">
                <ButtonMod
                  text={"Sign up"}
                  color={"#ffa725"}
                  classOther="px-16"
                />
              </button>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
};
export default Register;
