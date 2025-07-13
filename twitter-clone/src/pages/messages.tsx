import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { doc, getDoc, query, where } from "firebase/firestore";
import { usersCollection, conversationCollection, useMessagesCollection } from "@lib/firebase/collections";
import { useAuth } from "@lib/context/auth-context";
import { useCollection } from "@lib/hooks/useCollection";
import { MainContainer } from "@components/home/main-container";
import { MainHeader } from "@components/home/main-header";
import { StatsEmpty } from "@components/tweet/stats-empty";
import { MessagesLayout, ProtectedLayout } from "@components/layout/common-layout";
import { MainLayout } from "@components/layout/main-layout";
import type { ReactElement, ReactNode } from "react";

export default function Messages(): JSX.Element {
  const { back, query: routerQuery } = useRouter();
  const { user } = useAuth();
  const [targetUser, setTargetUser] = useState<any>(null);

  // Get the userId from the query param
  const targetUserId = routerQuery.user as string | undefined;

  // Fetch target user info if userId is present
  useEffect(() => {
    if (targetUserId) {
      getDoc(doc(usersCollection, targetUserId)).then((snap) => {
        setTargetUser(snap.exists() ? snap.data() : null);
      });
    }
  }, [targetUserId]);

  // Find or create a conversationId (for 1-1, could be a sorted join of user ids)
  const conversationId = user && targetUserId
    ? [user.id, targetUserId].sort().join("_")
    : undefined;

  // Fetch messages for this conversation
  const messagesRef = conversationId ? useMessagesCollection(conversationId) : null;
  // You can use a custom hook or Firestore's onSnapshot to fetch messages here

  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change (if you render messages)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [/* messages */]);

  if (!user?.id) {
    return <div>Loading user...</div>;
  }

  const conversationsQuery = query(
    conversationCollection,
    where('participants', 'array-contains', user.id)
  );

  const { data: conversations, loading } = useCollection<any>(conversationsQuery);

  console.log('conversations', conversations, 'loading', loading);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) return;
    // handle send message logic here
    setMessage("");
  };

  return (
    <div className="flex w-full justify-center gap-0 lg:gap-4">
      {/* Left: Conversations List */}
      <MainContainer className="w-full max-w-xl flex flex-col min-h-screen border-r border-light-border dark:border-dark-border">
        <MainHeader useActionButton title="Messages" action={back} />
        {loading || !conversations || conversations.length === 0 ?  <StatsEmpty
            title="No Conversations"
            description="You have no conversations yet. Start a new message!"
          /> : (
          <ul>
            {conversations.map((conv) => (
              <li key={conv.id}>{conv.lastMessage?.text || "No messages yet"}</li>
            ))}
          </ul>
        )}
      </MainContainer>
      {/* Right: Message View */}
      <MainContainer className="w-full max-w-xl flex flex-col min-h-screen relative">
        {targetUser ? (
          <>
            {/* Header with user info */}
            <div className="sticky top-0 z-10 bg-main-background border-b border-light-border dark:border-dark-border p-4">
              <div className="font-bold">{targetUser.name}</div>
              <div className="text-sm text-light-secondary">@{targetUser.username}</div>
            </div>
            {/* Messages list */}
            <div className="flex-1 overflow-y-auto p-4 pb-24">
              {/* Render messages here */}
              <div ref={messagesEndRef} />
            </div>
            {/* Absolute bottom input bar */}
            <form
              className="absolute bottom-0 left-0 w-full bg-main-background border-t border-light-border dark:border-dark-border px-4 py-3 flex items-center gap-2"
              onSubmit={handleSendMessage}
              style={{ zIndex: 20 }}
            >
              <input
                type="text"
                className="flex-1 rounded-full bg-white/10 dark:bg-transparent border border-light-border dark:border-dark-border px-4 py-2 text-base text-black dark:text-white placeholder:text-light-secondary dark:placeholder:text-dark-secondary focus:outline-none focus:ring-2 focus:ring-main-accent transition"
                placeholder="Message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                autoComplete="off"
              />
              <button
                type="submit"
                className="ml-2 px-4 py-2 rounded-full bg-main-accent text-white font-semibold hover:bg-main-accent/90 transition disabled:opacity-50"
                disabled={!message.trim()}
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <StatsEmpty
            title="Select a conversation"
            description="Choose a conversation to view your messages."
          />
        )}
      </MainContainer>
    </div>
  );
}

Messages.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <MessagesLayout>{page}</MessagesLayout>
    </MainLayout>
  </ProtectedLayout>
);