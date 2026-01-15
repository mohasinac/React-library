/**
 * React Hooks
 *
 * Reusable custom hooks for common patterns
 */

// Debounce and throttle hooks
export { useDebounce, useDebouncedCallback, useThrottle } from "./useDebounce";

// Storage hooks
export { useLocalStorage } from "./useLocalStorage";
export type { UseLocalStorageOptions } from "./useLocalStorage";

// Media query and responsive hooks
export {
  BREAKPOINTS,
  useBreakpoint,
  useIsDesktop,
  useIsMobile,
  useIsTablet,
  useIsTouchDevice,
  useMediaQuery,
  useViewport,
} from "./useMediaQuery";

// Utility hooks
export {
  useClipboard,
  useCounter,
  useInterval,
  usePrevious,
  useTimeout,
  useToggle,
} from "./useUtilities";

// Upload hooks (Task 17.2)
export { useMediaUpload } from "./useMediaUpload";
export type { MediaUploadOptions, MediaUploadReturn } from "./useMediaUpload";

// Table and data hooks (Task 18.1)
export { useBulkSelection } from "./useBulkSelection";
export type {
  UseBulkSelectionOptions,
  UseBulkSelectionReturn,
} from "./useBulkSelection";

export { useLoadingState, useMultiLoadingState } from "./useLoadingState";
export type {
  LoadingState,
  UseLoadingStateOptions,
  UseLoadingStateReturn,
} from "./useLoadingState";

export { usePaginationState } from "./usePaginationState";
export type {
  PaginationConfig,
  UsePaginationStateReturn,
} from "./usePaginationState";

export { useResourceList } from "./useResourceList";
export type {
  FilterConfig,
  SievePagination,
  SortField,
  UseResourceListOptions,
  UseResourceListReturn,
} from "./useResourceList";

export { useResourceListState } from "./useResourceListState";
export type {
  ResourceListConfig,
  UseResourceListStateReturn,
} from "./useResourceListState";

export { useFetchResourceList } from "./useFetchResourceList";
export type {
  FetchResourceListConfig,
  UseFetchResourceListReturn,
} from "./useFetchResourceList";
