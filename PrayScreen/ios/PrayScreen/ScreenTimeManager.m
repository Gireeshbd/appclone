//
//  ScreenTimeManager.m
//  PrayScreen
//
//  React Native bridge for ScreenTimeManager Swift module
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ScreenTimeManager, NSObject)

// Authorization
RCT_EXTERN_METHOD(requestAuthorization:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(checkAuthorizationStatus:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// App Blocking
RCT_EXTERN_METHOD(blockApps:(NSArray *)bundleIds
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(unblockApps:(NSArray *)bundleIds
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(unblockAllApps:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// App Selection
RCT_EXTERN_METHOD(openAppPicker:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// Installed Apps
RCT_EXTERN_METHOD(getInstalledApps:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

@end
