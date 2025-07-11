# Contributing to Wequil Open

Thank you for your interest in contributing to Wequil Open! This document provides guidelines and information for contributors to help make the contribution process smooth and effective.

## 🤝 How to Contribute

We welcome contributions from the community! Whether you're fixing bugs, adding features, improving documentation, or suggesting ideas, we appreciate your help.

### �� Before You Start

1. **Check Existing Issues**: Before creating a new issue or starting work, please check our [Issues page](https://github.com/mboyamike/wequil_open/issues) to see if your idea or bug has already been reported.

2. **Create an Issue First**: Creating an issue before any pull request is submitted helps us:
   - Prevent duplicate work
   - Discuss the approach before implementation
   - Ensure the contribution aligns with our project goals
   - Plan and coordinate with other contributors

3. **Comment on Existing Issues**: If you find an issue you'd like to work on, please comment on it to let us know you're interested. This prevents multiple people from working on the same thing.

## 🚀 Contribution Workflow

### Step 1: Create or Find an Issue

**For new features or bug reports:**
- Create a new issue with a clear title and description
- Use the appropriate issue template if available
- Include steps to reproduce (for bugs) or detailed requirements (for features)

**For existing issues:**
- Comment on the issue to express your interest
- Wait for maintainer approval before starting work

### Step 2: Fork and Clone

1. Fork the repository to your GitHub account
2. Clone your fork locally:
   ```bash
   git clone https://github.com/mboyamike/wequil_open.git
   cd wequil_open
   ```

### Step 3: Set Up Development Environment

The project consists of multiple components. Set up the ones you'll be working on:

**For Mobile Development:**
```bash
cd mobile
flutter pub get
```

**For Supabase/Backend:**
```bash
cd supabase
# Follow setup instructions in supabase/README.md
```

### Step 4: Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### Step 5: Make Your Changes

- Write code
- Follow the existing code style and conventions
- Update documentation as needed

### Step 6: Test Your Changes

**For Mobile:**
```bash
cd mobile
flutter test
flutter analyze
```

### Step 7: Commit Your Changes

Commit your changes using the git commit command (or git IDE )

```bash
git commit -m "feat: add user authentication feature"
git commit -m "fix: resolve navigation issue in mobile app"
git commit -m "docs: update README with setup instructions"
```


### Step 8: Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a pull request with:
- Title describing the change
- Reference to the related issue (e.g., "Fixes #123")
- Description of what was changed and why
- Screenshots or videos for UI changes if possible

## 📁 Project Structure

```
wequil_open/
├── mobile/          # Flutter mobile application
├── web/             # React web application (coming soon)
└── supabase/        # Supabase configuration and backend files
```

## 🛠️ Development Guidelines

### Code Style

- **Mobile (Flutter)**: Follow Flutter's style guide and use `flutter analyze`
- **General**: Use meaningful variable and function names

### Pull Request Requirements

- [ ] Issue created and referenced
- [ ] Code follows project style guidelines
- [ ] No breaking changes (or clearly documented if necessary)

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. **Description** of the problem
2. **Steps to reproduce** the issue
3. **Expected behavior** vs actual behavior
4. **Environment details** (OS, Flutter version, device, etc.)
5. **Screenshots or videos** if applicable
6. **Error logs** if available

## 💡 Suggesting Features

When suggesting features:

1. **Description** of the feature
2. **Use case** and why it would be valuable
3. **Mockups or examples** if applicable
4. **Consideration** of implementation complexity

##  Getting Help

- **GitHub Issues**: For bugs, feature requests, and general questions
- **Website**: Visit [https://wequil.app](https://wequil.app) for more information and discussion

## 🏷️ Issue Labels

We use labels to categorize issues:
- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `mobile` - Mobile app related
- `web` - Web app related
- `backend` - Backend/Supabase related

## 📄 License

By contributing to Wequil Open, you agree that your contributions will be licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.
