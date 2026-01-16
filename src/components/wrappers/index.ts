/**
 * Wrapper & Layout Components
 * 
 * Framework-agnostic wrapper components for consistent page layouts.
 */

// Resource wrappers
export { ResourceListWrapper } from "./ResourceListWrapper";
export { ResourceDetailWrapper } from "./ResourceDetailWrapper";

// Settings components
export {
  SettingsSection,
  SettingsGroup,
  SettingsRow,
} from "./SettingsSection";

// Forms
export { SmartAddressForm } from "./SmartAddressForm";
export type {
  AddressFormData,
  PincodeService,
  GPSService,
  SmartAddressFormProps,
} from "./SmartAddressForm";
// Note: GeoCoordinates and PincodeLookupResult are already exported from ui and forms
