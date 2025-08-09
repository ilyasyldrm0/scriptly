import io
import av
import numpy as np
import whisper
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

# Flask uygulamasını başlat
app = Flask(__name__)
CORS(app)  # CORS desteği

# Whisper modeli
try:
    model = whisper.load_model("base")
except Exception as e:
    raise RuntimeError(f"Whisper modeli yüklenemedi: {str(e)}")

# Videodan ses çıkaran fonksiyon
def extract_audio_as_array(video_bytes: bytes, target_sr=16000):
    try:
        container = av.open(io.BytesIO(video_bytes))
    except Exception:
        return None, "Video dosyası okunamadı"

    try:
        stream = next(s for s in container.streams if s.type == "audio")
    except StopIteration:
        return None, "Ses akışı bulunamadı"

    frames = []
    for packet in container.demux(stream):
        for frame in packet.decode():
            arr = frame.to_ndarray().astype(np.float32)
            if arr.dtype == np.int16:
                arr = arr / 32768.0
            if arr.ndim > 1:
                arr = arr.mean(axis=0)
            frames.append(arr)

    if not frames:
        return None, "Ses verisi boş"

    audio = np.concatenate(frames, axis=0)

    # Yeniden örnekleme
    if stream.rate != target_sr:
        duration = len(audio) / stream.rate
        new_len = int(duration * target_sr)
        audio = np.interp(
            np.linspace(0, len(audio), new_len),
            np.arange(len(audio)),
            audio
        ).astype(np.float32)

    return audio, None

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})


# Transcribe endpoint
@app.route("/transcribe", methods=["POST"])
def transcribe():
    if "video" not in request.files:
        return jsonify({"error": "Video dosyası gönderilmedi"}), 400

    file = request.files["video"]
    data = file.read()

    audio, err = extract_audio_as_array(data)
    if err:
        return jsonify({"error": err}), 400

    try:
        result = model.transcribe(audio)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("Registered routes:")
    for rule in app.url_map.iter_rules():
        print(rule)
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=True, use_reloader=False)
