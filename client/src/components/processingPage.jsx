import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

const ProcessingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const lastAnswer = location.state?.lastAnswer || ""
  const interviewId = location.state?.interviewId || "null"
  const interviewError = location.state?.error || "";



  useEffect(() => {
    if (interviewError) {
      console.log("Bypassing finalization due to interview error: ", interviewError);
      navigate('/dashboard', {
        state: {
          interviewError
        }
      });
      return;
    }

    const generateSummary = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project/finalize`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            interviewId,
            lastAnswer
          })
        })

        if (!response.ok) {
          console.log("Error in generating summary")
          navigate('/dashboard', {
            state: {
              interviewError: "Error in generating summary"
            }
          });
          return;
        }

        const data = await response.json();
        console.log("Summary: ", data.message);
        navigate('/dashboard', {
          state: {
            userId: data.userId,
            interviewError
          }
        });
      } catch (err) {
        console.log("Error in generating summary: ", err);
        navigate('/dashboard', {
          state: {
            interviewError: "Error in generating summary: " + err.message
          }
        });
      }
    }

    generateSummary();
  }, [interviewError, interviewId, lastAnswer, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-6">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-xl border border-green-100 p-10 text-center">

        {/* Spinner */}
        <div className="flex justify-center mb-8">
          <div className="relative h-20 w-20">
            <div className="absolute inset-0 rounded-full border-4 border-green-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-green-600 border-t-transparent animate-spin"></div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-800">
          Processing...
        </h1>

        {/* Description */}
        <p className="mt-4 text-gray-500 leading-relaxed">
          We're analyzing your interview and generating your report.
          This may take a few moments.
        </p>

        {/* Animated Dots */}
        <div className="flex justify-center gap-2 mt-8">
          <span className="h-3 w-3 rounded-full bg-green-600 animate-bounce [animation-delay:-0.3s]" />
          <span className="h-3 w-3 rounded-full bg-green-600 animate-bounce [animation-delay:-0.15s]" />
          <span className="h-3 w-3 rounded-full bg-green-600 animate-bounce" />
        </div>

        {/* Optional Info */}
        <div className="mt-10 rounded-xl bg-green-50 p-4 text-sm text-green-700">
          Please don't close this window while your results are being prepared.
        </div>
      </div>
    </div>
  );
};

export default ProcessingPage;