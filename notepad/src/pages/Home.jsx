import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../utils/supabase";

const Home = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);

    try {
      const { data: privateRoom } = await supabase
        .from("locked_rooms")
        .select("code")
        .eq("code", code.trim())
        .single();

      if (privateRoom) {
        sessionStorage.removeItem(`auth_${code.trim()}`);
        navigate(`/private/${code.trim()}`);
        return;
      }

      navigate(`/${code.trim()}`);
    } catch (err) {
      navigate(`/${code.trim()}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen px-4 flex flex-col items-center justify-center space-y-10">
      <div className="text-center flex flex-col items-center justify-center">
        <h1 className="text-5xl sm:text-7xl md:text-[8rem] italic leading-tight m-0 p-0">
          Notiqo
        </h1>
        <p className="text-base sm:text-lg text-neutral-700 mt-2">
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
          placeholder="Set a code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="bg-gray-100 w-full py-3 text-center text-base sm:text-lg border text-neutral-900 border-gray-600 rounded-full focus:outline-none focus:border-white transition"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-neutral-700 text-white py-3 rounded-full hover:bg-neutral-200 transition duration-200 text-base sm:text-lg font-medium hover:text-black disabled:opacity-50"
        >
          {loading ? "Loading..." : "Enter"}
        </button>
      </form>

      <div className="w-full flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-8 text-sm text-neutral-600 mt-12">
        <Link to="/private" className="text-black hover:underline">Create Private Room</Link>
        <Link to="/about" className="text-black hover:underline">About</Link>
        <Link to="/content" className="text-black hover:underline">Content Policy</Link>
      </div>
    </section>
  );
};

export default Home;
