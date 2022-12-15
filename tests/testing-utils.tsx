import { PreloadedState } from '@reduxjs/toolkit'
import { render, RenderOptions } from '@testing-library/react'
import { renderHook, RenderHookOptions } from '@testing-library/react-hooks'
import React, { ReactElement } from 'react'
import { Provider as ReduxProvider } from 'react-redux'

import { RootState, AppStore, setupStore } from '../src/redux/store'

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: PreloadedState<RootState>
  store?: AppStore
}

interface ExtendedHookRenderOptions extends Omit<RenderHookOptions<any>, 'wrapper'> {
  preloadedState?: PreloadedState<RootState>
  store?: AppStore
}

const Wrapper = ({ children, store }: { children: React.ReactNode; store: AppStore }) => (
  <ReduxProvider store={store}>{children}</ReduxProvider>
)

const customRender = (
  ui: ReactElement,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...options
  }: ExtendedRenderOptions = {},
) =>
  render(ui, {
    wrapper: ({ children }) => <Wrapper store={store}>{children}</Wrapper>,
    ...options,
  })

const customRenderHook = (
  callback: (props?: any) => any,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...options
  }: ExtendedHookRenderOptions = {},
) =>
  renderHook(callback, {
    wrapper: ({ children }) => <Wrapper store={store}>{children}</Wrapper>,
    ...options,
  })

export * from '@testing-library/react'
export { customRender as render, customRenderHook as renderHook }
