import { combineReducers, configureStore, PreloadedState } from '@reduxjs/toolkit'

import spreadSheetReducer from './spreadsheet/spreadsheetSlice'

const rootReducer = combineReducers({
  spreadsheet: spreadSheetReducer,
})

export function setupStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
  })
}
export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
