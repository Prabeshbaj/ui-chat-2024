import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from './store';

interface Label {
  id: string;
  name: string;
  tags: string[];
}

interface LabelsState {
  labels: Label[];
  pins: Label[];
  recents: string[];
  selectedSection: 'pin' | 'recent' | 'label' | null;
  selectedLabel: Label | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Replace this URL with your API endpoint
const LABELS_API_URL = 'http://localhost:5000/labels';

const initialState: LabelsState = {
  labels: [],
  pins: [],
  recents: [],
  selectedSection: null,
  selectedLabel: null,
  status: 'idle',
  error: null,
};

export const fetchLabels:any = createAsyncThunk('labels/fetchLabels', async () => {
  const response = await fetch(LABELS_API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch labels');
  }
  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('API response is not an array');
  }
  return data as Label[];
});

const labelsSlice = createSlice({
  name: 'labels',
  initialState,
  reducers: {
    addPin: (state, action: PayloadAction<string>) => {
      const label = state.labels.find((label) => label.id === action.payload);
      if (label && !state.pins.includes(label)) {
        state.pins.push(label);
      }
    },
    addRecent: (state, action: PayloadAction<string>) => {
      if (!state.recents.includes(action.payload)) {
        state.recents.push(action.payload);
      }
    },
    setSelectedSection: (state, action: PayloadAction<'pin' | 'recent' | 'label' | null>) => {
      state.selectedSection = action.payload;
    },
    setSelectedLabel: (state, action: PayloadAction<Label | null>) => {
      state.selectedLabel = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLabels.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLabels.fulfilled, (state, action: PayloadAction<Label[]>) => {
        state.status = 'succeeded';
        state.labels = action.payload;
      })
      .addCase(fetchLabels.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch labels';
      });
  },
});

export const { addPin, addRecent, setSelectedSection, setSelectedLabel } = labelsSlice.actions;

export const selectLabels = (state: RootState) => state.labels.labels;
export const selectPins = (state: RootState) => state.labels.pins;
export const selectRecents = (state: RootState) => state.labels.recents;
export const selectSelectedSection = (state: RootState) => state.labels.selectedSection;
export const selectSelectedLabel = (state: RootState) => state.labels.selectedLabel;
export const selectStatus = (state: RootState) => state.labels.status;

export default labelsSlice.reducer;
