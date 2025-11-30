import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

// Pending navigation to run once on Home
let pendingNavigation = null;

// Navigate function
export function navigate(name, params) {
  if (navigationRef.isReady() && navigationRef.getCurrentRoute()?.name === "Home") {
    navigationRef.navigate(name, params);
  } else {
    // Save pending navigation to run later when on Home
    pendingNavigation = { name, params };
  }
}

// Call this whenever navigation state changes
export function checkPendingNavigation(currentRouteName) {
  if (pendingNavigation && currentRouteName === "Home") {
    setTimeout(()=>{
      navigationRef.navigate(pendingNavigation.name, pendingNavigation.params);
      pendingNavigation = null;
    },1000)
  }
}
