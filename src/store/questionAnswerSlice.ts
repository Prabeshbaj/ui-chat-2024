import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface QuestionAnswer {
  requestId: string;
  topic: string;
  message: string;
}

interface QuestionAnswerState {
  data: QuestionAnswer[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: QuestionAnswerState = {
  data: [],
  status: 'idle',
  error: null,
};

// Async thunk to fetch question and answer data
export const fetchQuestionAnswers = createAsyncThunk(
  'questionAnswers/fetchQuestionAnswers',
  async (requestId: string) => {
    const response = await axios.get(`/api/questions/${requestId}`);
    return response.data;
  }
);

const questionAnswerSlice = createSlice({
  name: 'questionAnswers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestionAnswers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuestionAnswers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchQuestionAnswers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch data';
      });
  },
});

export default questionAnswerSlice.reducer;
