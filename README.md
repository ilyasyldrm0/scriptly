# Scriptly - AI-Powered Speech-to-Text Converter

Scriptly is a cutting-edge desktop application that automatically transcribes speech from video and audio files into English text using advanced AI technology. Perfect for content creators, journalists, students, and professionals who need accurate speech-to-text conversion.


## Features
- 🎤 AI-Powered Transcription - Leverages OpenAI Whisper for precise English transcription
- 🖥️ Modern Desktop App - Built with Electron.js for smooth performance
- 📁 Multi-Format Support - Works with MP4, MOV, MP3, WAV and other common formats
- ⚡ One-Click Processing - Simple "Submit" button to start conversion

## Installation
Instructions for project build by order:

1. In /project_dir:
```
npm install
```

2. In /project_dir/backend:
```
python -m venv .venv
./.venv/scripts/activate (for windows)
pip install -r requirements.txt
```

3. For start, In /project_dir:
```
npm run start
```

4. For build, In /project_dir:
```
npm run build
```

## Technical Highlights
- Python Flask Backend for reliable processing
- Whisper AI Integration for industry-leading accuracy
- Cross-Platform - Works on Windows, Mac, and Linux

## Notes
- For Whisper integration, the Python environment requires the `openai-whisper` and `flask` packages.
- The "Send" button in the interface will function properly once the backend is ready.

Perfect for:
✅ Content creators needing transcripts<br />
✅ Journalists converting interviews to text<br />
✅ Students transcribing lectures<br />
✅ Professionals creating meeting notes <br />

"Turn spoken words into written text with AI precision - no manual typing required!"

---
More information and backend integration details will be added to the README.
