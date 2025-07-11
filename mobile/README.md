# Wequil Mobile App

A Flutter-based community building app that empowers people to create and join communities around their shared interests. Think Twitter feeds, Medium posts, and Discord servers - all in one platform.

## 🚀 Features

- **Inspirations** - Updates from friends you follow
- **Projects** - Long-form content sharing with rich formatting
- **Rooms** - Real-time chat and collaboration spaces

## 🏗️ Architecture

```
UI → Riverpod → Repositories → Data Sources
```

- **UI Layer**: Pages and widgets using Flutter
- **State Management**: Riverpod for reactive state management
- **Data Layer**: Repository pattern with Supabase backend
- **Routing**: AutoRoute for declarative navigation

## 🛠️ Tech Stack

- **Framework**: Flutter 3.8+
- **State Management**: Riverpod
- **Backend**: Supabase (Database, Auth, Real-time, Storage)
- **Code Generation**: Freezed (Models), AutoRoute (Routing)
- **Architecture**: Repository pattern with clean separation

## 📁 Project Structure

```
// example format
lib/
├── repositories/          # Data sources and repository implementations
│   ├── auth_repository.dart
│   ├── feed_repository.dart
│   ├── projects_repository.dart
│   └── rooms_repository.dart
├── models/               # Data models organized by feature (Freezed)
│   ├── user/            # User-related models
│   │   └── user.dart
│   ├── inspirations/            # Feed and post models
│   │   └── inspiration.dart
│   ├── projects/        # Project-related models
│   │   └── project.dart
│   ├── rooms/           # Room and chat models
│   │   ├── room.dart
│   │   ├── room_channel.dart
│   │   └── room_member.dart
│   └── community/       # Community models
│       ├── community.dart
│       └── community_member.dart
├── providers/           # Riverpod providers organized by feature
│   ├── auth/           # Authentication providers
│   │   └── auth_provider.dart
│   │   
│   ├── user/           # User-related providers
│   │   └── user_provider.dart
│   │   
│   ├── feed/           # Feed providers
│   │   ├── feed_provider.dart
│   │   └── feed_pagination_provider.dart
│   ├── projects/       # Project providers
│   │   ├── projects_provider.dart
│   │   └── project_provider.dart
│   ├── rooms/          # Room providers
│   │   ├── rooms_provider.dart
│   │   ├── room_provider.dart
│   │   └── room_messages_provider.dart
│   └── app/            # App-wide providers
│       └── app_provider.dart
├── ui/                  # UI components
│   ├── pages/          # Full pages/screens
│   │   ├── auth/
│   │   ├── inspiration/
│   │   ├── projects/
│   │   └── rooms/
│   └── widgets/        # Reusable widgets
│       ├── common/
│       └── custom/
├── shared/             # Utility functions and constants
│   ├── constants.dart
│   ├── utils.dart
│   └── extensions.dart
├── router/             # AutoRoute configuration
│   └── app_router.dart
├── theme/              # App theming
│   ├── app_theme.dart
│   └── colors.dart
└── main.dart
```

## 🚀 Getting Started

### Prerequisites

- Flutter SDK 3.8.1 or higher
- Dart SDK 3.8.1 or higher
- IDE with Flutter extensions e.g windsurf/cursor/vs code/android studio
- Supabase project setup

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mboyamike/wequil_open.git
   cd wequil_open/mobile
   ```

2. **Install dependencies**
   ```bash
   flutter pub get
   ```

3. **Setup Supabase**
   - Create a Supabase project
   - Add your Supabase URL and anon key to environment variables
   - Run database migrations

4. **Run the app**
   ```bash
   flutter run
   ```

## 🔧 Development

### Code Generation

This project uses code generation for models and routing. Run these commands after making changes:

```bash
# Generate Needed files
flutter packages pub run build_runner build --delete-conflicting-outputs
```

### State Management

We use Riverpod for state management. Providers are organized by feature:

- `auth/` - Authentication state and user sessions
- `user/` - User profile and settings management
- `feed/` - Feed data and pagination
- `projects/` - Project management and details
- `rooms/` - Room/chat functionality and messaging
- `app/` - App-wide state and configuration

### Adding New Features

1. **Create models** in the appropriate feature directory under `models/`
2. **Add repositories** in `repositories/` directory
3. **Create providers** in the appropriate feature directory under `providers/`
4. **Build UI** in `ui/pages/` and `ui/widgets/`
5. **Update router** in `router/app_router.dart`

## 📱 Building for Production

### Android
```bash
flutter build apk --release
```

### iOS
```bash
flutter build ios --release
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the Apache License - see the [LICENSE](../LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Flutter Docs](https://docs.flutter.dev/)
- **Riverpod**: [Riverpod Documentation](https://riverpod.dev/)
- **Supabase**: [Supabase Documentation](https://supabase.com/docs)

## 🔮 Roadmap

- [ ] User authentication and profiles
- [ ] Community creation and management
- [ ] Feed with real-time updates
- [ ] Project creation and editing
- [ ] Room/chat functionality
- [ ] Push notifications
- [ ] Offline support
- [ ] Advanced search and discovery
