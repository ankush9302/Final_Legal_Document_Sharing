import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    pdfOriginalName: '',
    pdfUrl: '',
    excelOriginalName: '',
    excelUrl: '',
    batchId : '',
};

export const batchSlice = createSlice({
  name: 'batch',
  initialState,
  reducers: {
    selectBatch: (state, action) => {
        state.pdfOriginalName = action.payload.pdfOriginalName;
        state.pdfUrl = action.payload.pdfUrl;
        state.excelOriginalName = action.payload.excelOriginalName;
        state.excelUrl = action.payload.excelUrl;
        state.batchId = action.payload._id; 
    },
    clearBatch : (state) => {
        state.pdfOriginalName = '';
        state.pdfUrl = '';
        state.excelOriginalName = '';
        state.excelUrl = '';
        state.batchId = ''; 
    },
  },
});

export const { selectBatch , clearBatch } = batchSlice.actions;

export default batchSlice.reducer;