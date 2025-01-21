# CodeGuardian

As of 1/20/2025:

All services defined in `docker-compose.yml` should be working; however, not all are integrated into a fully functioning web app yet.

*This project is currently just a fun cool idea I work on whenever I get the chance :)*

To get started with the application:

```bash
docker-compose up 
```



CodeGuardian is a cutting-edge full-stack application that integrates artificial intelligence, machine learning, and cybersecurity principles to provide comprehensive code review, vulnerability detection, and real-time improvement suggestions. The platform helps developers write more secure, efficient, and maintainable code by identifying potential security risks, suggesting improvements, and providing performance insights.

## Key Features

- 🔒 Real-time security vulnerability detection: Detect common security flaws like SQL injections, command injections, and weak cryptography.
- 🤖 AI-powered code improvement suggestions: Receive context-aware suggestions to improve code quality and maintainability.
- 📊 Machine learning-based code analysis: Analyze code complexity, maintainability, and other key metrics using machine learning models.
- 🔍 Interactive code review interface: Easily navigate and interact with code reviews, security reports, and suggestions.
- 📈 Performance and security metrics dashboard: View detailed metrics related to code quality and security across various languages.
- 🛡️ Multiple programming language support: Detect vulnerabilities and analyze code for Python, JavaScript, Go, and more.

## Tech Stack

### Frontend

- React with TypeScript: For building a responsive, component-based UI.
- Tailwind CSS: A utility-first CSS framework for building modern, minimalist interfaces.
- React Query: For efficient data fetching and caching.
- Monaco Editor: A powerful code editor for a seamless code editing experience.

### Backend

- Go (Gin Framework): For building a fast, secure, and scalable backend.
- PostgreSQL: A reliable, relational database for storing code review data and user information.
- Redis: A high-performance in-memory data store for caching and managing state.

### AI & ML Service

- Python: Used to run the machine learning and AI services, particularly for the AI-driven code suggestions.
- FastAPI: A high-performance framework for building APIs that interface with the machine learning models and serve predictions.
- Transformers Library: The transformers library by Hugging Face is used to load and use pre-trained models like BART.
    - BART (facebook/bart-large): A sequence-to-sequence model fine-tuned for text generation tasks. In CodeGuardian, BART is used to generate AI-powered code suggestions for improving code quality and security.
- Torch: PyTorch is used to run models such as CodeBERT for analyzing code-related metrics like complexity and maintainability.

### DevOps

- Docker: To containerize the application and its dependencies, ensuring a consistent environment across all stages of development and production.
- Docker Compose: For defining and running multi-container Docker applications, ensuring the backend, frontend, and ML services work together smoothly.

## How It Works (Intended to...)

1. Code Analysis: Code submitted by the user is analyzed by the backend using machine learning models for complexity and maintainability. This involves using CodeBERT for embedding-based analysis and metrics generation.
2. Security Detection: The code is scanned for common security vulnerabilities using static analysis techniques and vulnerability detection patterns in languages such as Python, JavaScript, and Go.
3. AI-Powered Suggestions: The AI model BART generates context-aware suggestions for improving the code based on the analysis results and detected vulnerabilities.
4. Interactive Review: Developers can interact with the suggestions and review detailed vulnerability reports, allowing them to take corrective actions on their code.
5. Continuous Improvement: As developers improve their code, new metrics are generated, and the feedback loop continues to provide insights into code quality
