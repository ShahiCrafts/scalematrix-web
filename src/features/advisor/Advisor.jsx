import React, { useState, useEffect, useRef } from 'react';
import {
  FiCpu,
  FiSend,
  FiLoader,
  FiAlertCircle,
  FiMessageSquare,
  FiChevronRight,
  FiZap,
  FiPlusCircle,
  FiEye,
  FiHeart,
  FiMessageCircle,
  FiExternalLink,
  FiCheckCircle,
  FiRefreshCw,
  FiSquare,
} from 'react-icons/fi';
import { apiCall } from '../../shared/utils/api';

const PROMPT_SUGGESTIONS = [
  "Add an event to my Google Calendar for team sync tomorrow at 10 AM",
  "Write a viral Instagram reel about sustainable fashion trends",
  "Create a LinkedIn post on scaling a startup from 0 to 1000 users",
  "Draft a Twitter thread on AI tools that replaced my entire workflow",
  "Write a hook for a short-form video about morning productivity habits",
  "Search my connected tools for recent Notion documents",
  "Draft a behind-the-scenes story on how we built our remote team",
  "Create a reel script comparing our product to the competition",
];

const FEATURE_CARDS = [
  {
    id: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    badge: "Analytics",
    title: "Run Analytics. Increase Engagement",
    description: "Understand and double down on high-performing content.",
    buttonLabel: "Analyze Post",
    buttonView: "analytics",
    stats: { reach: "24.5k", likes: "1.2k", comments: "143" },
  },
  {
    id: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
    badge: "AI Models",
    title: "Switch between models.",
    description:
      "Experiment with different AI models to generate content variants.",
    buttonLabel: "Try Models",
    buttonView: "studio",
    stats: { reach: "82.1k", likes: "4.8k", comments: "392" },
  },
];

function ReasoningToggle({ reasoning }) {
  const [isOpen, setIsOpen] = useState(false);
  if (!reasoning) return null;

  return (
    <div className="mb-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 text-xs font-medium text-neutral-300 hover:text-white transition-all cursor-pointer shadow-sm"
      >
        <FiChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
        <span>View reasoning</span>
      </button>

      {isOpen && (
        <div className="mt-2 p-3.5 bg-[#101014] rounded-xl border border-neutral-800/80 text-xs text-neutral-300 font-mono leading-relaxed whitespace-pre-wrap">
          {reasoning}
        </div>
      )}
    </div>
  );
}

const TOOLKIT_ICON_MAP = {
  gmail: 'https://cdn.svgporn.com/logos/gmail.svg',
  googlecalendar: 'https://cdn.svgporn.com/logos/google-calendar.svg',
  calendar: 'https://cdn.svgporn.com/logos/google-calendar.svg',
  googlemeet: 'https://cdn.svgporn.com/logos/google-meet.svg',
  meet: 'https://cdn.svgporn.com/logos/google-meet.svg',
  linkedin: 'https://cdn.svgporn.com/logos/linkedin-icon.svg',
  instagram: 'https://cdn.svgporn.com/logos/instagram-icon.svg',
  facebook: 'https://cdn.svgporn.com/logos/facebook.svg',
  slack: 'https://cdn.svgporn.com/logos/slack-icon.svg',
  notion: 'https://cdn.svgporn.com/logos/notion-icon.svg',
  googlesheets: 'https://cdn.svgporn.com/logos/google-sheets.svg',
  sheets: 'https://cdn.svgporn.com/logos/google-sheets.svg',
  discord: 'https://cdn.svgporn.com/logos/discord-icon.svg',
  trello: 'https://cdn.svgporn.com/logos/trello.svg',
};

function ToolkitIcon({ toolkit }) {
  const tk = (toolkit || '').toLowerCase();
  
  let iconUrl = null;
  if (tk.includes('calendar') || tk.includes('event') || tk.includes('quickadd') || tk.includes('schedule')) {
    iconUrl = TOOLKIT_ICON_MAP.googlecalendar;
  } else if (tk.includes('gmail') || tk.includes('email') || tk.includes('mail')) {
    iconUrl = TOOLKIT_ICON_MAP.gmail;
  } else if (tk.includes('notion') || tk.includes('page')) {
    iconUrl = TOOLKIT_ICON_MAP.notion;
  } else if (tk.includes('sheet') || tk.includes('spreadsheet')) {
    iconUrl = TOOLKIT_ICON_MAP.googlesheets;
  } else if (tk.includes('meet') || tk.includes('conference')) {
    iconUrl = TOOLKIT_ICON_MAP.googlemeet;
  } else if (tk.includes('linkedin')) {
    iconUrl = TOOLKIT_ICON_MAP.linkedin;
  } else if (tk.includes('instagram')) {
    iconUrl = TOOLKIT_ICON_MAP.instagram;
  } else if (tk.includes('facebook')) {
    iconUrl = TOOLKIT_ICON_MAP.facebook;
  } else {
    const matchedKey = Object.keys(TOOLKIT_ICON_MAP).find((k) => tk.includes(k));
    if (matchedKey) iconUrl = TOOLKIT_ICON_MAP[matchedKey];
  }

  if (iconUrl) {
    return (
      <div className="w-4 h-4 flex items-center justify-center rounded bg-white p-0.5 shadow-sm overflow-hidden flex-shrink-0">
        <img src={iconUrl} alt={toolkit} className="w-full h-full object-contain" />
      </div>
    );
  }

  return (
    <div className="w-4 h-4 rounded bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
      {toolkit ? toolkit.slice(0, 2).toUpperCase() : <FiZap className="w-3 h-3 text-purple-400" />}
    </div>
  );
}

function formatPillLabel(toolName, res) {
  const rawActionKey = (res.actionKey || '').toLowerCase();
  const toolkit = (res.toolkit || '').toLowerCase();

  let appName = 'App';
  if (toolkit.includes('calendar')) appName = 'Google Calendar';
  else if (toolkit.includes('gmail') || toolkit.includes('mail')) appName = 'Gmail';
  else if (toolkit.includes('notion')) appName = 'Notion';
  else if (toolkit.includes('linkedin')) appName = 'LinkedIn';
  else if (toolkit.includes('instagram')) appName = 'Instagram';
  else if (toolkit.includes('facebook')) appName = 'Facebook';
  else if (toolkit.includes('sheets')) appName = 'Google Sheets';
  else if (toolkit.includes('meet')) appName = 'Google Meet';
  else if (res.toolkit) appName = res.toolkit.charAt(0).toUpperCase() + res.toolkit.slice(1);

  if (toolName === 'COMPOSIO_SEARCH_TOOLS') {
    return `Found ${appName} tools`;
  }

  if (toolName === 'COMPOSIO_MANAGE_CONNECTIONS') {
    const act = res.status === 'already_connected' ? 'List' : res.status === 'disconnected' ? 'Disconnect' : 'ADD';
    return `Checked connections for ${appName}, ${act}`;
  }

  if (rawActionKey.includes('create_event') || rawActionKey.includes('createevent') || rawActionKey.includes('addevent')) {
    return `Checked connections for Google Calendar, ADD`;
  }
  if (rawActionKey.includes('find_event') || rawActionKey.includes('events_list') || rawActionKey.includes('search')) {
    return `Checked connections for ${appName}, List`;
  }
  if (rawActionKey.includes('send_email') || rawActionKey.includes('sendemail')) {
    return `Checked connections for Gmail, ADD`;
  }

  return `Checked connections for ${appName}, List`;
}

function ToolCallBadges({ toolResults, onResume, pendingPrompt }) {
  if (!toolResults || toolResults.length === 0) return null;

  return (
    <div className="my-2 space-y-2">
      {toolResults.map((tr, idx) => {
        const toolName = tr.toolName || 'Tool';
        const results = tr.result?.results || [];

        if (results.length === 0) {
          return (
            <div key={idx} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141A2E] border border-blue-500/30 text-blue-300 text-xs font-medium shadow-sm my-0.5">
              <FiZap className="w-3.5 h-3.5 text-blue-400" />
              <span>Checked connections for App, List</span>
            </div>
          );
        }

        return results.map((res, resIdx) => {
          const toolkit = res.toolkit || 'Tool';
          const capitalizedTk = toolkit.charAt(0).toUpperCase() + toolkit.slice(1);
          const pillLabel = formatPillLabel(toolName, res);

          return (
            <div key={`${idx}_${resIdx}`} className="flex flex-col gap-1.5 my-1">
              <div className="relative group inline-block max-w-max">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181D2E] border border-blue-500/30 text-blue-300 text-xs font-medium shadow-sm cursor-pointer hover:bg-[#1C233B] transition-colors">
                  <ToolkitIcon toolkit={toolkit} />
                  <span>{pillLabel}</span>
                </div>

                {/* Hover Popover Box matching screenshot reference */}
                <div className="absolute left-0 bottom-full mb-2 z-40 hidden group-hover:block w-72 p-3.5 bg-[#E2E2E6] text-neutral-900 rounded-2xl shadow-2xl border border-neutral-300 text-xs leading-snug space-y-1 animate-fadeIn pointer-events-none">
                  <div className="font-bold text-neutral-900 text-xs pb-1 border-b border-neutral-300">{pillLabel}</div>
                  <div className="text-[11px] text-neutral-800"><strong className="text-neutral-950">App:</strong> {capitalizedTk}, ADD</div>
                  <div className="text-[11px] text-neutral-800"><strong className="text-neutral-950">Toolkit:</strong> {capitalizedTk}, ADD</div>
                  <div className="text-[11px] text-neutral-700 pt-0.5"><strong className="text-neutral-950">Details:</strong> {res.message || 'Connection status checked. Share any connectLink with the user if a toolkit needs connection.'}</div>
                </div>
              </div>

              {res.redirectUrl && (
                <div className="mt-1 p-3.5 rounded-2xl bg-[#121216] border border-neutral-800 space-y-2.5 max-w-md">
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    To continue, please authorize your <strong className="text-white">{capitalizedTk}</strong> account:
                  </p>
                  <div className="flex items-center gap-2">
                    <a
                      href={res.redirectUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl transition-all shadow-md"
                    >
                      <span>Connect {capitalizedTk}</span>
                      <FiExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => onResume(pendingPrompt || 'I have connected my account')}
                      className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      I've Connected
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        });
      })}
    </div>
  );
}

function PromptBox({ onSendMessage, onStopGeneration, isSending, compact = false }) {
  const [prompt, setPrompt] = useState("");
  const [idx, setIdx] = useState(0);

  const shuffle = () => {
    const next = (idx + 1) % PROMPT_SUGGESTIONS.length;
    setIdx(next);
    setPrompt(PROMPT_SUGGESTIONS[next]);
  };

  const handleGenerate = () => {
    if (!prompt.trim() || isSending) return;
    onSendMessage(prompt.trim());
    setPrompt("");
  };

  return (
    <div
      className={`w-full max-w-3xl rounded-2xl p-3.5 flex flex-col gap-2.5 transition-all ${
        compact ? 'shadow-2xl' : ''
      }`}
      style={{
        background: "rgba(18, 18, 22, 0.95)",
        border: "1px solid rgba(255,255,255,0.12)",
        backdropFilter: "blur(16px)",
      }}
    >
      {/* Input row */}
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
        disabled={isSending}
        placeholder="Ask anything you can possibly think of (e.g. Add event to Google Calendar)..."
        className="w-full bg-transparent text-[14px] text-white placeholder-neutral-500 focus:outline-none leading-relaxed disabled:opacity-50 px-1"
      />

      {/* Actions row */}
      <div className="flex items-center justify-between pt-1">
        {/* Left: Upload */}
        <label
          title="Upload media"
          className="w-7 h-7 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer flex-shrink-0"
        >
          <input type="file" accept="image/*,video/*" className="hidden" />
          <FiPlusCircle className="w-3.5 h-3.5" />
        </label>

        {/* Right: Shuffle + Generate / Stop */}
        <div className="flex items-center gap-2">
          {/* Shuffle / autoprompt */}
          <button
            type="button"
            onClick={shuffle}
            disabled={isSending}
            title="Suggest a prompt"
            className="w-7 h-7 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white transition-colors disabled:opacity-40"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="16 3 21 3 21 8" />
              <line x1="4" y1="20" x2="21" y2="3" />
              <polyline points="21 16 21 21 16 21" />
              <line x1="15" y1="15" x2="21" y2="21" />
            </svg>
          </button>

          {/* Send / Stop Button */}
          {isSending ? (
            <button
              type="button"
              onClick={onStopGeneration}
              title="Stop generating response"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-red-600 hover:bg-red-500 transition-all cursor-pointer shadow-md"
            >
              <FiSquare className="w-3.5 h-3.5 fill-current" />
              <span>Stop</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!prompt.trim()}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              style={{
                background: prompt.trim()
                  ? "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)"
                  : "rgba(124,58,237,0.4)",
              }}
            >
              <FiZap className="w-3.5 h-3.5" />
              <span>Generate</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Advisor({ settings, metrics, setActiveView, setTopicForScript }) {
  const [messages, setMessages] = useState([]);
  const [threadId, setThreadId] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [pendingConnection, setPendingConnection] = useState(null); // { toolkit, originalPrompt }
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  const hasUserChatted = messages.some(m => m.sender === 'user');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  // Polling for pending connection completion
  useEffect(() => {
    if (!pendingConnection?.toolkit) return;

    const targetToolkit = pendingConnection.toolkit.toLowerCase();
    let isSubscribed = true;
    let pollAttempt = 0;
    let interval = null;
    const MAX_POLL_ATTEMPTS = 60;

    const poll = async () => {
      pollAttempt += 1;
      try {
        const res = await apiCall('/integrations/connections');
        const connections = res.data || [];

        const isNowConnected = connections.some(
          (c) => (c.appProviderKey || '').toLowerCase() === targetToolkit && c.status === 'ACTIVE'
        );

        if (isNowConnected && isSubscribed) {
          const toolkitName = pendingConnection.toolkit;
          const promptToResume = pendingConnection.originalPrompt;

          setPendingConnection(null);
          if (interval) clearInterval(interval);

          const sysMsg = {
            id: `sys_${Date.now()}`,
            sender: 'system',
            message: `${toolkitName.charAt(0).toUpperCase() + toolkitName.slice(1)} connected — continuing with your request...`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, sysMsg]);

          if (promptToResume) {
            setTimeout(() => {
              handleSendMessage(promptToResume);
            }, 600);
          }
          return;
        }

        if (pollAttempt >= MAX_POLL_ATTEMPTS && isSubscribed) {
          if (interval) clearInterval(interval);
        }
      } catch (err) {
        console.warn(`[CONNECTION_POLL] error on attempt=${pollAttempt}:`, err.message);
      }
    };

    poll();
    interval = setInterval(poll, 3500);

    return () => {
      isSubscribed = false;
      if (interval) clearInterval(interval);
    };
  }, [pendingConnection]);

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsSending(false);
    setMessages(prev => prev.map(m => m.isStreaming ? { ...m, isStreaming: false } : m));
  };

  const handleSendMessage = async (textToSend) => {
    if (!textToSend || !textToSend.trim() || isSending) return;

    setErrorMsg('');
    const userMsgId = `msg_${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: 'user',
      message: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const aiMsgId = `msg_ai_${Date.now()}`;
    const aiPlaceholder = {
      id: aiMsgId,
      sender: 'ai',
      message: '',
      reasoning: '',
      toolCalls: [],
      toolResults: [],
      isStreaming: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg, aiPlaceholder]);
    setIsSending(true);

    const token = localStorage.getItem('scalematrix_access_token');
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(`${apiBaseUrl}/chat`, {
        signal: abortControllerRef.current.signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          modelId: 'qwen2.5:7b',
          threadId: threadId,
          trigger: 'submit-message',
          messages: [
            ...messages.map(m => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.message,
            })),
            { role: 'user', content: textToSend }
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop();

        for (const eventBlock of events) {
          if (!eventBlock.trim()) continue;

          let eventType = '';
          let dataStr = '';

          const lines = eventBlock.split('\n');
          for (const line of lines) {
            if (line.startsWith('event: ')) {
              eventType = line.slice(7).trim();
            } else if (line.startsWith('data: ')) {
              dataStr = line.slice(6).trim();
            }
          }

          if (!eventType || !dataStr) continue;

          let parsedData = {};
          try {
            parsedData = JSON.parse(dataStr);
          } catch (e) {
            continue;
          }

          if (eventType === 'start') {
            if (parsedData.threadId) {
              setThreadId(parsedData.threadId);
            }
          } else if (eventType === 'reasoning-delta') {
            setMessages(prev => prev.map(m => {
              if (m.id === aiMsgId) {
                return { ...m, reasoning: (m.reasoning || '') + parsedData.delta };
              }
              return m;
            }));
          } else if (eventType === 'text-delta') {
            setMessages(prev => prev.map(m => {
              if (m.id === aiMsgId) {
                return { ...m, message: (m.message || '') + parsedData.delta };
              }
              return m;
            }));
          } else if (eventType === 'tool-output-available') {
            if (parsedData.result?.results) {
              for (const r of parsedData.result.results) {
                if (r.status === 'connection_initiated' || r.redirectUrl) {
                  setPendingConnection({
                    toolkit: r.toolkit,
                    originalPrompt: textToSend,
                  });
                }
              }
            }

            setMessages(prev => prev.map(m => {
              if (m.id === aiMsgId) {
                const existing = m.toolResults || [];
                return {
                  ...m,
                  toolResults: [...existing, parsedData],
                };
              }
              return m;
            }));
          } else if (eventType === 'finish' || eventType === 'finish-step') {
            setMessages(prev => prev.map(m => {
              if (m.id === aiMsgId) {
                return { ...m, isStreaming: false };
              }
              return m;
            }));
          }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('[CHAT] Request aborted by user.');
      } else {
        console.error('Chat stream error:', err);
        setErrorMsg(err.message || 'Failed to stream response');
      }
      setMessages(prev => prev.map(m => {
        if (m.id === aiMsgId) {
          return {
            ...m,
            isStreaming: false,
            message: m.message || (err.name === 'AbortError' ? 'Generation stopped.' : 'An error occurred while streaming response.'),
          };
        }
        return m;
      }));
    } finally {
      setIsSending(false);
      abortControllerRef.current = null;
    }
  };

  const handleNewChat = () => {
    if (isSending) handleStopGeneration();
    setMessages([]);
    setThreadId(null);
    setErrorMsg('');
    setPendingConnection(null);
  };

  return (
    <div className="flex-1 bg-neutral-950 text-neutral-200 overflow-hidden font-sans relative flex flex-col h-full">
      {/* Ambient glow in background */}
      <div
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 28%, rgba(124,58,237,0.18) 0%, rgba(10,10,10,0.02) 60%, transparent 100%)",
        }}
        className="absolute inset-0 pointer-events-none z-0"
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-2 px-8 pt-6 pb-4 border-b border-neutral-900/80 flex-shrink-0 z-10 relative bg-neutral-950/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-neutral-500">
            GrowthOS AI
          </span>
          <FiChevronRight className="w-3.5 h-3.5 text-neutral-700" />
          <span className="text-sm font-semibold text-white">
            AI Strategy Advisor
          </span>
        </div>

        <div className="flex items-center gap-3">
          {hasUserChatted && (
            <button
              onClick={handleNewChat}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white transition-all cursor-pointer"
            >
              <FiRefreshCw className="w-3 h-3" />
              New Chat
            </button>
          )}
          <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-semibold bg-neutral-900 px-3 py-1.5 rounded-full border border-neutral-850/60">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            Ollama Local / Composio Authorized
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {!hasUserChatted ? (
        /* LANDING VIEW */
        <main className="px-12 py-6 lg:px-20 relative z-10 flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Hero Prompt Section */}
            <div className="relative px-8 pt-4 pb-6 flex flex-col items-center gap-6">
              <h1 className="text-3xl font-semibold text-white text-center tracking-tight leading-tight max-w-lg">
                Grow your brand like{" "}
                <span className="bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
                  never before
                </span>
              </h1>

              <PromptBox
                onSendMessage={handleSendMessage}
                onStopGeneration={handleStopGeneration}
                isSending={isSending}
              />
            </div>

            {/* Feature Showcase */}
            <div className="space-y-8 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">
                    What GrowthOS can do
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Powerful tools to create, analyze, and optimize your social media presence.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {FEATURE_CARDS.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => setActiveView(card.buttonView)}
                    className="relative h-56 rounded-3xl overflow-hidden group cursor-pointer border border-neutral-900 bg-neutral-950"
                  >
                    <img
                      src={card.imageUrl}
                      alt={card.badge}
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-102 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div
                      className="absolute inset-0 z-10"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.65) 40%, rgba(0,0,0,0.25) 75%, rgba(0,0,0,0.10) 100%)",
                      }}
                    />
                    <div className="absolute top-4 left-4 bg-purple-500 text-white text-[9px] font-medium tracking-wider uppercase px-2.5 py-1 rounded-full z-20">
                      {card.badge}
                    </div>
                    <div className="absolute inset-0 flex flex-col justify-between p-4 z-20">
                      <div className="h-20" />
                      <div className="space-y-1 max-w-md">
                        <h4 className="text-[15px] font-medium text-white leading-tight">
                          {card.title}
                        </h4>
                        <p className="text-[13px] text-neutral-400 leading-relaxed line-clamp-2">
                          {card.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveView(card.buttonView);
                          }}
                          className="px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-neutral-950 text-[12px] font-medium transition-all"
                        >
                          {card.buttonLabel}
                        </button>
                        <div className="flex items-center gap-3.5 text-neutral-400 text-[10px] font-bold">
                          <span className="flex items-center gap-1 hover:text-purple-400 transition-colors">
                            <FiEye className="w-3.5 h-3.5" />
                            {card.stats.reach}
                          </span>
                          <span className="flex items-center gap-1 hover:text-red-400 transition-colors">
                            <FiHeart className="w-3.5 h-3.5" />
                            {card.stats.likes}
                          </span>
                          <span className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                            <FiMessageCircle className="w-3.5 h-3.5" />
                            {card.stats.comments}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      ) : (
        /* ACTIVE CHAT WORKSPACE VIEW */
        <div className="flex-1 flex flex-col overflow-hidden relative z-10">
          {/* Scrollable Message Feed */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 max-w-4xl w-full mx-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : msg.sender === 'system' ? 'items-center' : 'items-start'
                }`}
              >
                {msg.sender === 'system' ? (
                  <div className="my-2 px-4 py-2 rounded-full bg-purple-950/80 border border-purple-800/80 text-purple-300 text-xs font-medium animate-pulse flex items-center gap-2">
                    <FiCheckCircle className="w-3.5 h-3.5" />
                    {msg.message}
                  </div>
                ) : (
                  <div
                    className={`max-w-2xl text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#1E1E24] text-white rounded-2xl rounded-tr-sm px-5 py-3.5 border border-neutral-800/60 shadow-md'
                        : 'text-neutral-200 w-full'
                    }`}
                  >
                    {/* Collapsible Reasoning Block */}
                    {msg.sender === 'ai' && <ReasoningToggle reasoning={msg.reasoning} />}

                    {/* Tool Calling Badges / Pills */}
                    {msg.sender === 'ai' && (
                      <ToolCallBadges
                        toolResults={msg.toolResults}
                        onResume={handleSendMessage}
                        pendingPrompt={pendingConnection?.originalPrompt}
                      />
                    )}

                    {/* Main text content */}
                    {msg.sender === 'ai' ? (
                      <AdvisorMarkdownViewer content={msg.message} />
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.message}</p>
                    )}

                    {/* Streaming Indicator */}
                    {msg.isStreaming && !msg.message && (
                      <div className="flex items-center gap-2 text-neutral-400 text-xs py-2">
                        <FiLoader className="w-3.5 h-3.5 animate-spin text-purple-400" />
                        AI Agent is reasoning and executing tools...
                      </div>
                    )}
                  </div>
                )}
                <span className="text-[10px] text-neutral-500 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="max-w-2xl mx-auto p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-300 flex items-center gap-2 mb-2">
              <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
              {errorMsg}
            </div>
          )}

          {/* Anchored Bottom Prompt Bar */}
          <div className="p-4 border-t border-neutral-900/80 bg-neutral-950/90 backdrop-blur-md flex justify-center">
            <PromptBox
              onSendMessage={handleSendMessage}
              onStopGeneration={handleStopGeneration}
              isSending={isSending}
              compact={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function AdvisorMarkdownViewer({ content }) {
  if (!content) return null;

  // Clean out any raw JSON code blocks or internal schema payloads
  let cleaned = content.replace(/```json[\s\S]*?```/gi, '');
  cleaned = cleaned.replace(/```[\s\S]*?```/gi, (match) => {
    if (match.includes('{') && match.includes(':')) return '';
    return match;
  });
  cleaned = cleaned.replace(/\{\s*"[a-zA-Z0-9_]+":[\s\S]*?\}/g, '');

  const lines = cleaned.split('\n');
  const rendered = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    if (trimmed.startsWith('### ')) {
      rendered.push(
        <h6 key={idx} className="text-sm font-bold text-white mt-4 mb-1.5">
          {trimmed.slice(4)}
        </h6>
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const parsed = trimmed.slice(2)
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>');
      rendered.push(
        <li key={idx} className="list-disc ml-4 mb-1 text-xs text-neutral-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: parsed }} />
      );
    } else {
      const parsed = trimmed
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>');
      rendered.push(
        <p key={idx} className="mb-2 text-xs text-neutral-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: parsed }} />
      );
    }
  });

  return <div className="space-y-1">{rendered}</div>;
}
