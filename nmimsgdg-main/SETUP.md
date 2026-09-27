# Setup & Developer Guide

## Prerequisites
- Node.js v18+ or v22+
- Python 3.10+ (for FastAPI backend)
- Ollama (optional, for local Nemotron LLM inference)

## Installation Steps

1. **Frontend Installation:**
   ```bash
   cd spyltmilk/client
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **Backend Installation (FastAPI):**
   ```bash
   cd backend
   pip install fastapi uvicorn pydantic
   python main.py
   ```

4. **Optional Ollama Setup:**
   ```bash
   ollama pull nemotron-mini
   ollama serve
   ```
