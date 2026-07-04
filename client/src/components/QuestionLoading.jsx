import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const QuestionProcessingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const projectId = location.state?.projectId || "null";
    const projectTitle = location.state?.projectTitle || "Product Design"

    useEffect(() => {
        const fetchFirstQuestion = async() => {
          console.log("fetching questions")
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project/${projectId}/startInterview`, {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                })

                if(!response.ok){
                    console.log("Cannot generate first question");
                    navigate('/form');
                }

                const data = await response.json();
                console.log("got question")

                navigate('/interview-room', {
                    state: {
                        question: data.question,
                        interviewId: data.interviewId,
                        projectId,
                        projectTitle
                    }
                })
          
                
              } catch (err) {
                console.log("Error in fetching first question: ", err);
              }
        }

        fetchFirstQuestion();
    },[])

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
            Setting up your interview...
          </h1>
  
          {/* Description */}
          <p className="mt-4 text-gray-500 leading-relaxed">
            We're preparing your AI Judge panel and generating your first question.
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
            Please don't close this window while your session is being initialized.
          </div>
        </div>
      </div>
    );
  };
  
  export default QuestionProcessingPage;