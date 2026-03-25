"use client";

import { useState, useCallback } from "react";
import {
  initContract,
  assignGrant,
  claimGrant,
  getGrant,
  CONTRACT_ADDRESS,
} from "@/hooks/contract";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Spotlight } from "@/components/ui/spotlight";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ── Icons ────────────────────────────────────────────────────

function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1" />
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </svg>
  );
}

function HandIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
      <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
      <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function CoinsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 18V6" />
    </svg>
  );
}

// ── Styled Input ─────────────────────────────────────────────

function Input({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-medium uppercase tracking-wider text-white/30">
        {label}
      </label>
      <div className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-px transition-all focus-within:border-[#7c6cf0]/30 focus-within:shadow-[0_0_20px_rgba(124,108,240,0.08)]">
        <input
          {...props}
          className="w-full rounded-[11px] bg-transparent px-4 py-3 font-mono text-sm text-white/90 placeholder:text-white/15 outline-none"
        />
      </div>
    </div>
  );
}

// ── Method Signature ─────────────────────────────────────────

function MethodSignature({
  name,
  params,
  returns,
  color,
}: {
  name: string;
  params: string;
  returns?: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3 font-mono text-sm">
      <span style={{ color }} className="font-semibold">fn</span>
      <span className="text-white/70">{name}</span>
      <span className="text-white/20 text-xs">{params}</span>
      {returns && (
        <span className="ml-auto text-white/15 text-[10px]">{returns}</span>
      )}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────

type Tab = "check" | "assign" | "claim" | "init";

interface ContractUIProps {
  walletAddress: string | null;
  onConnect: () => void;
  isConnecting: boolean;
}

export default function ContractUI({ walletAddress, onConnect, isConnecting }: ContractUIProps) {
  const [activeTab, setActiveTab] = useState<Tab>("check");
  const [error, setError] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<string | null>(null);

  // Init state
  const [initAdmin, setInitAdmin] = useState("");
  const [isInitializing, setIsInitializing] = useState(false);

  // Assign grant state
  const [assignRecipient, setAssignRecipient] = useState("");
  const [assignAmount, setAssignAmount] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  // Claim grant state
  const [claimRecipient, setClaimRecipient] = useState("");
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimedAmount, setClaimedAmount] = useState<string | null>(null);

  // Check grant state
  const [checkRecipient, setCheckRecipient] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [grantAmount, setGrantAmount] = useState<string | null>(null);

  const truncate = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  // Initialize contract (admin only)
  const handleInit = useCallback(async () => {
    if (!walletAddress) return setError("Connect wallet first");
    if (!initAdmin.trim()) return setError("Enter admin address");
    setError(null);
    setIsInitializing(true);
    setTxStatus("Awaiting signature...");
    try {
      await initContract(walletAddress, initAdmin.trim());
      setTxStatus("Contract initialized!");
      setInitAdmin("");
      setTimeout(() => setTxStatus(null), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Transaction failed");
      setTxStatus(null);
    } finally {
      setIsInitializing(false);
    }
  }, [walletAddress, initAdmin]);

  // Assign grant (admin only)
  const handleAssignGrant = useCallback(async () => {
    if (!walletAddress) return setError("Connect wallet first");
    if (!assignRecipient.trim()) return setError("Enter recipient address");
    if (!assignAmount.trim() || isNaN(Number(assignAmount)) || Number(assignAmount) <= 0) {
      return setError("Enter a valid amount");
    }
    setError(null);
    setIsAssigning(true);
    setTxStatus("Awaiting signature...");
    try {
      await assignGrant(walletAddress, assignRecipient.trim(), BigInt(assignAmount));
      setTxStatus("Grant assigned successfully!");
      setAssignRecipient("");
      setAssignAmount("");
      setTimeout(() => setTxStatus(null), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Transaction failed");
      setTxStatus(null);
    } finally {
      setIsAssigning(false);
    }
  }, [walletAddress, assignRecipient, assignAmount]);

  // Claim grant (recipient)
  const handleClaimGrant = useCallback(async () => {
    if (!walletAddress) return setError("Connect wallet first");
    if (!claimRecipient.trim()) return setError("Enter your address");
    setError(null);
    setIsClaiming(true);
    setClaimedAmount(null);
    setTxStatus("Awaiting signature...");
    try {
      // First check the grant amount before claiming
      const currentGrant = await getGrant(claimRecipient.trim(), walletAddress);
      const amount = currentGrant ? String(currentGrant) : "0";
      
      if (!currentGrant || currentGrant === 0) {
        setError("No grant available to claim");
        setTxStatus(null);
        setIsClaiming(false);
        return;
      }
      
      await claimGrant(walletAddress, claimRecipient.trim());
      setTxStatus("Grant claimed successfully!");
      setClaimedAmount(amount);
      setClaimRecipient("");
      setTimeout(() => { setTxStatus(null); setClaimedAmount(null); }, 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Transaction failed");
      setTxStatus(null);
    } finally {
      setIsClaiming(false);
    }
  }, [walletAddress, claimRecipient]);

  // Check grant (anyone)
  const handleCheckGrant = useCallback(async () => {
    if (!checkRecipient.trim()) return setError("Enter recipient address");
    setError(null);
    setIsChecking(true);
    setGrantAmount(null);
    try {
      const result = await getGrant(checkRecipient.trim(), walletAddress || undefined);
      if (result !== null && result !== undefined) {
        setGrantAmount(String(result));
      } else {
        setGrantAmount("0");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Query failed");
    } finally {
      setIsChecking(false);
    }
  }, [checkRecipient, walletAddress]);

  const tabs: { key: Tab; label: string; icon: React.ReactNode; color: string }[] = [
    { key: "check", label: "Check", icon: <SearchIcon />, color: "#4fc3f7" },
    { key: "assign", label: "Assign", icon: <GiftIcon />, color: "#7c6cf0" },
    { key: "claim", label: "Claim", icon: <HandIcon />, color: "#34d399" },
    { key: "init", label: "Setup", icon: <CoinsIcon />, color: "#fbbf24" },
  ];

  return (
    <div className="w-full max-w-2xl animate-fade-in-up-delayed">
      {/* Toasts */}
      {error && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-[#f87171]/15 bg-[#f87171]/[0.05] px-4 py-3 backdrop-blur-sm animate-slide-down">
          <span className="mt-0.5 text-[#f87171]"><AlertIcon /></span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[#f87171]/90">Error</p>
            <p className="text-xs text-[#f87171]/50 mt-0.5 break-all">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="shrink-0 text-[#f87171]/30 hover:text-[#f87171]/70 text-lg leading-none">&times;</button>
        </div>
      )}

      {txStatus && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-[#34d399]/15 bg-[#34d399]/[0.05] px-4 py-3 backdrop-blur-sm shadow-[0_0_30px_rgba(52,211,153,0.05)] animate-slide-down">
          <span className="text-[#34d399]">
            {txStatus.includes("success") || txStatus.includes("initialized") || txStatus.includes("assigned") || txStatus.includes("claimed") ? <CheckIcon /> : <SpinnerIcon />}
          </span>
          <span className="text-sm text-[#34d399]/90">{txStatus}</span>
        </div>
      )}

      {/* Main Card */}
      <Spotlight className="rounded-2xl">
        <AnimatedCard className="p-0" containerClassName="rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#7c6cf0]/20 to-[#34d399]/20 border border-white/[0.06]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#7c6cf0]">
                  <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
                  <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white/90">Grant Distribution</h3>
                <p className="text-[10px] text-white/25 font-mono mt-0.5">{truncate(CONTRACT_ADDRESS)}</p>
              </div>
            </div>
            <Badge variant="info" className="text-[10px]">Soroban</Badge>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/[0.06] px-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => { setActiveTab(t.key); setError(null); setGrantAmount(null); setClaimedAmount(null); }}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-3.5 text-sm font-medium transition-all",
                  activeTab === t.key ? "text-white/90" : "text-white/35 hover:text-white/55"
                )}
              >
                <span style={activeTab === t.key ? { color: t.color } : undefined}>{t.icon}</span>
                {t.label}
                {activeTab === t.key && (
                  <span
                    className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full transition-all"
                    style={{ background: `linear-gradient(to right, ${t.color}, ${t.color}66)` }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Check Grant */}
            {activeTab === "check" && (
              <div className="space-y-5">
                <MethodSignature name="get_grant" params="(recipient: Address)" returns="-> i128" color="#4fc3f7" />
                <Input label="Recipient Address" value={checkRecipient} onChange={(e) => setCheckRecipient(e.target.value)} placeholder="G..." />
                <ShimmerButton onClick={handleCheckGrant} disabled={isChecking} shimmerColor="#4fc3f7" className="w-full">
                  {isChecking ? <><SpinnerIcon /> Querying...</> : <><SearchIcon /> Check Grant</>}
                </ShimmerButton>

                {grantAmount !== null && (
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden animate-fade-in-up">
                    <div className="border-b border-white/[0.06] px-4 py-3 flex items-center justify-between">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-white/25">Grant Amount</span>
                      <Badge variant="info">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#4fc3f7]" />
                        Available
                      </Badge>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/35">Amount</span>
                        <span className="font-mono text-xl text-white/80">{grantAmount}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Assign Grant (Admin) */}
            {activeTab === "assign" && (
              <div className="space-y-5">
                <MethodSignature name="assign_grant" params="(recipient: Address, amount: i128)" color="#7c6cf0" />
                <Input label="Recipient Address" value={assignRecipient} onChange={(e) => setAssignRecipient(e.target.value)} placeholder="G..." />
                <Input label="Amount (XLM)" value={assignAmount} onChange={(e) => setAssignAmount(e.target.value)} placeholder="e.g. 100" type="number" />

                {walletAddress ? (
                  <ShimmerButton onClick={handleAssignGrant} disabled={isAssigning} shimmerColor="#7c6cf0" className="w-full">
                    {isAssigning ? <><SpinnerIcon /> Assigning...</> : <><GiftIcon /> Assign Grant</>}
                  </ShimmerButton>
                ) : (
                  <button
                    onClick={onConnect}
                    disabled={isConnecting}
                    className="w-full rounded-xl border border-dashed border-[#7c6cf0]/20 bg-[#7c6cf0]/[0.03] py-4 text-sm text-[#7c6cf0]/60 hover:border-[#7c6cf0]/30 hover:text-[#7c6cf0]/80 active:scale-[0.99] transition-all disabled:opacity-50"
                  >
                    Connect wallet to assign grants
                  </button>
                )}
              </div>
            )}

            {/* Claim Grant (Recipient) */}
            {activeTab === "claim" && (
              <div className="space-y-5">
                <MethodSignature name="claim_grant" params="(recipient: Address)" returns="-> i128" color="#34d399" />
                <Input label="Your Address" value={claimRecipient} onChange={(e) => setClaimRecipient(e.target.value)} placeholder="G..." />

                {claimedAmount && (
                  <div className="rounded-xl border border-[#34d399]/20 bg-[#34d399]/[0.05] p-4 animate-fade-in-up">
                    <div className="flex items-center gap-2 text-[#34d399]">
                      <CheckIcon />
                      <span className="font-medium">Grant Claimed!</span>
                    </div>
                    <p className="text-sm text-white/50 mt-1">Amount: {claimedAmount} XLM</p>
                  </div>
                )}

                {walletAddress ? (
                  <ShimmerButton onClick={handleClaimGrant} disabled={isClaiming} shimmerColor="#34d399" className="w-full">
                    {isClaiming ? <><SpinnerIcon /> Claiming...</> : <><HandIcon /> Claim Grant</>}
                  </ShimmerButton>
                ) : (
                  <button
                    onClick={onConnect}
                    disabled={isConnecting}
                    className="w-full rounded-xl border border-dashed border-[#34d399]/20 bg-[#34d399]/[0.03] py-4 text-sm text-[#34d399]/60 hover:border-[#34d399]/30 hover:text-[#34d399]/80 active:scale-[0.99] transition-all disabled:opacity-50"
                  >
                    Connect wallet to claim grant
                  </button>
                )}
              </div>
            )}

            {/* Initialize (Admin Setup) */}
            {activeTab === "init" && (
              <div className="space-y-5">
                <MethodSignature name="init" params="(admin: Address)" color="#fbbf24" />
                <p className="text-xs text-white/40">Initialize the contract with an admin address. This should only be done once.</p>
                <Input label="Admin Address" value={initAdmin} onChange={(e) => setInitAdmin(e.target.value)} placeholder="G... (your admin address)" />

                {walletAddress ? (
                  <ShimmerButton onClick={handleInit} disabled={isInitializing} shimmerColor="#fbbf24" className="w-full">
                    {isInitializing ? <><SpinnerIcon /> Initializing...</> : <><CoinsIcon /> Initialize Contract</>}
                  </ShimmerButton>
                ) : (
                  <button
                    onClick={onConnect}
                    disabled={isConnecting}
                    className="w-full rounded-xl border border-dashed border-[#fbbf24]/20 bg-[#fbbf24]/[0.03] py-4 text-sm text-[#fbbf24]/60 hover:border-[#fbbf24]/30 hover:text-[#fbbf24]/80 active:scale-[0.99] transition-all disabled:opacity-50"
                  >
                    Connect wallet to initialize
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-white/[0.04] px-6 py-3 flex items-center justify-between">
            <p className="text-[10px] text-white/15">Grant Distribution &middot; Soroban</p>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-[#4fc3f7]" />
                <span className="font-mono text-[9px] text-white/15">Check</span>
              </span>
              <span className="text-white/10 text-[8px]">&rarr;</span>
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-[#7c6cf0]" />
                <span className="font-mono text-[9px] text-white/15">Assign</span>
              </span>
              <span className="text-white/10 text-[8px]">&rarr;</span>
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-[#34d399]" />
                <span className="font-mono text-[9px] text-white/15">Claim</span>
              </span>
            </div>
          </div>
        </AnimatedCard>
      </Spotlight>
    </div>
  );
}
