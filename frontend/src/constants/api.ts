export const API_BASE_URL =
  process.env.REACT_APP_API_URL ?? 'http://localhost:8000';

export const PIPELINE_PARSE_PATH = '/pipelines/parse';

export const PIPELINE_PARSE_URL = `${API_BASE_URL}${PIPELINE_PARSE_PATH}`;

export const BACKEND_START_HINT =
  'Cannot reach backend. Start it with: cd backend && uvicorn app.main:app --reload';
