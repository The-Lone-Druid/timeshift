# Contributing to TimeShift

Thank you for your interest in contributing to TimeShift! We welcome all contributions, whether they're bug fixes, new features, or documentation improvements.

## How to Contribute

1. **Fork the Repository**
   - Click the "Fork" button in the top right of the repository page
   - Clone your forked repository to your local machine
   ```bash
   git clone https://github.com/your-username/timeshift.git
   cd timeshift
   ```

2. **Set Up Development Environment**
   - Install dependencies:
   ```bash
   npm install
   ```
   - Create a `.env` file with your Slack app credentials:
   ```
   SLACK_BOT_TOKEN=xoxb-your-bot-token
   SLACK_SIGNING_SECRET=your-signing-secret
   SLACK_CLIENT_ID=your-client-id
   ```

3. **Create a New Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

4. **Make Your Changes**
   - Follow the existing code style
   - Write clear commit messages
   - Add tests if applicable
   - Update documentation as needed

5. **Test Your Changes**
   - Run the development server:
   ```bash
   npm run dev
   ```
   - Test your changes thoroughly

6. **Submit a Pull Request**
   - Push your changes to your fork
   ```bash
   git push origin your-branch-name
   ```
   - Create a Pull Request from your fork to the main repository
   - Fill out the PR template with details about your changes

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow the existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic

### Commit Messages
- Use present tense ("Add feature" not "Added feature")
- Start with a capital letter
- Keep it concise but descriptive
- Reference issues if applicable

### Pull Request Guidelines
- Provide a clear description of changes
- Include screenshots for UI changes
- Reference any related issues
- Ensure all tests pass
- Update documentation as needed

## Project Structure

```
timeshift/
├── api/              # Serverless API functions
├── src/              # Source code
│   ├── slack/        # Slack API interaction
│   ├── utils/        # Utility functions
│   └── types/        # TypeScript type definitions
├── public/           # Static assets
└── docs/             # Documentation
```

## Getting Help

If you need help or have questions:
- Open an issue in the repository
- Join our Slack workspace (if available)
- Check the existing documentation

## License

By contributing to TimeShift, you agree that your contributions will be licensed under the project's MIT License. 