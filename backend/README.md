# VectorShift Pipeline Backend

## Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run

```bash
uvicorn app.main:app --reload --port 8000
```

## Environment

Optional `.env` values:

- `CORS_ORIGINS=http://localhost:3000`
- `HOST=0.0.0.0`
- `PORT=8000`
