import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Mic, MicOff, PhoneOff, Video, VideoOff, Volume2, Timer } from 'lucide-react'
import { auth } from '../context/firebase.js'

function InterviewerAvatar({ status }) {
  const isSpeaking = status === 'speaking';
  const isListening = status === 'listening';

  return (
    <div className="flex flex-col items-center justify-center gap-6 mb-[50px] md:mb-0 ">
      <div className="relative flex h-28 w-28 items-center justify-center">
        {/* Ripples when AI speaks */}
        {isSpeaking && (
          <>
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 via-blue-500 to-indigo-500 opacity-0 animate-ripple"
              style={{ animationDelay: '0s' }}
            />
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 via-blue-500 to-indigo-500 opacity-0 animate-ripple"
              style={{ animationDelay: '0.6s' }}
            />
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 via-blue-500 to-indigo-500 opacity-0 animate-ripple"
              style={{ animationDelay: '1.2s' }}
            />
          </>
        )}

        {/* Glow behind avatar */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 via-blue-500 to-indigo-500 blur-xl transition-all duration-500 ${isSpeaking ? 'opacity-90 scale-110' : 'opacity-40 scale-100'
            }`}
          aria-hidden
        />

        {/* Avatar circle */}
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 via-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 overflow-hidden border-2 border-white/10">
          <img src="/judge.jpg" className='w-full h-full rounded-full object-cover' />
        </div>
      </div>

      {/* Listening Indicator / Turn State */}
      <div className="h-10 flex flex-col items-center justify-center">
        {isListening ? (
          <span className="text-xs font-semibold text-sky-400 tracking-wider uppercase animate-pulse">Listening... Your Turn</span>
        ) : isSpeaking ? (
          <span className="text-xs font-semibold text-violet-400 tracking-wider uppercase">Judge Speaking...</span>
        ) : (
          <span className="text-xs font-medium text-slate-400">Ready</span>
        )}
      </div>
    </div>
  )
}

function ListeningCircle({ className }) {
  return (
    <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md border border-slate-200 z-10 ${className}`}>
      <div className="flex items-end gap-1 h-5">
        <div className="w-1 bg-blue-500 rounded-full animate-soundWave" style={{ animationDelay: '0.1s' }} />
        <div className="w-1 bg-indigo-500 rounded-full animate-soundWave" style={{ animationDelay: '0.3s' }} />
        <div className="w-1 bg-violet-500 rounded-full animate-soundWave" style={{ animationDelay: '0.5s' }} />
        <div className="w-1 bg-indigo-500 rounded-full animate-soundWave" style={{ animationDelay: '0.2s' }} />
        <div className="w-1 bg-blue-500 rounded-full animate-soundWave" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  )
}

export default function InterviewRoomPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const mobileVideoRef = useRef(null)
  const desktopVideoRef = useRef(null)
  const streamRef = useRef(null)
  const wsRef = useRef(null);

  // Audio ref
  const audioContextRef = useRef(null);
  const workletNodeRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const sourceNodeRef = useRef(null);

  // Audio streaming refs
  const mediaSourceRef = useRef(null);
  const sourceBufferRef = useRef(null);
  const audioQueueRef = useRef([]);
  const isAppendingRef = useRef(false);
  const audioStreamObjRef = useRef(null);
  const audioEndReceivedRef = useRef(false);

  const projectTitle = location.state?.projectTitle || 'Product Design'
  const userName =
    auth.currentUser?.displayName?.split(' ')[0] ||
    'there'

  const projectId = location.state?.projectId || 'null';
  const firstQuestion = location.state?.question || "";
  const firstQuestionAudio = location.state?.audio || "";
  const interviewId = location.state?.interviewId || 'null';
  const duration = location.state?.duration || "300000"; // 10 min
  const startTime = location.state?.startTime || Date.now();

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



  function cleanupAudioStream() {
    if (audioStreamObjRef.current) {
      try {
        audioStreamObjRef.current.pause();
        const oldUrl = audioStreamObjRef.current.src;
        audioStreamObjRef.current.src = "";
        audioStreamObjRef.current.load();
        if (oldUrl && oldUrl.startsWith("blob:")) {
          // delete old temporary audio url from memory
          URL.revokeObjectURL(oldUrl);
        }
      } catch (e) {
        console.error("Error during audio cleanup: ", e);
      }
      audioStreamObjRef.current = null;
    }
  }

  function startAudioStreaming() {
    setStatus("speaking");
    listeningRef.current = false;
    setTranscript("");

    // console.log("6. started");
    // Stop previous playback if any
    cleanupAudioStream();

    audioQueueRef.current = [];
    isAppendingRef.current = false;
    audioEndReceivedRef.current = false;

    const mediaSource = new MediaSource();
    mediaSourceRef.current = mediaSource;

    const audioObj = new Audio();
    audioObj.src = URL.createObjectURL(mediaSource);
    audioStreamObjRef.current = audioObj;

    mediaSource.addEventListener("sourceopen", () => {
      if (mediaSource.sourceBuffers.length > 0) return;
      try {
        const sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg");
        sourceBufferRef.current = sourceBuffer;

        sourceBuffer.addEventListener("updateend", () => {
          isAppendingRef.current = false;
          if (audioQueueRef.current.length > 0) {
            const nextChunk = audioQueueRef.current.shift();
            isAppendingRef.current = true;
            sourceBuffer.appendBuffer(nextChunk);
          } else if (audioEndReceivedRef.current) {
            if (mediaSource.readyState === "open") {
              mediaSource.endOfStream();
            }
          }
        });
      } catch (err) {
        console.error("Error adding SourceBuffer: ", err);
      }
    }, { once: true });

    audioObj.onended = () => {
      if (audioStreamObjRef.current === audioObj) {
        audioStreamObjRef.current = null;
      }
      listeningRef.current = true;
      setStatus("listening");
    };

    // console.timeEnd('sst-latency');
    audioObj.play().catch(err => console.log("Streaming audio play failed: ", err));
  }

  function playBase64Audio(base64Audio) {
    // console.log("2. first audio plays");
    setStatus("speaking");
    listeningRef.current = false;
    setTranscript("");

    cleanupAudioStream();

    const audioUrl = `data:audio/mp3;base64,${base64Audio}`;
    const audioObj = new Audio(audioUrl);
    audioStreamObjRef.current = audioObj;

    audioObj.onended = () => {
      if (audioStreamObjRef.current === audioObj) {
        audioStreamObjRef.current = null;
      }
      listeningRef.current = true;
      setStatus("listening");
    };

    audioObj.play().catch(err => {
      console.log("Audio play failed: ", err);
      listeningRef.current = true;
      setStatus("listening");
    });
  }



  function handleAudioChunk(base64Chunk) {
    const binaryString = atob(base64Chunk);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const arrayBuffer = bytes.buffer;

    const sourceBuffer = sourceBufferRef.current;
    if (sourceBuffer && !isAppendingRef.current && sourceBuffer.updating === false) {
      isAppendingRef.current = true;
      try {
        sourceBuffer.appendBuffer(arrayBuffer);
        if (audioStreamObjRef.current && audioStreamObjRef.current.paused) {
          audioStreamObjRef.current.play().catch(() => { });
        }
      } catch (e) {
        console.error("Error appending buffer: ", e);
      }
    } else {
      audioQueueRef.current.push(arrayBuffer);
    }
  }

  function handleAudioEnd() {
    audioEndReceivedRef.current = true;
    const mediaSource = mediaSourceRef.current;
    const sourceBuffer = sourceBufferRef.current;
    if (mediaSource && sourceBuffer && !isAppendingRef.current && sourceBuffer.updating === false) {
      if (mediaSource.readyState === "open") {
        mediaSource.endOfStream();
      }
    }
  }

  useEffect(() => {
    startMicrophoneStreaming();
    if (firstQuestionAudio) {
      // console.log("1. first audio exist");
      playBase64Audio(firstQuestionAudio);
    } else {
      // console.log("1. first audio not exist");
      setStatus("listening");
      listeningRef.current = true;
    }
    return () => {
      stopMicrophoneStreaming();
      cleanupAudioStream();
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

  // Capture audio from microphone and convert it to PCM
  async function startMicrophoneStreaming() {

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

    // Audio engine that manages audio graph
    audioContextRef.current =
      new AudioContext({
        sampleRate: 16000
      });

    await audioContextRef.current.audioWorklet.addModule(
      "/audio-processor.js"
    );

    sourceNodeRef.current =
      audioContextRef.current.createMediaStreamSource(stream);

    // custom node to process audio stream
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
      `${import.meta.env.VITE_BACKEND_WS_URL}/interview?interviewId=${interviewId}&projectId=${projectId}`
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
          startAudioStreaming();

          break;

        case "audio_chunk":
          handleAudioChunk(data.audio);
          break;

        case "audio_end":
          handleAudioEnd();
          break;



        case "partial_transcript":

          setTranscript(data.text);

          break;

        case "committed_transcript":
          // console.time('sst-latency');
          setTranscript(data.text);
          // console.log("final_transcript: ", data.text);

          listeningRef.current = false;
          setStatus("idle");
          lastAnswer.current = data.text;

          break;

        case "interview_end": {
          setQuestion("We've reached the end of the interview. Thank you for your presentation.")
          startAudioStreaming();
          const checkAndEnd = () => {
            if (audioStreamObjRef.current) {
              audioStreamObjRef.current.onended = () => {
                endInterview();
              };
            } else {
              endInterview();
            }
          };
          setTimeout(checkAndEnd, 500);

          break;
        }

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

    // console.log("stopping the microphone");
    workletNodeRef.current?.disconnect();

    sourceNodeRef.current?.disconnect();

    mediaStreamRef.current
      ?.getTracks()
      .forEach(track => track.stop());

    await audioContextRef.current?.close();
  }

  async function endInterview(errorMsg) {
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
        if (mobileVideoRef.current) {
          mobileVideoRef.current.srcObject = stream
        }
        if (desktopVideoRef.current) {
          desktopVideoRef.current.srcObject = stream
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
    if (cameraOn) {
      if (mobileVideoRef.current && mobileVideoRef.current.srcObject !== stream) {
        mobileVideoRef.current.srcObject = stream
        mobileVideoRef.current.play().catch(() => { })
      }
      if (desktopVideoRef.current && desktopVideoRef.current.srcObject !== stream) {
        desktopVideoRef.current.srcObject = stream
        desktopVideoRef.current.play().catch(() => { })
      }
    }
  }, [cameraOn])

  function handleEndCall() {
    endInterview();
  }

  return (
    <div className="min-h-screen bg-slate-955 sm:bg-gradient-to-br sm:from-sky-50 sm:via-white sm:to-blue-50 px-0 py-0 sm:px-4 sm:py-6 md:px-6 md:py-8 flex flex-col justify-center items-center">
      <div className="w-full min-h-screen sm:min-h-0 sm:mx-auto sm:max-w-5xl sm:rounded-3xl sm:border border-transparent sm:border-sky-100 bg-slate-950 sm:bg-white/90 p-4 sm:p-6 md:p-8 shadow-2xl sm:shadow-xl sm:shadow-sky-100/60 backdrop-blur-sm flex flex-col justify-between sm:justify-start">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs sm:text-sm text-slate-400">Mock Interview</p>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white sm:text-slate-900">
              {projectTitle}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span
              className="shrink-0 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold transition-colors bg-emerald-500/10 sm:bg-emerald-100 text-emerald-400 sm:text-emerald-700 border border-emerald-500/20 sm:border-transparent"
            >
              <Timer className="inline w-4 sm:w-5 mr-1 mb-0.5" />
              {String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}
            </span>
            <span
              className={`shrink-0 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold transition-colors ${connected
                ? 'bg-emerald-500/10 sm:bg-emerald-100 text-emerald-400 sm:text-emerald-700 border border-emerald-500/20 sm:border-transparent'
                : 'bg-amber-500/10 sm:bg-amber-100 text-amber-400 sm:text-amber-700 border border-amber-500/20 sm:border-transparent'
                }`}
            >
              {connected ? 'Connected' : 'Connecting…'}
            </span>
          </div>
        </div>

        {/* Video panels */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* AI Interviewer (Desktop) / Combined Call Screen (Mobile) */}
          <div className="relative flex aspect-[4/4] md:aspect-[4/3] items-center justify-center rounded-2xl bg-slate-900 p-5 shadow-inner">
            <InterviewerAvatar status={status} />

            {/* User Camera Overlay (Mobile only) */}
            <div className="absolute bottom-4 right-4 w-28 h-36 rounded-2xl overflow-hidden bg-slate-950 border border-white/20 shadow-lg md:hidden">
              <video
                ref={mobileVideoRef}
                autoPlay
                playsInline
                muted
                className={`h-full w-full object-cover ${cameraOn ? 'block' : 'hidden'}`}
              />
              {!cameraOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                  <VideoOff className="h-6 w-6 text-slate-500" aria-hidden />
                </div>
              )}
            </div>

            {/* Listening Circle (Mobile/Desktop overlay corner) */}
            {status === 'listening' && (
              <ListeningCircle className="absolute bottom-4 left-4" />
            )}
          </div>

          {/* Desktop User Camera Panel */}
          <div className="relative hidden md:block aspect-[4/3] overflow-hidden rounded-2xl bg-slate-900">
            <video
              ref={desktopVideoRef}
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

        {/* Desktop Controls (hidden on mobile) */}
        <div className="mt-5 hidden md:flex items-center justify-between px-2">
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
              className="rounded-full bg-red-500 p-3.5 text-white shadow-md shadow-red-500/30 transition hover:bg-red-650"
              aria-label="End call"
            >
              <PhoneOff className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => setCameraOn((on) => !on)}
              className={`rounded-full p-3.5 shadow-sm transition ${cameraOn
                ? 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'
                : 'bg-slate-200 text-slate-650'
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

        {/* Mobile Controls (hidden on desktop) */}
        <div className="mt-8 flex md:hidden justify-center items-center gap-4">
          <button
            type="button"
            onClick={() => setMicOn((on) => !on)}
            className={`rounded-full p-4 shadow-md transition-all active:scale-95 cursor-pointer ${micOn
              ? 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700'
              : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
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
            className="rounded-full bg-red-650 text-white p-4 shadow-lg shadow-red-950/20 transition-all hover:bg-red-700 active:scale-95 cursor-pointer"
            aria-label="End call"
          >
            <PhoneOff className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => setCameraOn((on) => !on)}
            className={`rounded-full p-4 shadow-md transition-all active:scale-95 cursor-pointer ${cameraOn
              ? 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700'
              : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
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

        {/* Desktop Transcript (hidden on mobile) */}
        <div className="mt-6 hidden md:block rounded-2xl bg-slate-800 p-4 sm:p-5">
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
                      <p>{status === "thinking" ? "Thinking..." : question}</p>
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

        {/* Mobile Question & Transcript (hidden on desktop) */}
        <div className="mt-8 flex md:hidden flex-col items-center text-center px-4 max-w-2xl mx-auto gap-4">
          {error ? (
            <p className="text-red-400 text-sm font-medium">{error}</p>
          ) : (
            <>
              {question && (
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wider text-violet-400 font-bold">
                    Question
                  </p>
                  <h2 className="text-base font-bold text-white leading-relaxed">
                    {question}
                  </h2>
                </div>
              )}
              {transcript && (
                <div className="space-y-1 mt-2">
                  <p className="text-xs uppercase tracking-wider text-sky-400 font-bold">
                    Your Answer
                  </p>
                  <p className="text-sm text-slate-400 leading-relaxed italic">
                    "{transcript}"
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}