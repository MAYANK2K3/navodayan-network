"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  GraduationCap,
  Users,
  MapPin,
  Send,
  Sparkles,
} from "lucide-react";
import { dataService } from "@/services/dataService";
import { useAuth } from "@/context/AuthContext";
import { useSoundFX } from "@/context/SoundContext";
import { ChatMessage } from "@/types";
import { toast } from "sonner";

export default function MessagesPage() {
  const { user, requireAuth } = useAuth();
  const { playPop, playTap, playSuccess } = useSoundFX();

  const [activeRoomId, setActiveRoomId] = useState("school-1");
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    dataService.getMessages("school-1")
  );
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const rooms = [
    {
      id: "school-1",
      title: "JNV Shimla Official Chapter",
      type: "school",
      subtitle: "Alumni & Campus Community",
      icon: GraduationCap,
    },
    {
      id: "batch-2015",
      title: "Batch of 2015 National Circle",
      type: "batch",
      subtitle: "Passout Batchmates Across 660+ JNVs",
      icon: Users,
    },
    {
      id: "city-bengaluru",
      title: "Bengaluru Navodayan Chapter",
      type: "city",
      subtitle: "Local City Meetup & Coffee Circle",
      icon: MapPin,
    },
  ];

  useEffect(() => {
    setMessages(dataService.getMessages(activeRoomId));
  }, [activeRoomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    requireAuth(() => {
      if (!inputText.trim()) return;

      const newMsg = dataService.sendMessage(activeRoomId, inputText.trim());
      playSuccess();
      setMessages((prev) => [...prev, newMsg]);
      setInputText("");
    });
  };

  const activeRoom = rooms.find((r) => r.id === activeRoomId) || rooms[0];

  return (
    <div className="h-[calc(100vh-10rem)] min-h-[500px] flex flex-col md:flex-row rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
      {/* Channels Sidebar */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-200/80 dark:border-zinc-800 flex flex-col bg-slate-50/50 dark:bg-zinc-950/40">
        <div className="p-4 border-b border-slate-200/80 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
            <span>Community Channels</span>
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Auto-Joined Channels
          </h2>
        </div>

        <div className="p-2 space-y-1 overflow-y-auto flex-1">
          {rooms.map((room) => {
            const Icon = room.icon;
            const isSelected = activeRoomId === room.id;

            return (
              <button
                key={room.id}
                onClick={() => {
                  playTap();
                  setActiveRoomId(room.id);
                }}
                className={`w-full p-3 rounded-2xl text-left transition-all flex items-center gap-3 ${
                  isSelected
                    ? "bg-navy-50 dark:bg-navy-950/80 border border-navy-200/80 dark:border-navy-800/80 text-navy-900 dark:text-white shadow-xs"
                    : "hover:bg-slate-100 dark:hover:bg-zinc-800/60 text-slate-700 dark:text-slate-300"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected
                      ? "bg-navy-800 text-amber-400"
                      : "bg-white dark:bg-zinc-800 text-slate-500 border border-slate-200 dark:border-zinc-700"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs truncate">{room.title}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {room.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Workspace */}
      <div className="flex-1 flex flex-col h-full bg-white dark:bg-zinc-900">
        {/* Chat Room Top Bar */}
        <div className="p-4 border-b border-slate-200/80 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {activeRoom.title}
            </h3>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Live Real-Time Navodayan Channel • All Verified Members
            </div>
          </div>

          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
            Active Channel
          </span>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 text-xs">
              <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
              <span>No messages in this channel yet. Say hello to your batchmates!</span>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = user && msg.sender_id === user.id;

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 max-w-lg ${
                    isMine ? "ml-auto flex-row-reverse" : ""
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={msg.sender_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                    alt={msg.sender_name}
                    className="w-8 h-8 rounded-full object-cover shrink-0 border border-amber-400"
                  />
                  <div
                    className={`p-3 rounded-2xl text-xs space-y-1 ${
                      isMine
                        ? "bg-navy-800 text-white rounded-tr-none"
                        : "bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white rounded-tl-none"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[10px] opacity-75">
                      <span className="font-bold">{msg.sender_name}</span>
                      <span>
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 border-t border-slate-200/80 dark:border-zinc-800 flex items-center gap-2 bg-slate-50/50 dark:bg-zinc-950/40"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${activeRoom.title}...`}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-900 dark:text-white"
          />
          <button
            type="submit"
            className="p-2.5 bg-navy-800 hover:bg-navy-900 text-white rounded-xl shadow-xs transition-colors shrink-0"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
