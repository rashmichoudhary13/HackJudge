import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Mic, MicOff, PhoneOff, Video, VideoOff, Volume2 } from 'lucide-react'
import { auth } from '../context/auth'
import recognition from '../context/speechRecognitionConfig';

const WELCOME_MESSAGE =
  'Hey! {name}, Welcome to the Mock Interview, I am your interviewer today'

function InterviewerAvatar() {
  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-400 via-blue-400 to-indigo-500 opacity-60 blur-xl"
        aria-hidden
      />
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 via-blue-500 to-indigo-600 shadow-lg shadow-blue-500/40">
        <span className="text-3xl font-bold text-white">S</span>
      </div>
    </div>
  )
}

export default function InterviewRoomPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const projectTitle = location.state?.projectTitle || 'Product Design'
  const userName =
    location.state?.userName ||
    auth.currentUser?.displayName?.split(' ')[0] ||
    'there'
  const projectId = location.state?.projectId || 'null';
  const firstQuestion = location.state?.question || "";
  const interviewId = location.state?.interviewId || 'null';

  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)
  const [connected, setConnected] = useState(false)
  const [question, setQuestion] = useState(firstQuestion);
  const [transcript, setTranscript] = useState("");

  const welcomeText = WELCOME_MESSAGE.replace('{name}', userName)
  const questionText = `Question 1/5 : ${welcomeText}`

  useEffect(() => {
    console.log("Question effect:", question);

    if (question) {
      speak(question);
    }
  }, [question]);

  const speak = (text) => {
    try {
      const utterance = new SpeechSynthesisUtterance(text);

      utterance.rate = 1;
      utterance.pitch = 1;

      utterance.onend = () => {
        startListening();
      };

      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    } catch (err) {
      console.log("Can't speak: ", err);
    }
  };

  const startListening = () => {
    try {
      recognition.start();
      console.log("Listening....");
    } catch (err) {
      console.log("Listening error: ", err);
    }
  };

  useEffect(() => {

    recognition.onstart = () => console.log("Recognition started");

    recognition.onresult = (event) => {
      console.log("Onresult....");
      let currentTranscript = "";

      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }

      setTranscript(currentTranscript);
    };

    recognition.onend = () => {

      console.log("onend...");

      setTranscript((current) => {
        const trimmed = current.trim();

        if (!trimmed) return "";

        fetchQuestion(trimmed);

        return "";
      });
    };

    return () => {
      recognition.onresult = null;
      recognition.onend = null;
    };
  }, []);

  const fetchQuestion = async (answer) => {
    try {
      console.log("1");
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project/${projectId}/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          interviewId,
          answer
        }),
      })

      console.log("2");

      const result = await response.json();

      if (!response.ok) {
        console.log("Error in response: ", result.message);
      }

      const nxtquestion = result.question;

      console.log("Question: ", nxtquestion);

      setQuestion(nxtquestion);

    } catch (err) {
      console.log("Question error: ", err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setConnected(true)
    }, 600)

    return () => clearTimeout(timer)
  }, [])

  // To start a camera
  useEffect(() => {
    let cancelled = false

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch {
        setCameraOn(false)
        setMicOn(false)
      }
    }

    startCamera()

    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  useEffect(() => {
    const stream = streamRef.current
    if (!stream) return
    stream.getAudioTracks().forEach((track) => {
      track.enabled = micOn
    })
  }, [micOn])

  useEffect(() => {
    const stream = streamRef.current
    if (!stream) return
    stream.getVideoTracks().forEach((track) => {
      track.enabled = cameraOn
    })
    if (cameraOn && videoRef.current && videoRef.current.srcObject !== stream) {
      videoRef.current.srcObject = stream
      videoRef.current.play().catch(() => { })
    }
  }, [cameraOn])

  function handleEndCall() {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    speechSynthesis.cancel();
    recognition.abort();
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl rounded-3xl border border-sky-100 bg-white/90 p-5 shadow-xl shadow-sky-100/60 backdrop-blur-sm sm:p-8">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">Mock Interview</p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {projectTitle}
            </h1>
          </div>
          <span
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${connected
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-amber-100 text-amber-700'
              }`}
          >
            {connected ? 'Connected' : 'Connecting…'}
          </span>
        </div>

        {/* Question */}
        <p className="mb-5 text-center text-sm text-slate-600 sm:text-base">
          {questionText}
        </p>

        {/* Video panels */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-slate-100 sm:aspect-auto sm:min-h-[280px]">
            <InterviewerAvatar />
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-900 sm:aspect-auto sm:min-h-[280px]">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`h-full w-full object-cover ${cameraOn ? 'block' : 'hidden'}`}
            />
            {!cameraOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                <VideoOff className="h-10 w-10 text-slate-500" aria-hidden />
              </div>
            )}
            <span className="absolute bottom-3 left-3 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {userName}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-5 flex items-center justify-between px-2">
          <button
            type="button"
            className="rounded-full p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Volume"
          >
            <Volume2 className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMicOn((on) => !on)}
              className={`rounded-full p-3.5 shadow-sm transition ${micOn
                ? 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'
                : 'bg-slate-200 text-slate-600'
                }`}
              aria-label={micOn ? 'Mute microphone' : 'Unmute microphone'}
            >
              {micOn ? (
                <Mic className="h-5 w-5" />
              ) : (
                <MicOff className="h-5 w-5" />
              )}
            </button>

            <button
              type="button"
              onClick={handleEndCall}
              className="rounded-full bg-red-500 p-3.5 text-white shadow-md shadow-red-500/30 transition hover:bg-red-600"
              aria-label="End call"
            >
              <PhoneOff className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => setCameraOn((on) => !on)}
              className={`rounded-full p-3.5 shadow-sm transition ${cameraOn
                ? 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'
                : 'bg-slate-200 text-slate-600'
                }`}
              aria-label={cameraOn ? 'Turn off camera' : 'Turn on camera'}
            >
              {cameraOn ? (
                <Video className="h-5 w-5" />
              ) : (
                <VideoOff className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className="w-10" aria-hidden />
        </div>

        {/* Transcript */}
        <div className="mt-6 rounded-2xl bg-slate-800 p-4 sm:p-5">
          <div className="flex gap-3">
            <div className="mt-0.5 shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-sm font-bold text-white">
                S
              </div>
            </div>
            <div className="min-w-0 space-y-3 text-sm leading-relaxed text-slate-200">
              {!question && !transcript ? (
                <p className="text-slate-400">Waiting for interviewer…</p>
              ) : (
                <>
                  {question && (
                    <div>
                      <p className="mb-1 text-xs font-medium text-slate-400">
                        "AI Interviewer"
                      </p>
                      <p>{question}</p>
                    </div>
                  )}
                  {transcript && (
                    <div>
                      <p className="mb-1 text-xs font-medium text-slate-400">
                        {userName}
                      </p>
                      <p className="text-slate-400">{transcript}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
