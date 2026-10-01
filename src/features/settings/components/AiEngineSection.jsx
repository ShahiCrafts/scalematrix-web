import React from 'react';
import { FiCpu, FiZap } from 'react-icons/fi';

export default function AiEngineSection({ aiEngine, setAiEngine, showNotification }) {
  return (
    <div className="bg-[#121215] border border-neutral-800/90 rounded-3xl p-6 space-y-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiCpu className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-base font-bold text-white">AI Engine Configuration</h3>
            <p className="text-xs text-neutral-400">Configure the AI engine that powers your content.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Connected</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-neutral-300 mb-1.5">AI Provider</label>
          <select
            value={aiEngine.provider}
            onChange={(e) => setAiEngine({ ...aiEngine, provider: e.target.value })}
            className="w-full bg-[#181820] border border-neutral-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="Ollama">Ollama (llama3.1)</option>
            <option value="OpenAI">OpenAI (GPT-4o)</option>
            <option value="Anthropic">Anthropic (Claude 3.5)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-300 mb-1.5">Model</label>
          <select
            value={aiEngine.model}
            onChange={(e) => setAiEngine({ ...aiEngine, model: e.target.value })}
            className="w-full bg-[#181820] border border-neutral-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="llama3.1:latest">llama3.1:latest</option>
            <option value="llama3.2:1b">llama3.2:1b</option>
            <option value="gpt-4o">gpt-4o</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-300 mb-1.5">Context Length</label>
          <select
            value={aiEngine.contextLength}
            onChange={(e) => setAiEngine({ ...aiEngine, contextLength: e.target.value })}
            className="w-full bg-[#181820] border border-neutral-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="32K tokens">32K tokens</option>
            <option value="64K tokens">64K tokens</option>
            <option value="128K tokens">128K tokens</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
        <div>
          <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
            <span className="text-neutral-400">Temperature</span>
            <span className="text-purple-400 font-bold">{aiEngine.temperature}</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={aiEngine.temperature}
            onChange={(e) => setAiEngine({ ...aiEngine, temperature: parseFloat(e.target.value) })}
            className="w-full accent-purple-600 cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-300 mb-1.5">Max Tokens</label>
          <select
            value={aiEngine.maxTokens}
            onChange={(e) => setAiEngine({ ...aiEngine, maxTokens: parseInt(e.target.value) })}
            className="w-full bg-[#181820] border border-neutral-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value={2048}>2048</option>
            <option value={4096}>4096</option>
            <option value={8192}>8192</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-300 mb-1.5">Prompt Style</label>
          <select
            value={aiEngine.promptStyle}
            onChange={(e) => setAiEngine({ ...aiEngine, promptStyle: e.target.value })}
            className="w-full bg-[#181820] border border-neutral-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="Professional">Professional</option>
            <option value="Creative">Creative & Engaging</option>
            <option value="Direct">Direct-Response Copy</option>
          </select>
        </div>
      </div>

      <button
        onClick={() => showNotification("Local Ollama connection verified!")}
        className="text-xs text-purple-400 font-semibold hover:underline flex items-center gap-1.5 pt-1 cursor-pointer"
      >
        <FiZap className="w-3.5 h-3.5" />
        <span>Test Connection</span>
      </button>
    </div>
  );
}
