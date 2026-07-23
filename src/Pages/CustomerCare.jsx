import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../api';

function CustomerCare() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [orders, setOrders] = useState([]);
  const [callHistory, setCallHistory] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingCalls, setLoadingCalls] = useState(false);

  // Support form state
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  // Active call state
  const [activeCall, setActiveCall] = useState(null); // { orderId, partnerName, phone }
  const [callStatus, setCallStatus] = useState('Disconnected'); // Disconnected, Ringing, Connected, Ended
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [simulatedTranscription, setSimulatedTranscription] = useState('');

  // Audio recording refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const callTimerRef = useRef(null);
  const transcriptionTimerRef = useRef(null);

  // Load user and authentication details
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  // Fetch orders and call history when token is loaded
  useEffect(() => {
    if (token) {
      fetchOrders();
      fetchCallHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Track call timer
  useEffect(() => {
    if (callStatus === 'Connected') {
      callTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    }

    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [callStatus]);

  const fetchOrders = () => {
    setLoadingOrders(true);
    fetch(`${API_BASE_URL}/api/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch orders');
        return res.json();
      })
      .then((data) => {
        setOrders(data);
        setLoadingOrders(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingOrders(false);
      });
  };

  const fetchCallHistory = () => {
    setLoadingCalls(true);
    fetch(`${API_BASE_URL}/api/calls`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch call history');
        return res.json();
      })
      .then((data) => {
        setCallHistory(data);
        setLoadingCalls(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingCalls(false);
      });
  };

  // Support ticket form submission
  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubject('');
      setTicketMessage('');
      setTicketSubmitted(false);
      alert('Support ticket submitted successfully! Our agents will contact you shortly.');
    }, 1500);
  };

  // Start Call Simulation
  const startCall = async (orderId) => {
    const deliveryPartners = [
      { name: 'Alice Smith', company: 'Delhivery', phone: '+91 98765 43210' },
      { name: 'Amit Singh', company: 'Blue Dart', phone: '+91 99887 76655' },
      { name: 'Vikram Sen', company: 'Shadowfax', phone: '+91 91234 56789' },
    ];
    // Pick partner based on order ID hash
    const index =
      Math.abs(orderId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) %
      deliveryPartners.length;
    const partner = deliveryPartners[index];

    setActiveCall({
      orderId,
      partnerName: `${partner.name} (${partner.company})`,
      phone: partner.phone,
    });
    setCallStatus('Ringing');
    setCallDuration(0);
    setSimulatedTranscription('Dialing delivery partner...');

    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const options = { mimeType: 'audio/webm' };

      let recorder;
      try {
        recorder = new MediaRecorder(stream, options);
      } catch (e) {
        // Fallback to default browser mimeType if webm is unsupported
        recorder = new MediaRecorder(stream);
      }

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || 'audio/webm',
        });

        // Stop all tracks in the stream to release the mic icon in the browser
        stream.getTracks().forEach((track) => track.stop());

        // Upload the audio blob
        uploadCallBlob(orderId, `${partner.name} (${partner.company})`, audioBlob);
      };

      recorder.start(250); // Slice audio in 250ms chunks

      // Connect call after 3 seconds ringing
      setTimeout(() => {
        setCallStatus('Connected');
        setSimulatedTranscription('Call Connected. Speak now...');
        startSimulatedTranscription();
      }, 3000);
    } catch (err) {
      console.error('Microphone access denied or error:', err);
      alert(
        'Microphone access is required to record the delivery partner call. Please grant permissions and try again.'
      );
      setActiveCall(null);
      setCallStatus('Disconnected');
    }
  };

  const startSimulatedTranscription = () => {
    const dialogs = [
      'Delivery Partner: Bhaiya, I have reached your society gate. Can you confirm your flat number?',
      'You: Yes, it is Flat 302, C-Wing, third floor.',
      'Delivery Partner: Ok, I will enter flat number in security gate register. Please keep OTP ready.',
      'You: Sure, let me open the door.',
      'Delivery Partner: Thank you bhaiya, coming up now.',
      'Call Completed',
    ];

    let step = 0;
    transcriptionTimerRef.current = setInterval(() => {
      if (step < dialogs.length) {
        setSimulatedTranscription(dialogs[step]);
        if (dialogs[step] === 'Call Completed') {
          endCall();
        }
        step++;
      } else {
        clearInterval(transcriptionTimerRef.current);
      }
    }, 5000);
  };

  const endCall = () => {
    if (callStatus === 'Connected' || callStatus === 'Ringing') {
      setCallStatus('Ended');
      setSimulatedTranscription('Call completed. Uploading recording...');

      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }

      if (transcriptionTimerRef.current) {
        clearInterval(transcriptionTimerRef.current);
      }

      // Close modal after 2 seconds
      setTimeout(() => {
        setActiveCall(null);
        setCallStatus('Disconnected');
      }, 2000);
    }
  };

  const uploadCallBlob = (orderId, partnerName, blob) => {
    const duration = callDuration || 5; // Fallback duration in seconds

    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64Audio = reader.result;

      fetch(`${API_BASE_URL}/api/calls/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId,
          deliveryPartnerName: partnerName,
          duration,
          audio: base64Audio,
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error('Upload failed');
          return res.json();
        })
        .then((newCallRecord) => {
          fetchCallHistory(); // Reload history
        })
        .catch((err) => {
          console.error('Error uploading call recording:', err);
        });
    };
  };

  const formatDuration = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 fade-in-section">
      {/* Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-slate-400 dark:text-slate-500 mb-8">
        <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 text-decoration-none">
          Home
        </Link>
        <i className="bi bi-chevron-right text-[9px]"></i>
        <span className="text-slate-800 dark:text-slate-350 font-bold">Customer Care</span>
      </nav>

      {/* Hero Section */}
      <section className="max-w-3xl mx-auto text-center mb-12">
        <span className="text-indigo-650 dark:text-indigo-400 text-xs font-extrabold uppercase tracking-wider mb-2 inline-block">
          Support Portal
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white mb-4">
          How Can We Help You?
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
          Welcome to the Vi Customer Care hub. Check delivery details, communicate with your courier, view call histories, or submit a support ticket.
        </p>
      </section>

      {/* Call Delivery Partner (Interactive Feature Panel) */}
      <section className="mb-16">
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-xl bg-white dark:bg-slate-900/20">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Orders List for Calling */}
            <div className="flex-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <i className="bi bi-telephone-outbound text-sm"></i>
                </div>
                <h3 className="font-extrabold text-slate-800 dark:text-white text-base mb-0">
                  Call Active Courier
                </h3>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs mb-6 leading-relaxed">
                Communicate directly with your delivery partner for any ongoing or past order. Calls are recorded and saved here for dispute resolution.
              </p>

              {!user ? (
                <div className="bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 text-center">
                  <i className="bi bi-shield-lock text-3xl text-slate-400 dark:text-slate-600 mb-2 block"></i>
                  <p className="text-slate-600 dark:text-slate-400 text-xs mb-4">
                    Please log in to contact delivery partners.
                  </p>
                  <Link
                    to="/login"
                    className="btn bg-indigo-650 hover:bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-xl text-xs text-decoration-none shadow-md"
                  >
                    Log In
                  </Link>
                </div>
              ) : loadingOrders ? (
                <div className="text-center py-6">
                  <div className="spinner-border spinner-border-sm text-indigo-600 dark:text-indigo-400" role="status"></div>
                  <span className="ms-2 text-slate-500 dark:text-slate-450 text-xs font-bold">Loading orders...</span>
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 text-center">
                  <i className="bi bi-box text-3xl text-slate-400 dark:text-slate-600 mb-2 block"></i>
                  <p className="text-slate-500 dark:text-slate-450 text-xs">
                    No orders found. Please place an order to contact couriers.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-4 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 dark:text-slate-250 text-xs">
                            {order.orderId}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider ${
                              order.status === 'Delivered'
                                ? 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400'
                                : order.status === 'Processing'
                                ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400'
                                : 'bg-yellow-50 dark:bg-yellow-950/20 text-yellow-755 dark:text-yellow-400'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-450 dark:text-slate-500 mb-0 mt-1 font-medium">
                          Placed: {order.date} • Total: ₹{order.total.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <button
                        onClick={() => startCall(order.orderId)}
                        disabled={callStatus !== 'Disconnected'}
                        className="btn bg-orange-600 hover:bg-orange-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-md shadow-orange-600/10"
                      >
                        <i className="bi bi-telephone-fill"></i> Call Partner
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Past Recordings list */}
            <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800/80 pt-6 lg:pt-0 lg:pl-8">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <i className="bi bi-music-note-list text-sm"></i>
                </div>
                <h3 className="font-extrabold text-slate-800 dark:text-white text-base mb-0">
                  Recording History
                </h3>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs mb-6 leading-relaxed">
                Your past recorded conversations. Click play to listen to details.
              </p>

              {!user ? (
                <div className="bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 text-center">
                  <p className="text-slate-500 dark:text-slate-450 text-xs font-medium mb-0">
                    Login to see call recordings.
                  </p>
                </div>
              ) : loadingCalls ? (
                <div className="text-center py-6">
                  <div className="spinner-border spinner-border-sm text-indigo-600 dark:text-indigo-400"></div>
                </div>
              ) : callHistory.length === 0 ? (
                <div className="bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 text-center">
                  <i className="bi bi-mic text-2xl text-slate-400 dark:text-slate-655 mb-2 block"></i>
                  <p className="text-slate-500 dark:text-slate-450 text-xs mb-0">No recorded calls yet.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {callHistory.map((call) => (
                    <div
                      key={call._id}
                      className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-extrabold text-slate-700 dark:text-slate-350 text-xs">
                          {call.orderId}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-550">
                          {new Date(call.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-550 dark:text-slate-450 mb-2 font-medium">
                        Courier:{' '}
                        <span className="font-bold text-slate-700 dark:text-slate-200">
                          {call.deliveryPartnerName}
                        </span>
                      </p>

                      <div className="flex items-center gap-2.5">
                        <audio
                          src={`${API_BASE_URL}${call.audioUrl}`}
                          controls
                          className="w-full h-8 rounded-lg filter dark:invert dark:hue-rotate-180"
                        />
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold whitespace-nowrap">
                          {formatDuration(call.duration)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Support Grid (FAQs and Ticket Form) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FAQs list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <i className="bi bi-question-circle text-sm"></i>
            </div>
            <h3 className="font-extrabold text-slate-800 dark:text-white text-lg mb-0">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm">
              <h4 className="font-bold text-slate-805 dark:text-slate-200 text-sm mb-2">
                How can I track my delivery status?
              </h4>
              <p className="text-slate-550 dark:text-slate-400 text-xs leading-relaxed mb-0 font-medium">
                Go to the Orders tab, find your invoice details, and review the tracking steps. You can call the courier directly using the active call tool above.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm">
              <h4 className="font-bold text-slate-855 dark:text-slate-200 text-sm mb-2">
                What is your product return policy?
              </h4>
              <p className="text-slate-550 dark:text-slate-400 text-xs leading-relaxed mb-0 font-medium">
                We accept returns on all unopened mechanical keyboards, headphones, and smart components within 14 days of receipt. Contact support using the form to request return tags.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm">
              <h4 className="font-bold text-slate-855 dark:text-slate-200 text-sm mb-2">
                Are delivery partner calls secure?
              </h4>
              <p className="text-slate-550 dark:text-slate-400 text-xs leading-relaxed mb-0 font-medium">
                Yes! Every conversation between users and courier partners is securely recorded, saved, and made available for review inside user accounts and the admin hub.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Ticket form card */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <i className="bi bi-chat-left-text text-sm"></i>
            </div>
            <h3 className="font-extrabold text-slate-800 dark:text-white text-lg mb-0">
              Submit Support Ticket
            </h3>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-md bg-white dark:bg-slate-900/20">
            <form onSubmit={handleTicketSubmit}>
              <div className="mb-4">
                <label className="form-label text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Subject
                </label>
                <input
                  type="text"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Missing switch puller tool"
                  required
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="mb-5">
                <label className="form-label text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Message Details
                </label>
                <textarea
                  rows={4}
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Provide details about your query..."
                  required
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={ticketSubmitted}
                className="w-full btn bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 cursor-pointer"
              >
                {ticketSubmitted ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* calling voice simulator modal */}
      {activeCall && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800/80 w-full max-w-sm rounded-[32px] p-8 text-center text-white relative shadow-2xl overflow-hidden">
            {/* Background glows */}
            <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-indigo-500/20 blur-[60px] pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-pink-500/10 blur-[60px] pointer-events-none"></div>

            <div className="relative z-10">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3.5 py-1 rounded-full border border-indigo-500/20 mb-6 inline-block">
                Secure Delivery Call
              </span>

              {/* Courier Avatar pulsing */}
              <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-indigo-500/25 animate-ping"></div>
                <div className="absolute -inset-2.5 rounded-full border border-purple-500/10 animate-[pulse_2s_infinite]"></div>
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg text-4xl text-white font-black">
                  {activeCall.partnerName[0]}
                </div>
              </div>

              {/* Call Details */}
              <h3 className="font-extrabold text-lg tracking-wide mb-1 text-slate-100">
                {activeCall.partnerName}
              </h3>
              <p className="text-xs text-slate-400 mb-1.5">{activeCall.phone}</p>
              <p className="text-[10px] text-indigo-400 font-bold mb-6">
                Order ID: <span className="font-extrabold">{activeCall.orderId}</span>
              </p>

              {/* Animated Waveform */}
              <div className="h-12 flex items-center justify-center gap-1.5 mb-6">
                {callStatus === 'Ringing' ? (
                  <span className="text-xs text-slate-400 font-bold tracking-wide animate-pulse">
                    Ringing...
                  </span>
                ) : callStatus === 'Connected' ? (
                  <div className="flex items-end justify-center gap-1 h-8">
                    {[6, 10, 8, 4, 9, 12, 7, 10, 5, 8, 11, 4, 7, 9].map((height, i) => (
                      <div
                        key={i}
                        className="w-1 rounded-full wave-bar animate-[pulse_1s_infinite]"
                        style={{
                          height: `${height * 2.2}px`,
                          animationDelay: `${i * 80}ms`,
                        }}
                      ></div>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 font-bold tracking-wide">{callStatus}</span>
                )}
              </div>

              {/* Timer */}
              <div className="text-3xl font-black font-mono text-slate-105 mb-8">
                {formatDuration(callDuration)}
              </div>

              {/* transcription logs */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 min-h-[64px] mb-8 flex items-center justify-center transition-colors">
                <p className="text-[11px] text-slate-400 leading-normal m-0 italic font-medium">
                  {simulatedTranscription}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-6">
                {/* Mute Button */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  disabled={callStatus !== 'Connected'}
                  className={`w-12 h-12 rounded-full border flex items-center justify-center cursor-pointer transition-all ${
                    isMuted
                      ? 'bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30'
                      : 'bg-slate-800 border-slate-700 text-slate-350 hover:bg-slate-700'
                  }`}
                >
                  <i className={`bi ${isMuted ? 'bi-mic-mute-fill' : 'bi-mic-fill'} text-lg`}></i>
                </button>

                {/* Hang up Button */}
                <button
                  onClick={endCall}
                  className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center cursor-pointer transition-all shadow-lg shadow-rose-600/35 hover:-translate-y-0.5"
                >
                  <i className="bi bi-telephone-x-fill text-2xl"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerCare;
