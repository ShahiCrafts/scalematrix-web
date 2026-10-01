import React, { useState } from "react";
import {
  FiBriefcase,
  FiUsers,
  FiArrowRight,
  FiLoader,
  FiCheckCircle,
  FiMail,
  FiPlus,
  FiTrash2,
  FiCompass,
  FiLayers
} from "react-icons/fi";
import { apiCall } from "../../shared/utils/api";
import { Toast } from "../../shared/components";

const TEAM_SIZES = ["Just me", "2-10", "11-50", "51-200", "200+"];

const INDUSTRIES = [
  "Marketing & Growth",
  "SaaS & Tech Startup",
  "E-Commerce & Retail",
  "Content Creator & Media",
  "Agency & Services",
  "Finance & Business",
  "Other"
];

const REFERRAL_SOURCES = [
  "Search Engine (Google)",
  "Social Media (LinkedIn / X / Instagram)",
  "Colleague or Friend",
  "Podcast or Tech Blog",
  "Event or Conference",
  "Other"
];

export default function WorkspaceOnboarding({ user, onComplete }) {
  const [step, setStep] = useState("create"); // create -> invites
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  // Creation Form States
  const [workspaceName, setWorkspaceName] = useState(
    user?.fullName ? `${user.fullName}'s Workspace` : ""
  );
  const [teamSize, setTeamSize] = useState("Just me");
  const [industry, setIndustry] = useState("");
  const [referralSource, setReferralSource] = useState("");

  // Created workspace reference
  const [createdWorkspace, setCreatedWorkspace] = useState(null);

  // Invites State
  const [invites, setInvites] = useState([
    { email: "", role: "member" }
  ]);

  // Handle Required Workspace Creation & Trial Activation
  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    if (!workspaceName.trim()) {
      setError("Please enter a workspace or organization name.");
      return;
    }
    if (!teamSize) {
      setError("Please select your team size.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const teamSizeVal = teamSize === "Just me" ? "1" : teamSize;
      const res = await apiCall("/onboarding/setup", {
        method: "POST",
        body: JSON.stringify({
          name: workspaceName.trim(),
          teamSize: teamSizeVal,
          industry,
          referralSource,
        }),
      });

      const ws = res.data?.workspace;
      setCreatedWorkspace(ws);
      setStep("invites");
    } catch (err) {
      setError(err.message || "Failed to create workspace. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Invite Form Submission
  const handleSendInvites = async (e) => {
    if (e) e.preventDefault();
    const validInvites = invites.filter((i) => i.email && i.email.includes("@"));

    if (validInvites.length > 0 && createdWorkspace) {
      setLoading(true);
      try {
        await apiCall("/onboarding/invites", {
          method: "POST",
          body: JSON.stringify({
            workspaceId: createdWorkspace._id || createdWorkspace.id,
            invites: validInvites,
          }),
        });
      } catch (err) {
        console.warn("Error sending onboarding invites:", err.message);
      } finally {
        setLoading(false);
      }
    }

    if (onComplete) onComplete(createdWorkspace);
  };

  const addInviteRow = () => {
    if (invites.length < 5) {
      setInvites([...invites, { email: "", role: "member" }]);
    }
  };

  const removeInviteRow = (index) => {
    setInvites(invites.filter((_, i) => i !== index));
  };

  const updateInviteField = (index, field, value) => {
    const updated = [...invites];
    updated[index][field] = value;
    setInvites(updated);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#09090b] text-white flex items-center justify-center p-4 sm:p-6 font-sans overflow-y-auto select-none">
      <Toast message={toastMsg} type="success" onClose={() => setToastMsg("")} />

      <div className="w-full max-w-xl bg-[#121215] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden my-auto">
        {/* Top Branding Header */}
        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 via-fuchsia-600 to-indigo-600 flex items-center justify-center text-white font-extrabold shadow-lg shadow-purple-600/30">
              S
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">ScaleMatrix</h1>
              <p className="text-xs text-neutral-400">Enterprise Automation Platform</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[11px] font-semibold">
            Workspace Setup
          </span>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* ── STEP 1: Required Workspace Creation Form ── */}
        {step === "create" && (
          <form onSubmit={handleCreateWorkspace} className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">Create your Workspace</h2>
              <p className="text-xs text-neutral-400">
                Configure your workspace details to activate your <strong>14-Day Free Pro Trial</strong>.
              </p>
            </div>

            <div className="space-y-4">
              {/* Required Field 1: Workspace Name */}
              <div>
                <label className="block text-xs font-bold text-neutral-200 mb-1.5 flex items-center gap-1.5">
                  <FiBriefcase className="w-3.5 h-3.5 text-purple-400" />
                  <span>Workspace / Organization Name</span>
                  <span className="text-purple-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="e.g. Acme Inc, ScaleMatrix AI"
                  className="w-full bg-[#181820] border border-neutral-800 rounded-xl py-3 px-4 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>

              {/* Required Field 2: Team Size Picker */}
              <div>
                <label className="block text-xs font-bold text-neutral-200 mb-1.5 flex items-center gap-1.5">
                  <FiUsers className="w-3.5 h-3.5 text-purple-400" />
                  <span>Team Size</span>
                  <span className="text-purple-400">*</span>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {TEAM_SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setTeamSize(size)}
                      className={`py-2.5 px-2 rounded-xl border text-[11px] font-bold transition-all cursor-pointer text-center ${
                        teamSize === size
                          ? "bg-purple-600/20 border-purple-500 text-purple-300 shadow-md shadow-purple-600/20"
                          : "bg-[#181820] border-neutral-800 text-neutral-400 hover:text-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Field 1: Industry / Use Case */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FiLayers className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Industry / Primary Focus</span>
                  </span>
                  <span className="text-[10px] text-neutral-500 font-normal">(Optional)</span>
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-[#181820] border border-neutral-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="">Select industry (Optional)...</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              {/* Optional Field 2: Referral Source (Lower visual weight) */}
              <div>
                <label className="block text-[11px] font-medium text-neutral-400 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FiCompass className="w-3 h-3 text-neutral-500" />
                    <span>How did you hear about us?</span>
                  </span>
                  <span className="text-[10px] text-neutral-500 font-normal">(Optional)</span>
                </label>
                <select
                  value={referralSource}
                  onChange={(e) => setReferralSource(e.target.value)}
                  className="w-full bg-[#141418] border border-neutral-800/80 rounded-xl py-2.5 px-4 text-[11px] text-neutral-300 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="">Select referral source (Optional)...</option>
                  {REFERRAL_SOURCES.map((ref) => (
                    <option key={ref} value={ref}>
                      {ref}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Trial Info Footer Banner */}
            <div className="p-3.5 rounded-2xl bg-purple-600/10 border border-purple-500/20 flex items-center gap-3">
              <span className="p-2 rounded-xl bg-purple-600/20 text-purple-400">✨</span>
              <p className="text-[11px] text-neutral-300 leading-snug">
                Includes <strong>14-Day Free Trial</strong> with unlimited 500+ app tool calling, workflow execution, and multi-channel automation.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !workspaceName.trim()}
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 disabled:opacity-50"
            >
              {loading ? (
                <FiLoader className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Create Workspace & Activate Trial</span>
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ── STEP 2: Team Invites (Presented in-flow, skippable) ── */}
        {step === "invites" && (
          <form onSubmit={handleSendInvites} className="space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
                <FiCheckCircle className="w-4 h-4" />
                <span>Workspace Created & Trial Active!</span>
              </div>
              <h2 className="text-xl font-bold text-white">Invite your team</h2>
              <p className="text-xs text-neutral-400">
                Collaborate with colleagues across workflows and connected tools.
              </p>
            </div>

            <div className="space-y-3">
              {invites.map((inv, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
                    <input
                      type="email"
                      value={inv.email}
                      onChange={(e) => updateInviteField(idx, "email", e.target.value)}
                      placeholder="teammate@company.com"
                      className="w-full bg-[#181820] border border-neutral-800 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 transition-all"
                    />
                  </div>

                  <select
                    value={inv.role}
                    onChange={(e) => updateInviteField(idx, "role", e.target.value)}
                    className="bg-[#181820] border border-neutral-800 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                    <option value="viewer">Viewer</option>
                  </select>

                  {invites.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInviteRow(idx)}
                      className="p-2.5 text-neutral-500 hover:text-red-400 rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}

              {invites.length < 5 && (
                <button
                  type="button"
                  onClick={addInviteRow}
                  className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1.5 pt-1 cursor-pointer"
                >
                  <FiPlus className="w-3.5 h-3.5" />
                  <span>Add another teammate</span>
                </button>
              )}
            </div>

            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => onComplete && onComplete(createdWorkspace)}
                className="py-3 px-6 rounded-full bg-[#181820] border border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs font-semibold transition-all cursor-pointer"
              >
                Skip for now
              </button>

              <button
                type="submit"
                disabled={loading}
                className="py-3 px-6 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-purple-600/30 disabled:opacity-50"
              >
                {loading ? (
                  <FiLoader className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Send Invites & Launch Dashboard</span>
                    <FiArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
