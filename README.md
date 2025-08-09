# Scriptly

Scriptly is a sleek and modern desktop application developed with Electron.js. Users can upload videos, receive an "uploaded" notification after the upload, and click the "Send" button to send the video to the backend. On the backend, the video’s audio is transcribed to text using Python Flask and OpenAI Whisper, and the result is displayed in the interface.


## Features
- Sleek and modern Electron.js interface
- Video upload with upload notification
- Send button to transmit video to backend
- Automatic (audio/video)-to-text with Whisper

## Installation
Instructions for project build by order:

1. In /project_dir:
```
npm install
```

2. In /project_dir/backend:
```
python -m venv .venv
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

## Backend (Flask + Whisper)
- A `backend/` folder will be created and Flask + Whisper integration will be implemented there.
- Once the backend is running, it will communicate with the Electron interface.


## Notlar
- For Whisper integration, the Python environment requires the `openai-whisper` and `flask` packages.
- The "Send" button in the interface will function properly once the backend is ready.

---
More information and backend integration details will be added to the README.
