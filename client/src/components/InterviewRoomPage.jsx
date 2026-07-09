import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Mic, MicOff, PhoneOff, Video, VideoOff, Volume2, Timer } from 'lucide-react'
import { auth } from '../context/firebase.js'

function InterviewerAvatar({ status }) {
  const isSpeaking = status === 'speaking';
  const isListening = status === 'listening';

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative flex h-24 w-24 items-center justify-center">
        {/* Ripples when AI speaks */}
        {isSpeaking && (
          <>
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-400 via-blue-400 to-indigo-500 opacity-0 animate-ripple"
              style={{ animationDelay: '0s' }}
            />
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-400 via-blue-400 to-indigo-500 opacity-0 animate-ripple"
              style={{ animationDelay: '0.6s' }}
            />
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-400 via-blue-400 to-indigo-500 opacity-0 animate-ripple"
              style={{ animationDelay: '1.2s' }}
            />
          </>
        )}

        {/* Glow behind avatar */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-br from-violet-400 via-blue-400 to-indigo-500 blur-xl transition-all duration-500 ${isSpeaking ? 'opacity-85 scale-110' : 'opacity-40 scale-100'
            }`}
          aria-hidden
        />

        {/* Avatar circle */}
        <div className="relative flex h-20 w-30 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 via-blue-500 to-indigo-600 shadow-lg shadow-blue-500/40">
          <img src="/judge.jpg" className='w-30 rounded-full object-cover' />
        </div>
      </div>

      {/* Listening Indicator / Turn State */}
      <div className="h-12 flex flex-col items-center justify-center">
        {isListening ? (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-end gap-1.5 h-6">
              <div className="w-1.5 bg-blue-500 rounded-full animate-soundWave" style={{ animationDelay: '0.1s' }} />
              <div className="w-1.5 bg-indigo-500 rounded-full animate-soundWave" style={{ animationDelay: '0.3s' }} />
              <div className="w-1.5 bg-violet-500 rounded-full animate-soundWave" style={{ animationDelay: '0.5s' }} />
              <div className="w-1.5 bg-indigo-500 rounded-full animate-soundWave" style={{ animationDelay: '0.2s' }} />
              <div className="w-1.5 bg-blue-500 rounded-full animate-soundWave" style={{ animationDelay: '0.4s' }} />
            </div>
            <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase animate-pulse">Listening... Your Turn</span>
          </div>
        ) : isSpeaking ? (
          <span className="text-xs font-semibold text-violet-600 tracking-wider uppercase">Judge Speaking...</span>
        ) : (
          <span className="text-xs font-medium text-slate-400">Ready</span>
        )}
      </div>
    </div>
  )
}

export default function InterviewRoomPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const wsRef = useRef(null);

  // Audio ref
  const audioContextRef = useRef(null);
  const workletNodeRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const playingAudioRef = useRef(null);

  const projectTitle = location.state?.projectTitle || 'Product Design'
  const userName =
    auth.currentUser?.displayName?.split(' ')[0] ||
    'there'

  const projectId = location.state?.projectId || 'null';
  const firstQuestion = location.state?.question || "";
  const interviewId = location.state?.interviewId || 'null';
  const audio = location.state?.audio || 'null';
  const duration = location.state?.duration || "300000"; // 10 min
  const [startTime] = useState(() => location.state?.startTime || Date.now());

  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)
  const [connected, setConnected] = useState(false)
  const [question, setQuestion] = useState(firstQuestion);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(duration);
  const [status, setStatus] = useState("speaking"); // 'speaking' | 'listening' | 'idle'

  const listeningRef = useRef(false);
  const lastAnswer = useRef("");
  const timeUp = useRef(false);
  console.log("starting listening ref: ", listeningRef.current);

  const seconds = Math.floor(timeLeft / 1000);

  // set Timer
  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = duration - (Date.now() - startTime);

      if (remaining <= 0) {
        timeUp.current = true;
        setTimeLeft(0);
        clearInterval(timer);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(timer)
  }, [duration, startTime])

  function playAudio(base64Audio, onEnd) {
    setStatus("speaking");
    console.log("Listening ref inside playaudio: ", listeningRef.current);
    listeningRef.current = false;
    setTranscript("");

    if (playingAudioRef.current) {
      playingAudioRef.current.pause();
    }

    const blob = new Blob(
      [
        Uint8Array.from(
          atob(base64Audio),
          c => c.charCodeAt(0)
        )
      ],
      { type: "audio/mpeg" }
    );

    const url = URL.createObjectURL(blob);

    const audioObj = new Audio(url);
    playingAudioRef.current = audioObj;

    audioObj.onended = () => {
      console.log("Audio ended");
      URL.revokeObjectURL(url);
      if (playingAudioRef.current === audioObj) {
        playingAudioRef.current = null;
      }

      if (onEnd) {
        setStatus("idle");
        onEnd();
      } else {
        listeningRef.current = true;
        console.log("Listening ref inside end: ", listeningRef.current);
        setStatus("listening");
      }
    };

    audioObj.play().catch(err => console.log("Audio playback failed: ", err));
  };

  useEffect(() => {
    startMicrophoneStreaming();
    playAudio(audio);
    return () => {
      stopMicrophoneStreaming();
      if (playingAudioRef.current) {
        playingAudioRef.current.pause();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Convert raw audio sample from 32bit to 16bit
  function floatTo16BitPCM(float32Array) {

    const int16 = new Int16Array(float32Array.length);

    for (let i = 0; i < float32Array.length; i++) {

      const s = Math.max(-1, Math.min(1, float32Array[i]));

      int16[i] = s < 0
        ? s * 0x8000
        : s * 0x7FFF;
    }

    return int16;
  }

  // Start microphone streaming and convert audio to PCM
  async function startMicrophoneStreaming() {

    console.log("Listening...");

    const stream =
      await navigator.mediaDevices.getUserMedia({

        audio: {

          channelCount: 1,

          echoCancellation: true,

          noiseSuppression: true,

          autoGainControl: true

        }

      });

    mediaStreamRef.current = stream;

    // Apply initial mute state
    stream.getAudioTracks().forEach((track) => {
      track.enabled = micOn;
    });

    audioContextRef.current =
      new AudioContext({
        sampleRate: 16000
      });

    console.log(audioContextRef.current.sampleRate);

    await audioContextRef.current.audioWorklet.addModule(
      "/audio-processor.js"
    );

    sourceNodeRef.current =
      audioContextRef.current.createMediaStreamSource(stream);

    workletNodeRef.current =
      new AudioWorkletNode(
        audioContextRef.current,
        "audio-processor"
      );

    sourceNodeRef.current.connect(workletNodeRef.current);

    // Optional: keep node alive without audible output
    const gain = audioContextRef.current.createGain();
    gain.gain.value = 0;

    workletNodeRef.current.connect(gain);
    gain.connect(audioContextRef.current.destination);

    workletNodeRef.current.port.onmessage = (event) => {

      if (!listeningRef.current) return;

      const float32 = event.data;

      const pcm16 = floatTo16BitPCM(float32);

      if (
        wsRef.current &&
        wsRef.current.readyState === WebSocket.OPEN
      ) {
        wsRef.current.send(pcm16.buffer);

      }

    };
  };


  // Connection to backend websocket
  useEffect(() => {
    const ws = new WebSocket(
      `ws://localhost:3000/interview?interviewId=${interviewId}&projectId=${projectId}`
    );

    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Connected");
    };

    ws.onmessage = async (event) => {

      const data = JSON.parse(event.data);

      switch (data.type) {

        case "question":

          setQuestion(data.question);

          playAudio(data.audio);

          break;

        case "partial_transcript":

          setTranscript(data.text);
          console.log("partial_transcript: ", data.text);

          break;

        case "committed_transcript":

          setTranscript(data.text);
          console.log("final_transcript: ", data.text);

          listeningRef.current = false;
          console.log("Listening ref after final answer: ", listeningRef.current);
          setStatus("idle");
          lastAnswer.current = data.text;

          break;

        case "interview_end":
          playAudio(data.audio, () => {
            endInterview();
          });

          break;

        case "error":

          setError(data.message);
          console.log("Received error in error case: ", data.message);
          endInterview(data.message);

          break;
      }

    };


    return () => ws.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewId, projectId]);

  // Stop microphone streaming
  async function stopMicrophoneStreaming() {

    console.log("stopping the microphone");
    workletNodeRef.current?.disconnect();

    sourceNodeRef.current?.disconnect();

    mediaStreamRef.current
      ?.getTracks()
      .forEach(track => track.stop());

    await audioContextRef.current?.close();
  }

  async function endInterview(errorMsg) {
    console.log("Inside end interview");
    stopMicrophoneStreaming();
    navigate('/processing', {
      state: {
        lastAnswer: lastAnswer.current,
        interviewId,
        error: errorMsg || error
      }
    })
  }


  // Camera setup
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
          audio: false,
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
    const stream = mediaStreamRef.current
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
    endInterview();
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

          <div>
            <span
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors mx-4 bg-emerald-100 text-emerald-700
                }`}
            >
              <Timer className='inline w-6 mr-1 mb-1' /> {String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}
            </span>
            <span
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${connected
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-amber-100 text-amber-700'
                }`}
            >
              {connected ? 'Connected' : 'Connecting…'}
            </span>
          </div>
        </div>

        {/* Video panels */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-slate-100 sm:aspect-auto sm:min-h-[280px]">
            <InterviewerAvatar status={status} />
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
              {error ? (
                <p className="text-red-400">{error}</p>
              ) : (
                <>
                  {question && (
                    <div>
                      <p className="mb-1 text-xs font-medium text-slate-400">
                        "AI Interviewer"
                      </p>
                      <p>{timeUp.current ? "We've reached the end of the interview. Thank you for your presentation." : status === "thinking" ? "Thinking..." : question}</p>
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