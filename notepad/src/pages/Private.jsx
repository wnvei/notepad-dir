import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../utils/supabase";

const Private = () => {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim() || !password.trim()) {
      setError("Code and password are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data: normalRoom } = await supabase
        .from("notes")
        .select("code")
        .eq("code", code.trim())
        .single();

      if (normalRoom) {
        setError("A normal room with this code already exists");
        setLoading(false);
        return;
      }

      const { data: privateRoom } = await supabase
        .from("locked_rooms")
        .select("code, password")
        .eq("code", code.trim())
        .single();

      if (privateRoom) {
        if (privateRoom.password === password) {
          sessionStorage.setItem(`auth_${code.trim()}`, "true");
          navigate(`/private/${code.trim()}`);
        } else {
          setError("Invalid credentials");
        }
      } else {
        const { error: insertError } = await supabase
          .from("locked_rooms")
          .insert({ code: code.trim(), password, content: "" });

        if (insertError) {
          setError("Error creating room: " + insertError.message);
        } else {
          sessionStorage.setItem(`auth_${code.trim()}`, "true");
          navigate(`/private/${code.trim()}`);
        }
      }
    } catch (err) {
      setError("An error occurred");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <section className="min-h-screen px-4 flex flex-col items-center justify-center space-y-10">
      <div className="text-center flex flex-col items-center justify-center">
        <h1 className="text-5xl sm:text-7xl md:text-[8rem] italic leading-tight m-0 p-0">
          Notiqo
        </h1>
        <p className="text-base sm:text-lg text-neutral-700 mt-2 text-center">
          <span className="font-bold text-neutral-900 italic">Smarter. Faster. Better.</span> Write{" "}
          <span className="font-semibold text-neutral-900 italic">Together</span>, from{" "}
          <span className="font-semibold text-neutral-900 italic">Anywhere</span>.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center space-y-4 w-full max-w-md"
      >
        <input
          type="text"
          placeholder="Set a room code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="bg-gray-100 w-full py-3 text-center text-base sm:text-lg border text-neutral-900 border-gray-600 rounded-full focus:outline-none focus:border-white transition"
        />

        <input
          type="password"
          placeholder="Set a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-gray-100 w-full py-3 text-center text-base sm:text-lg border text-neutral-900 border-gray-600 rounded-full focus:outline-none focus:border-white transition"
        />

        {error && (
          <div className="text-red-500 text-sm font-medium text-center">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-neutral-700 text-white py-3 rounded-full hover:bg-neutral-200 transition duration-200 text-base sm:text-lg font-medium hover:text-black disabled:opacity-50"
        >
          {loading ? "Processing..." : "Enter"}
        </button>
      </form>
    </section>
  );
};

export default Private;
