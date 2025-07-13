import router, { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import {
  doc,
  getDoc,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
  type FieldValue,
  Firestore
} from 'firebase/firestore';
import {
  usersCollection,
  conversationCollection,
  messagesCollection
} from '@lib/firebase/collections';
import { useAuth } from '@lib/context/auth-context';
import { useCollection } from '@lib/hooks/useCollection';
import { MainContainer } from '@components/home/main-container';
import { MainHeader } from '@components/home/main-header';
import { StatsEmpty } from '@components/tweet/stats-empty';
import {
  MessagesLayout,
  ProtectedLayout
} from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { HeroIcon } from '@components/ui/hero-icon';
import { Button } from '@components/ui/button';
import type { ReactElement, ReactNode } from 'react';
import { Conversation } from '@lib/types/conversation';
import { User } from '@lib/types/user';
import { createMessage } from '@lib/firebase/utils';
import type { Message, MessageInput } from '@lib/types/message';
import { Loading } from '@components/ui/loading';
import Link from 'next/link';
import { Modal } from '@components/modal/modal';
import { useModal } from '@lib/hooks/useModal';
import { useWindow } from '@lib/context/window-context';



export default function Messages(): JSX.Element {
  const { back, query: routerQuery } = useRouter();
  const { user } = useAuth();
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [userCache, setUserCache] = useState<Record<string, User>>({});
  const [targetUserLoading, setTargetUserLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const { isMobile } = useWindow();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const { open, openModal, closeModal } = useModal();

  // Get the userId from the query param
  const targetUserId = routerQuery.user as string | undefined;

  // Create the conversations query - always call this hook
  const conversationsQuery = query(
    conversationCollection,
    where('participants', 'array-contains', user?.id || '')
  );

  const { data: conversations, loading } =
    useCollection<Conversation>(conversationsQuery);

  // Fetch target user info if userId is present
  useEffect(() => {
    if (targetUserId) {
      setTargetUserLoading(true);
      getDoc(doc(usersCollection, targetUserId))
        .then((snap) => {
          setTargetUser(snap.exists() ? snap.data() : null);
        })
        .catch((e) => {
          console.error(`Error fetching user - ${JSON.stringify(e)}`);
          setTargetUser(null);
        })
        .finally(() => setTargetUserLoading(false));
    } else {
      setTargetUser(null);
      setTargetUserLoading(false);
    }
  }, [targetUserId]);

  // Fetch and cache user data for all conversation participants
  useEffect(() => {
    if (!conversations) return;

    // Get all unique other user IDs
    const otherUserIds = Array.from(
      new Set(
        conversations
          .map((conv) => conv.participants.find((id) => id !== user!.id))
          .filter(Boolean)
      )
    ) as string[];

    // Filter out already cached users
    const uncachedUserIds = otherUserIds.filter((id) => !userCache[id]);

    if (uncachedUserIds.length === 0) return;

    // Fetch user data for uncached users
    Promise.all(
      uncachedUserIds.map((id) =>
        getDoc(doc(usersCollection, id)).then((snap) =>
          snap.exists() ? { id, data: snap.data() } : null
        )
      )
    ).then((results) => {
      const newCache: Record<string, User> = {};
      results.forEach((res) => {
        if (res) newCache[res.id] = res.data;
      });
      setUserCache((prev) => ({ ...prev, ...newCache }));
    }).catch(e => {
      console.error(`Error: ${JSON.stringify(e)}`);
    });
  }, [conversations, user!.id, userCache]);

  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sending, setSending] = useState(false);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    getDocs(usersCollection).then((snapshot) => {
      setAllUsers(
        snapshot.docs
          .map((doc) => ({ ...doc.data(), id: doc.id } as User))
          .filter((u) => u.id !== user.id)
      );
    });
  }, [user?.id]);

  const conversationId = (targetUser && user)
    ? [user.id, targetUser.id].sort().join('_')
    : null;

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }
    setMessagesLoading(true);
    const q = query(
      messagesCollection(conversationId),
      orderBy('createdAt', 'asc')
    );
    getDocs(q)
      .then((snapshot) => {
        setMessages(snapshot.docs.map((doc) => doc.data()));
      })
      .finally(() => setMessagesLoading(false));
  }, [conversationId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, targetUser]);

  if (!user?.id) {
    return <div>Loading user...</div>;
  }

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim() || !user?.id || !targetUser) return;

    setSending(true);

    try {
      const messageId = crypto.randomUUID();
      const conversationId = [user.id, targetUser.id].sort().join('_');
      const participants = [user.id, targetUser.id];

      // Create the message data without createdAt
      const messageData: MessageInput = {
        id: messageId,
        conversationId,
        senderId: user.id,
        text: message.trim(),
        readBy: [user.id]
      };

      // Add the message to local state immediately for instant feedback
      const newMessage: Message = {
        ...messageData,
        createdAt: Timestamp.now()
      };

      setMessages(prev => [...prev, newMessage]);

      setMessage('');

      // Send the message to Firestore
      await createMessage(conversationId, messageData, user.id, participants);

    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove the message from local state if sending failed
      setMessages(prev => prev.filter(msg => msg.id !== message));
    } finally {
      setSending(false);
    }
  };

  function formatMessageDate(dateString: string) {
    const now = new Date();
    const date = new Date(dateString);

    const isToday = now.toDateString() === date.toDateString();
    const isThisYear = now.getFullYear() === date.getFullYear();

    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffHours < 24 && isToday)
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    if (isThisYear)
      return date.toLocaleString('default', { month: 'short', day: 'numeric' });
    return date.toLocaleDateString('en-GB'); // e.g., 10/07/24
  }

  function getMessageDateString(createdAt: FieldValue | null | undefined): string {
    if (!createdAt) return '';
    if (typeof createdAt === 'string') return createdAt;
    if (createdAt && typeof createdAt === 'object' && 'toDate' in createdAt) {
      return (createdAt as Timestamp).toDate().toISOString();
    }
    return '';
  }

  const handleUserSelect = async (selectedUser: User) => {
    if (!user?.id) return;

    try {
      // Create conversation ID
      const conversationId = [user.id, selectedUser.id].sort().join('_');

      // Check if conversation already exists
      const existingConversation = conversations?.find((conv) =>
        conv.participants.includes(selectedUser.id)
      );

      if (!existingConversation) {
        // Create a new conversation with an empty initial message
        const messageId = crypto.randomUUID();
        const participants = [user.id, selectedUser.id];

        const messageData: MessageInput = {
          id: messageId,
          conversationId,
          senderId: user.id,
          text: '', // Empty initial message
          readBy: [user.id]
        };

        await createMessage(conversationId, messageData, user.id, participants);
      }

      // Set target user and navigate
      setTargetUser(selectedUser);
      router.push(
        {
          pathname: '/messages',
          query: { user: selectedUser.id }
        },
        undefined,
        { shallow: true }
      );

      closeModal();
      setUserSearch('');
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  if (isMobile) {
    // If no conversation is selected, show the conversation list
    if (!targetUser) {
      return (
        <div className='flex w-full h-screen'>
          <MainContainer className='w-full flex flex-col min-h-screen'>
            <MainHeader useActionButton title='Messages' action={back}>
              <Button
                className='dark-bg-tab group relative p-2 hover:bg-light-primary/10 active:bg-light-primary/20 
                           dark:hover:bg-dark-primary/10 dark:active:bg-dark-primary/20 ml-auto'
                onClick={openModal}
              >
                <HeroIcon
                  className='h-6 w-6'
                  iconName='EnvelopeIcon'
                />
                <span className="absolute right-1 bottom-1 text-main-accent text-xs font-bold">+</span>
              </Button>
            </MainHeader>
            <div className="px-4 py-3">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search Direct Messages"
                className="w-full rounded-full bg-main-background border border-light-border dark:border-dark-border px-4 py-2 text-base text-black dark:text-white placeholder:text-light-secondary dark:placeholder:text-dark-secondary focus:outline-none focus:ring-1 focus:ring-main-accent transition"
              />
            </div>
            {loading ? (
              <div className="flex flex-1 items-center justify-center h-full py-10">
                <Loading className="w-8 h-8" />
              </div>
            ) : !conversations || conversations.length === 0 ? (
              <StatsEmpty
                title='No Conversations'
                description='You have no conversations yet. Start a new message!'
              />
            ) : (
              <ul className='flex-1 overflow-y-auto'>
                {conversations.filter(conv => {
                  const otherUserId = conv.participants.find(id => id !== user.id);
                  const otherUser = otherUserId ? userCache[otherUserId] : null;
                  if (!otherUser) return false;
                  return otherUser.name.toLowerCase().includes(search.toLowerCase());
                }).map((conv) => {
                  const otherUserId = conv.participants.find((id) => id !== user.id);
                  const otherUser = otherUserId ? userCache[otherUserId] : null;
                  const lastMsg = conv.lastMessage;
                  let formattedDate = '';
                  if (lastMsg?.createdAt) {
                    formattedDate = formatMessageDate(lastMsg.createdAt);
                  }
                  const isUnseen = lastMsg && !lastMsg.readBy?.includes(user.id) && lastMsg.senderId !== user.id;

                  return (
                    <li
                      key={conv.id}
                      className='p-4 flex items-center gap-3 cursor-pointer transition hover:bg-light-secondary/10 dark:hover:bg-dark-secondary/20'
                      onClick={() => {
                        router.push(
                          {
                            pathname: '/messages',
                            query: { user: otherUserId },
                          },
                          undefined,
                          { shallow: true }
                        );
                      }}
                    >
                      <div className='w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-300 flex items-center justify-center'>
                        {otherUser?.photoURL && (
                          <img
                            src={otherUser.photoURL}
                            alt={otherUser.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        )}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center min-w-0 gap-1'>
                            <span className='font-bold text-base truncate'>
                              {otherUser ? (
                                otherUser.name
                              ) : (
                                <span className="flex items-center h-5">
                                  <Loading className="w-5 h-5" />
                                </span>
                              )}
                            </span>
                            <span className='text-base text-light-secondary dark:text-dark-secondary truncate ml-1'>
                              @{otherUser?.username}
                            </span>
                          </div>
                          {formattedDate && (
                            <span className="text-sm text-light-secondary dark:text-dark-secondary whitespace-nowrap ml-2">
                              {formattedDate}
                            </span>
                          )}
                        </div>
                        <div
                          className={`text-sm truncate ${isUnseen
                            ? 'font-bold text-white'
                            : 'text-light-secondary dark:text-dark-secondary'
                            }`}
                        >
                          {lastMsg?.text || 'No messages yet'}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </MainContainer>
        </div>
      );
    }

    // If a conversation is selected, show the message viewer
    return (
      <div className='flex w-full h-screen flex-col'>
        {/* Header with back button */}
        <div className='flex-shrink-0 bg-main-background border-b border-light-border dark:border-dark-border p-4'>
          <div className='flex items-center gap-3'>
            <Button
              className='dark-bg-tab group relative p-2 hover:bg-light-primary/10 active:bg-light-primary/20 
                         dark:hover:bg-dark-primary/10 dark:active:bg-dark-primary/20'
              onClick={async () => {
                await router.push('/messages', undefined, { shallow: true });
              }}
            >
              <HeroIcon className='h-5 w-5' iconName='ArrowLeftIcon' />
            </Button>
            <Link href={`/user/${targetUser.username}`} passHref>
              <div className='flex-1 cursor-pointer hover:bg-light-secondary/10 dark:hover:bg-dark-secondary/20 rounded-lg p-2 transition'>
                <div className='font-bold text-lg'>{targetUser.name}</div>
                <div className='text-sm text-light-secondary dark:text-dark-secondary'>
                  @{targetUser.username}
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Messages area */}
        <div className='flex-1 overflow-y-auto p-4 min-h-0'>
          <div className='flex flex-col gap-4 h-full'>
            {messagesLoading ? (
              <div className='flex flex-1 items-center justify-center'>
                <Loading className='w-8 h-8' />
              </div>
            ) : (
              <div className='flex flex-col gap-4 px-4 py-6 flex-1'>
                {messages && messages.length > 0 ? (
                  messages.map((msg) => {
                    const isMine = msg.senderId === user.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                      >
                        <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${isMine
                          ? 'bg-main-accent text-white rounded-br-md'
                          : 'bg-light-secondary/10 dark:bg-dark-secondary/20 text-white dark:text-white rounded-bl-md'
                          }`}
                        >
                          <div className="whitespace-pre-line break-words">{msg.text}</div>
                        </div>
                        <div
                          className={`text-xs mt-1 ${isMine
                            ? 'text-right text-light-secondary dark:text-dark-secondary pr-2'
                            : 'text-left text-light-secondary dark:text-dark-secondary pl-2'
                            }`}
                          style={{ maxWidth: '70%' }}
                        >
                          {formatMessageDate(getMessageDateString(msg.createdAt))}
                          {isMine && ' · Sent'}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-light-secondary dark:text-dark-secondary text-sm py-8">
                    {/* No messages yet. */}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input bar at bottom with extra padding for mobile */}
        <div className='flex-shrink-0 bg-main-background border-t border-light-border dark:border-dark-border p-4 pb-16'>
          <form onSubmit={handleSendMessage} className='flex items-center gap-3'>
            <input
              type='text'
              className='flex-1 rounded-full bg-light-primary/10 dark:bg-dark-primary/10 border border-light-border dark:border-dark-border px-4 py-3 text-base text-black dark:text-white placeholder:text-light-secondary dark:placeholder:text-dark-secondary focus:outline-none focus:ring-2 focus:ring-main-accent transition'
              placeholder='Message'
              value={message}
              onChange={e => setMessage(e.target.value)}
              autoComplete='off'
            />
            <Button
              type='submit'
              className='px-6 py-3 rounded-full bg-main-accent text-white font-semibold hover:bg-main-accent/90 transition disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={!message.trim() || sending}
            >
              {sending ? 'Sending...' : 'Send'}
            </Button>
          </form>
        </div>
      </div>
    );
  } else {
    // Desktop version remains the same
    return (
      <div className='flex h-screen w-full'>
        {/* Left: Conversations List */}
        <MainContainer className='flex min-h-screen w-full max-w-sm flex-col border-r border-light-border dark:border-dark-border'>
          <MainHeader useActionButton title='Messages' action={back}>
            <Button
              className='dark-bg-tab group relative ml-auto p-2 hover:bg-light-primary/10 
                         active:bg-light-primary/20 dark:hover:bg-dark-primary/10 dark:active:bg-dark-primary/20'
              onClick={openModal}
            >
              <HeroIcon className='h-6 w-6' iconName='EnvelopeIcon' />
              <span className='absolute right-1 bottom-1 text-xs font-bold text-main-accent'>
                +
              </span>
            </Button>
          </MainHeader>
          <div className='px-4 py-3'>
            <input
              type='text'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search Direct Messages'
              className='w-full rounded-full border border-light-border bg-main-background px-4 py-2 text-base text-black transition placeholder:text-light-secondary focus:outline-none focus:ring-1 focus:ring-main-accent dark:border-dark-border dark:text-white dark:placeholder:text-dark-secondary'
            />
          </div>
          {loading ? (
            <div className='flex h-full flex-1 items-center justify-center py-10'>
              <Loading className='h-8 w-8' />
            </div>
          ) : !conversations || conversations.length === 0 ? (
            <StatsEmpty
              title='No Conversations'
              description='You have no conversations yet. Start a new message!'
            />
          ) : (
            <ul className='flex-1 overflow-y-auto'>
              {conversations
                .filter((conv) => {
                  const otherUserId = conv.participants.find(
                    (id) => id !== user.id
                  );
                  const otherUser = otherUserId ? userCache[otherUserId] : null;
                  if (!otherUser) return false;
                  return otherUser.name
                    .toLowerCase()
                    .includes(search.toLowerCase());
                })
                .map((conv) => {
                  const otherUserId = conv.participants.find(
                    (id) => id !== user.id
                  );
                  const otherUser = otherUserId ? userCache[otherUserId] : null;
                  const lastMsg = conv.lastMessage;
                  let formattedDate = '';
                  if (lastMsg?.createdAt) {
                    formattedDate = formatMessageDate(lastMsg.createdAt);
                  }
                  const isSelected = otherUserId === targetUserId;
                  const isUnseen =
                    lastMsg &&
                    !lastMsg.readBy?.includes(user.id) &&
                    lastMsg.senderId !== user.id;

                  return (
                    <li
                      key={conv.id}
                      className={`flex cursor-pointer items-center gap-3 p-4 transition
                      ${isSelected
                          ? 'border-r-2 border-main-accent bg-light-secondary/10 dark:bg-dark-secondary/20'
                          : 'border-r-2 border-transparent'
                        }`}
                      onClick={async () => {
                        await router.push(
                          {
                            pathname: '/messages',
                            query: { user: otherUserId }
                          },
                          undefined,
                          { shallow: true }
                        );
                      }}
                    >
                      <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-300'>
                        {otherUser?.photoURL && (
                          <img
                            src={otherUser.photoURL}
                            alt={otherUser.name}
                            className='h-12 w-12 rounded-full object-cover'
                          />
                        )}
                      </div>
                      <div className='min-w-0 flex-1'>
                        <div className='flex items-center justify-between'>
                          <div className='flex min-w-0 items-center gap-1'>
                            <span className='truncate text-base font-bold'>
                              {otherUser ? (
                                otherUser.name
                              ) : (
                                <span className='flex h-5 items-center'>
                                  <Loading className='h-5 w-5' />
                                </span>
                              )}
                            </span>
                            <span className='ml-1 truncate text-base text-light-secondary dark:text-dark-secondary'>
                              @{otherUser?.username}
                            </span>
                          </div>
                          {formattedDate && (
                            <span className='ml-2 whitespace-nowrap text-sm text-light-secondary dark:text-dark-secondary'>
                              {formattedDate}
                            </span>
                          )}
                        </div>
                        <div
                          className={`truncate text-sm ${isUnseen
                            ? 'font-bold text-white'
                            : 'text-light-secondary dark:text-dark-secondary'
                            }`}
                        >
                          {lastMsg?.text || 'No messages yet'}
                        </div>
                      </div>
                    </li>
                  );
                })}
            </ul>
          )}
        </MainContainer>

        {/* Right: Message View */}
        <div className='flex h-screen w-full max-w-xl flex-col border-r border-light-border dark:border-dark-border'>
          {/* FIXED HEADER AT TOP */}
          {targetUser && (
            <div className='flex-shrink-0 border-b border-light-border bg-main-background/80 p-4 backdrop-blur-sm dark:border-dark-border'>
              <div className='flex items-center gap-3'>
                <div className='flex-1'>
                  <div className='text-lg font-bold'>{targetUser.name}</div>
                  <div className='text-sm text-light-secondary dark:text-dark-secondary'>
                    @{targetUser.username}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCROLLABLE AREA: profile + messages */}
          <div className='min-h-0 flex-1 overflow-y-auto p-4'>
            <div className='flex h-full flex-col gap-4'>
              {targetUser ? (
                <Link href={`/user/${targetUser.username}`} passHref>
                  <div
                    className='
                      flex cursor-pointer flex-col items-center justify-center
                      rounded-none border-b
                      border-light-border p-6
                      transition hover:bg-light-primary/30 dark:border-dark-border
                      dark:hover:bg-dark-primary/30
                    '
                    style={{ textDecoration: 'none' }}
                  >
                    <img
                      src={
                        targetUser.photoURL ||
                        '/public/assets/twitter-avatar.jpg'
                      }
                      alt={targetUser.name}
                      className='mb-4 h-16 w-16 rounded-full object-cover'
                    />
                    <div className='mb-1 text-xl font-bold'>
                      {targetUser.name}
                    </div>
                    <div className='mb-2 text-base text-light-secondary dark:text-dark-secondary'>
                      @{targetUser.username}
                    </div>
                    {targetUser.bio && (
                      <div className='mb-2 max-w-md text-center text-black dark:text-white'>
                        {targetUser.bio}
                      </div>
                    )}
                    <div className='mb-2 flex items-center gap-4 text-sm text-light-secondary dark:text-dark-secondary'>
                      <span>
                        Joined{' '}
                        {targetUser.createdAt
                          ? new Date(
                            targetUser.createdAt.seconds * 1000
                          ).toLocaleString('default', {
                            month: 'long',
                            year: 'numeric'
                          })
                          : '—'}
                      </span>
                      <span>•</span>
                      <span>
                        <b>{targetUser.followers.length || 0}</b> Followers
                      </span>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className='flex min-h-[300px] flex-1 items-center justify-center'>
                  <StatsEmpty
                    title='No Conversation Selected'
                    description='Select a conversation to start messaging.'
                  />
                </div>
              )}
              {messagesLoading ? (
                <div className='flex flex-1 items-center justify-center'>
                  <Loading className='h-8 w-8' />
                </div>
              ) : (
                <div className='flex flex-1 flex-col gap-4 px-4 py-6'>
                  {messages && messages.length > 0 ? (
                    messages.map((msg) => {
                      const isMine = msg.senderId === user.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isMine ? 'items-end' : 'items-start'
                            }`}
                        >
                          <div
                            className={`max-w-[70%] rounded-2xl px-4 py-3 ${isMine
                              ? 'rounded-br-md bg-main-accent text-white'
                              : 'rounded-bl-md bg-light-secondary/10 text-white dark:bg-dark-secondary/20 dark:text-white'
                              }`}
                          >
                            <div className='whitespace-pre-line break-words'>
                              {msg.text}
                            </div>
                          </div>
                          <div
                            className={`mt-1 text-xs ${isMine
                              ? 'pr-2 text-right text-light-secondary dark:text-dark-secondary'
                              : 'pl-2 text-left text-light-secondary dark:text-dark-secondary'
                              }`}
                            style={{ maxWidth: '70%' }}
                          >
                            {formatMessageDate(
                              getMessageDateString(msg.createdAt)
                            )}
                            {isMine && ' · Sent'}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className='py-8 text-center text-sm text-light-secondary dark:text-dark-secondary'>
                      {/* No messages yet. */}
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>

          {/* FIXED INPUT BAR AT BOTTOM */}
          {targetUser && (
            <div className='flex-shrink-0 border-t border-light-border bg-main-background p-4 dark:border-dark-border'>
              <form
                onSubmit={handleSendMessage}
                className='flex items-center gap-3'
              >
                <input
                  type='text'
                  className='flex-1 rounded-full border border-light-border bg-light-primary/10 px-4 py-3 text-base text-black transition placeholder:text-light-secondary focus:outline-none focus:ring-2 focus:ring-main-accent dark:border-dark-border dark:bg-dark-primary/10 dark:text-white dark:placeholder:text-dark-secondary'
                  placeholder='Message'
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  autoComplete='off'
                />
                <Button
                  type='submit'
                  className='rounded-full bg-main-accent px-6 py-3 font-semibold text-white transition hover:bg-main-accent/90 disabled:cursor-not-allowed disabled:opacity-50'
                  disabled={!message.trim() || sending}
                >
                  {sending ? 'Sending...' : 'Send'}
                </Button>
              </form>
            </div>
          )}
        </div>

        <Modal
          open={open}
          closeModal={closeModal}
          modalClassName={`bg-main-background rounded-2xl w-full max-w-lg mx-auto p-0
            ${isMobile
              ? 'fixed bottom-0 left-0 right-0 max-w-full rounded-b-none'
              : 'mt-16'
            }
          `}
        >
          <div className='flex flex-col'>
            <div className='flex items-center border-b border-light-border p-4 dark:border-dark-border'>
              <span className='flex-1 text-lg font-bold'>New message</span>
              <button className='px-2 text-2xl' onClick={closeModal}>
                ×
              </button>
            </div>
            <div className='border-b border-light-border p-4 dark:border-dark-border'>
              <input
                type='text'
                className='w-full rounded-full border border-light-border bg-main-background px-4 py-2 text-base text-black transition placeholder:text-light-secondary focus:outline-none focus:ring-1 focus:ring-main-accent dark:border-dark-border dark:text-white dark:placeholder:text-dark-secondary'
                placeholder='Search people'
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>
            <div
              className='flex-1 overflow-y-auto'
              style={{ maxHeight: isMobile ? '60vh' : '400px' }}
            >
              {allUsers
                .filter(
                  (u) =>
                    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                    u.username.toLowerCase().includes(userSearch.toLowerCase())
                )
                .map((u) => (
                  <div
                    key={u.id}
                    className='flex cursor-pointer items-center gap-3 px-4 py-3 transition hover:bg-light-secondary/10 dark:hover:bg-dark-secondary/20'
                    onClick={() => handleUserSelect(u)}
                  >
                    <img
                      src={u.photoURL || '/public/assets/twitter-avatar.jpg'}
                      alt={u.name}
                      className='h-10 w-10 rounded-full object-cover'
                    />
                    <div className='min-w-0 flex-1'>
                      <div className='truncate text-base font-bold'>
                        {u.name}
                      </div>
                      <div className='truncate text-sm text-light-secondary dark:text-dark-secondary'>
                        @{u.username}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

Messages.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <MessagesLayout>{page}</MessagesLayout>
    </MainLayout>
  </ProtectedLayout>
);
