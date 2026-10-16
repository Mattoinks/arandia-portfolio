"use client";

import dynamic from "next/dynamic";

/**
 * Matte loads right after the page is interactive instead of with it — nobody
 * opens the chat in the first second, and it's one of the larger client bundles.
 */
export const ChatWidget = dynamic(() => import("./chat-widget").then((m) => m.ChatWidget), { ssr: false });
