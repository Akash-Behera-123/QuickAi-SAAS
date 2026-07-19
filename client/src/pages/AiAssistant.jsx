import React, { useState } from "react";
import { Bot, Send } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AiAssistant = () => {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();

  const handleAskAI = async () => {
    if (!message.trim()) {
      return toast.error("Please enter a question");
    }

    try {
      setLoading(true);
      setReply("");

      const { data } = await axios.post(
        "/api/ai/chat",
        {
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (data.success) {
        setReply(data.reply);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">

      {/* Left Panel */}
      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-lg p-5">

        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-[#7C3AED]" />
          <h1 className="text-xl font-semibold">
            AI Assistant
          </h1>
        </div>

        <p className="mt-6 text-sm font-medium">
          Ask anything
        </p>

        <textarea
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full mt-2 p-3 rounded-lg border border-gray-300 outline-none resize-none"
          placeholder="Ask me anything..."
        />

        <button
          onClick={handleAskAI}
          disabled={loading}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white py-2.5 rounded-lg disabled:opacity-70"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <Send className="w-5 h-5" />
          )}

          {loading ? "Thinking..." : "Ask AI"}
        </button>

      </div>

      {/* Right Panel */}
      <div className="flex-1 min-w-[320px]">

        <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-[500px]">

          <div className="flex items-center gap-2">

            <Bot className="w-5 h-5 text-[#7C3AED]" />

            <h2 className="text-lg font-semibold">
              Conversation
            </h2>

          </div>

          <div className="mt-8">

            {reply ? (
              <div className="bg-gray-50 border rounded-lg p-5 whitespace-pre-wrap leading-7">
                {reply}
              </div>
            ) : (
              <div className="flex justify-center items-center h-[350px]">

                <div className="text-center">

                  <Bot className="w-12 h-12 mx-auto text-gray-300" />

                  <p className="mt-4 text-gray-400">
                    Start chatting with QuickAI Assistant
                  </p>

                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default AiAssistant;