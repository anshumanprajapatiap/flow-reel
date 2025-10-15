from fastapi import APIRouter, UploadFile, File, Query, Form
from fastapi.responses import FileResponse
import librosa
import numpy as np
import matplotlib.pyplot as plt
import tempfile
import os
import time
import re


router = APIRouter(prefix="/audio", tags=["Audio"])

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)  # one level up from routers/
UPLOAD_DIR = os.path.join(PROJECT_ROOT, "project_uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_audio(file: UploadFile = File(...), project_id: str = Form(...)):
    """
    Upload audio file and save inside project_uploads/
    File ID format: <project_id>_<timestamp>_<sanitized_filename>
    """
    timestamp = int(time.time())

    # ✅ Sanitize filename (replace special characters with '_')
    safe_filename = re.sub(r'[^A-Za-z0-9_.-]', '_', file.filename)

    # Construct unique file ID
    file_id = f"{project_id}_{timestamp}_{safe_filename}"
    file_path = os.path.join(UPLOAD_DIR, file_id)

    # Save file to disk
    with open(file_path, "wb") as f:
        f.write(await file.read())

    res = {
        "project_id": project_id,
        "file_id": file_id,
        "path": file_path,
        "timestamp": timestamp
    }

    print("✅ Uploaded:", res)
    return res


@router.get("/{file_id}/beats")
async def detect_beats(file_id: str, mode: str = "auto"):
    """Detect beats and generate waveform"""
    file_path = os.path.join(UPLOAD_DIR, file_id)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Audio not found")

    y, sr = librosa.load(file_path, sr=None)

    # Waveform sample (downsample for performance)
    hop = sr // 100
    waveform = y[::hop].tolist()

    # Auto beat detection
    tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
    beat_times = librosa.frames_to_time(beats, sr=sr).tolist()

    return JSONResponse({
        "duration": librosa.get_duration(y=y, sr=sr),
        "waveform": waveform[:20000],  # limit
        "beats": beat_times if mode == "auto" else []
    })


@router.post("/{file_id}/beats/manual")
async def save_manual_beats(file_id: str, beats: list[float]):
    """Save manual beats for project use"""
    # You can later persist this in SQLite or JSON for now
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}_manual.json")
    np.save(file_path, np.array(beats))
    return {"status": "saved", "file": file_path}

@router.post("/analyze")
async def analyze_audio(file: UploadFile = File(...)):
    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        tmp_path = tmp.name
        content = await file.read()
        tmp.write(content)

    try:
        # Load the audio file
        y, sr = librosa.load(tmp_path, sr=None)

        # Compute beats
        tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
        beat_times = librosa.frames_to_time(beat_frames, sr=sr)

        # Compute waveform (downsampled for efficiency)
        waveform = y[::max(1, len(y) // 1000)].tolist()

        return {
            "tempo_bpm": float(tempo),
            "beat_times": beat_times.tolist(),
            "waveform": waveform,
            "sample_rate": sr
        }

    except Exception as e:
        return {"error": str(e)}
    finally:
        os.remove(tmp_path)



@router.post("/waveform")
async def generate_waveform(
    file: UploadFile = File(...),
    format: str = Query("json", enum=["json", "png"])):
    """
    Returns waveform data or generates a PNG visualization.
    """
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        tmp_path = tmp.name
        content = await file.read()
        tmp.write(content)

    try:
        y, sr = librosa.load(tmp_path, sr=None)

        # Downsample for lighter response
        waveform = y[::max(1, len(y) // 2000)]
        times = np.linspace(0, len(y) / sr, num=len(waveform))

        if format == "png":
            img_path = tempfile.mktemp(suffix=".png")
            plt.figure(figsize=(10, 3))
            plt.plot(times, waveform, color="steelblue")
            plt.title("Audio Waveform")
            plt.xlabel("Time (s)")
            plt.ylabel("Amplitude")
            plt.tight_layout()
            plt.savefig(img_path, dpi=100)
            plt.close()
            return FileResponse(img_path, media_type="image/png")

        else:
            return {
                "sample_rate": sr,
                "duration_sec": round(len(y) / sr, 2),
                "waveform_points": waveform.tolist(),
                "time_points": times.tolist()
            }

    except Exception as e:
        return {"error": str(e)}
    finally:
        os.remove(tmp_path)


# -----------------------------
# 2️⃣ Add Audio Metadata
# -----------------------------
# @router.post("/{user_id}/{project_id}/add-audio")
# async def add_audio_to_project(
#     user_id: str,
#     project_id: str,
#     file_name: str = Form(...),
#     start: float = Form(...),
#     end: float = Form(...),
#     duration: float = Form(...),
#     beats: str = Form(...),  # send JSON stringified array from frontend
#     file_id: Optional[str] = Form(None),
# ):
#     """Append audio info to the user's project JSON"""
#     project_path = get_project_path(user_id, project_id)
#     if not os.path.exists(project_path):
#         raise HTTPException(status_code=404, detail="Project not found")

#     with open(project_path, "r") as f:
#         project_data = json.load(f)

#     project_data["audios"][file_name] = {
#         "start": start,
#         "end": end,
#         "duration": duration,
#         "beats": json.loads(beats),
#         "file_id": file_id or "",
#         "updated_at": int(time.time()),
#     }

#     with open(project_path, "w") as f:
#         json.dump(project_data, f, indent=2)

#     return {"status": "audio_added", "file": project_path}

