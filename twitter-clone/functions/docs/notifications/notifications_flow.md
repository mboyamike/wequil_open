# Notifications System Architecture

## Overview
This document outlines the comprehensive notifications system for the Twitter Clone application, designed to handle real-time notifications, push messaging, and future content types beyond tweets.

## System Components

### Core Technologies
- **Firebase Cloud Functions** - Server-side notification processing
- **Firebase Cloud Messaging (FCM)** - Push notification delivery
- **Firestore** - Real-time notification storage and delivery
- **Next.js Client** - UI components and real-time updates

## Architecture Diagram

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client App    │    │  Cloud Functions │    │   Firestore     │
│                 │    │                  │    │                 │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────┐ │
│ │ User Action ├─┼────┼─┤  Trigger     │ │    │ │Notifications│ │
│ │ (Like/Reply)│ │    │ │  Functions   │ │    │ │ Collection  │ │
│ └─────────────┘ │    │ └──────┬───────┘ │    │ └─────────────┘ │
│                 │    │        │         │    │                 │
│ ┌─────────────┐ │    │ ┌──────▼───────┐ │    │ ┌─────────────┐ │
│ │Notification ├─┼────┼─┤ Notification ├─┼────┼─┤   Users     │ │
│ │   Bell/UI   │ │◄───┼─┤   Service    │ │    │ │ Collection  │ │
│ └─────────────┘ │    │ └──────┬───────┘ │    │ └─────────────┘ │
│                 │    │        │         │    │                 │
│ ┌─────────────┐ │    │ ┌──────▼───────┐ │    │                 │
│ │FCM Listener │ │◄───┼─┤ FCM Service  │ │    │                 │
│ └─────────────┘ │    │ └──────────────┘ │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Data Flow

### 1. Notification Creation Flow
```
User Action → Firestore Write → Cloud Function Trigger → Notification Processing → Firestore + FCM
```

**Detailed Steps:**
1. **User Action**: User likes a tweet, follows someone, creates a reply
2. **Firestore Write**: Action updates relevant document (tweet, user)
3. **Trigger Activation**: Cloud Function triggered by document change
4. **Validation**: Check notification settings, prevent duplicates
5. **Notification Creation**: Write to `/notifications` collection
6. **Push Delivery**: Send FCM message to recipient's devices
7. **Real-time Update**: Client receives notification via Firestore listener

### 2. Real-time Delivery Flow
```
Firestore Write → Real-time Listener → UI Update + Badge Count
```

### 3. Push Notification Flow
```
FCM Service → User's Devices → Background/Foreground Handling
```

## Database Schema

### Notifications Collection (`/notifications`)
```typescript
{
  id: string;                    // Auto-generated document ID
  type: NotificationType;        // 'like' | 'reply' | 'retweet' | 'follow' | 'mention' | 'new_post'
  recipientId: string;           // User receiving notification
  actorId: string;               // User who performed action
  targetType: ContentType;       // 'tweet' | 'article' | 'story' | 'user'
  targetId: string | null;       // ID of target content
  parentType?: ContentType;      // For nested content (reply to tweet)
  parentId?: string;             // Parent content ID
  read: boolean;                 // Read status
  createdAt: Timestamp;          // Creation time
  
  // Denormalized data for performance
  actorUsername: string;         // Cached actor username
  actorName: string;             // Cached actor display name
  actorPhotoURL: string;         // Cached actor avatar
  targetPreview?: string;        // First 50 chars of content
  targetTitle?: string;          // Title for articles/stories
}
```

### User Notification Settings (`/users/{userId}/notificationSettings/preferences`)
```typescript
{
  // Action-based preferences
  likes: boolean;
  replies: boolean;
  shares: boolean;
  follows: boolean;
  mentions: boolean;
  
  // Content-type preferences
  newTweets: boolean;
  newArticles: boolean;
  newStories: boolean;
  
  // Delivery preferences
  pushNotifications: boolean;
  emailNotifications: boolean;
  realTime: boolean;
  digest: 'off' | 'daily' | 'weekly';
}
```

### FCM Tokens (`/users/{userId}/private/fcmTokens`)
```typescript
{
  [token: string]: Timestamp;    // Token -> Registration time mapping
}
```

## Cloud Functions Architecture

### Function Triggers

#### Content-Based Triggers
- **`onTweetLiked`** - Triggers when tweet.userLikes array changes
- **`onTweetCreated`** - Handles replies and mentions in new tweets
- **`onTweetRetweeted`** - Triggers when tweet.userRetweets array changes
- **`onUserFollowed`** - Triggers when user.followers array changes

#### Future Content Triggers
- **`onArticleCreated`** - Notify followers of new articles
- **`onArticleLiked`** - Handle article likes
- **`onStoryCreated`** - Notify followers of new stories

### Service Layer

#### NotificationService
**Responsibilities:**
- Validate notification settings
- Prevent duplicate notifications
- Create notification documents
- Coordinate with FCM service

**Key Methods:**
```typescript
createNotification(data: NotificationData): Promise<void>
getUserNotificationSettings(userId: string): Promise<Settings>
isDuplicateNotification(notification: NotificationData): Promise<boolean>
shouldCreateNotification(type: string, settings: Settings): boolean
```

#### FCMService
**Responsibilities:**
- Manage FCM token lifecycle
- Send push notifications
- Handle message formatting
- Clean up invalid tokens

**Key Methods:**
```typescript
sendNotification(userId: string, notification: NotificationData): Promise<void>
getUserFCMTokens(userId: string): Promise<string[]>
createFCMPayload(notification: NotificationData): FCMPayload
cleanupInvalidTokens(userId: string, response: any, tokens: string[]): Promise<void>
```

## Client-Side Architecture

### Component Structure
```
components/notifications/
├── notification-provider.tsx      # FCM initialization and context
├── notification-bell.tsx          # Bell icon with unread count
├── notification-dropdown.tsx      # Quick notification preview
├── notification-list.tsx          # Full notifications page
├── notification-item.tsx          # Individual notification renderer
├── notification-settings.tsx      # User preference management
└── renderers/                     # Content-specific renderers
    ├── tweet-notification.tsx
    ├── article-notification.tsx
    └── user-notification.tsx
```

### Hooks & Context
```typescript
// Custom hooks for notification management
useNotifications(userId: string)           // Real-time notification fetching
useNotificationCount(userId: string)       // Unread count tracking
useNotificationSettings(userId: string)    // Settings management
useFCMToken(userId: string)               // FCM token registration
```

### Real-time Updates
```typescript
// Firestore listener pattern
const { data: notifications } = useCollection(
  query(
    collection(db, 'notifications'),
    where('recipientId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(50)
  )
);
```

## Notification Types & Behaviors

### Core Notification Types

| Type | Trigger | Target | Groupable | Push Enabled |
|------|---------|--------|-----------|--------------|
| `like` | User likes content | Content ID | Yes | Yes |
| `reply` | User replies to content | Parent content ID | No | Yes |
| `retweet` | User retweets content | Content ID | Yes | Yes |
| `follow` | User follows another user | User ID | Yes | Yes |
| `mention` | User mentions in content | Content ID | No | Yes |
| `new_post` | Followed user creates content | Content ID | Yes | Optional |

### Notification Grouping Logic
```typescript
// Example: Multiple likes on same content
"John, Sarah, and 3 others liked your tweet"

// Example: Multiple follows
"Mike, Alex, and 2 others started following you"

// Example: Multiple new posts
"You have 5 new tweets from people you follow"
```

## Performance Considerations

### Database Optimization
- **Composite Indexes**: `(recipientId, createdAt)` for efficient querying
- **Denormalization**: Cache actor info to avoid additional lookups
- **Pagination**: Limit queries to 20-50 notifications per fetch
- **Cleanup**: Auto-delete notifications older than 30 days

### Duplicate Prevention
- **Time Window**: Check for duplicates within 1-hour window
- **Deduplication Key**: `recipientId + actorId + type + targetId`
- **Batch Operations**: Atomic notification creation

### FCM Optimization
- **Token Management**: Clean up invalid/expired tokens
- **Batch Delivery**: Send to multiple devices efficiently
- **Payload Size**: Keep notification data under 4KB limit

## Security & Privacy

### Access Control
- **Firestore Rules**: Users can only read their own notifications
- **Function Authentication**: Validate user context in triggers
- **FCM Tokens**: Store in private subcollection

### Privacy Features
- **Notification Settings**: Granular control over notification types
- **Block/Mute**: Respect user blocking relationships
- **Data Minimization**: Only store necessary cached data

## Scalability Considerations

### Horizontal Scaling
- **Stateless Functions**: All functions are stateless and auto-scaling
- **Database Sharding**: Partition notifications by user ID if needed
- **CDN Delivery**: Serve notification assets via CDN

### Future Extensibility
- **Content Type System**: Abstract content interface for new types
- **Plugin Architecture**: Modular notification type handlers
- **Webhook Support**: External service notification delivery

## Monitoring & Analytics

### Key Metrics
- **Delivery Rate**: FCM message delivery success rate
- **Engagement Rate**: Notification click-through rate
- **Performance**: Function execution time and error rate
- **User Preferences**: Notification setting usage patterns

### Error Handling
- **Retry Logic**: Automatic retry for transient failures
- **Dead Letter Queue**: Failed notifications for manual review
- **Alerting**: Monitor critical failure rates

## Deployment & Operations

### Environment Setup
```bash
# Function deployment
firebase deploy --only functions

# Environment variables
firebase functions:config:set vapid.key="..." app.url="..."

# Required APIs
- Cloud Messaging API
- Cloud Functions API
- Firestore API
```

### Testing Strategy
- **Unit Tests**: Individual service method testing
- **Integration Tests**: End-to-end notification flow testing
- **Load Tests**: High-volume notification scenarios
- **User Acceptance**: Real device push notification testing

## Future Enhancements

### Phase 1 (Current)
- ✅ Basic notification types (like, reply, follow)
- ✅ Real-time delivery via Firestore
- ✅ Push notifications via FCM
- ✅ User preference management

### Phase 2 (Next)
- 🔄 Notification grouping and summarization
- 🔄 Rich push notification content
- 🔄 Email notification digest
- 🔄 Advanced user preferences

### Phase 3 (Future)
- ⏳ Multi-content type support (articles, stories)
- ⏳ Cross-platform notifications (web, mobile apps)
- ⏳ AI-powered notification prioritization
- ⏳ Analytics dashboard for notification insights

## Conclusion

This notification system provides a robust, scalable foundation that can grow with the platform. The architecture separates concerns effectively, ensures real-time delivery, and maintains flexibility for future content types and notification methods.

The combination of Firestore for real-time updates and FCM for push delivery ensures users stay engaged across all platforms and usage patterns, while the modular design allows for easy extension and customization.