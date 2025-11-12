//
//  ScreenTimeManager.swift
//  PrayScreen
//
//  iOS Screen Time API integration for app blocking
//  Requires iOS 15.0+, FamilyControls framework
//

import Foundation
import FamilyControls
import ManagedSettings
import DeviceActivity

@objc(ScreenTimeManager)
class ScreenTimeManager: NSObject {

  private let store = ManagedSettingsStore()
  private let center = AuthorizationCenter.shared

  // MARK: - Authorization

  @objc
  func requestAuthorization(_ resolve: @escaping RCTPromiseResolveBlock,
                           rejecter reject: @escaping RCTPromiseRejectBlock) {
    Task {
      do {
        try await center.requestAuthorization(for: .individual)

        DispatchQueue.main.async {
          resolve(["authorized": true])
        }
      } catch {
        DispatchQueue.main.async {
          reject("AUTH_ERROR", "Failed to authorize Screen Time: \(error.localizedDescription)", error)
        }
      }
    }
  }

  @objc
  func checkAuthorizationStatus(_ resolve: @escaping RCTPromiseResolveBlock,
                                rejecter reject: @escaping RCTPromiseRejectBlock) {
    let status = center.authorizationStatus

    let statusString: String
    switch status {
    case .notDetermined:
      statusString = "notDetermined"
    case .denied:
      statusString = "denied"
    case .approved:
      statusString = "approved"
    @unknown default:
      statusString = "unknown"
    }

    resolve([
      "status": statusString,
      "authorized": status == .approved
    ])
  }

  // MARK: - App Blocking

  @objc
  func blockApps(_ bundleIds: [String],
                 resolver resolve: @escaping RCTPromiseResolveBlock,
                 rejecter reject: @escaping RCTPromiseRejectBlock) {

    // Check authorization first
    guard center.authorizationStatus == .approved else {
      reject("NOT_AUTHORIZED", "Screen Time not authorized", nil)
      return
    }

    // Convert bundle IDs to application tokens
    let tokens = bundleIds.compactMap { bundleId -> ApplicationToken? in
      // Note: In real implementation, you need to use FamilyActivityPicker
      // to get proper ApplicationTokens. This is a simplified version.
      return nil // Placeholder - needs proper token conversion
    }

    // Shield the apps
    store.shield.applications = Set(tokens)
    store.shield.applicationCategories = .all()

    resolve([
      "success": true,
      "blockedCount": tokens.count
    ])
  }

  @objc
  func unblockApps(_ bundleIds: [String],
                   resolver resolve: @escaping RCTPromiseResolveBlock,
                   rejecter reject: @escaping RCTPromiseRejectBlock) {

    guard center.authorizationStatus == .approved else {
      reject("NOT_AUTHORIZED", "Screen Time not authorized", nil)
      return
    }

    // Clear shields
    store.shield.applications = nil
    store.shield.applicationCategories = nil

    resolve([
      "success": true,
      "unblockedCount": bundleIds.count
    ])
  }

  @objc
  func unblockAllApps(_ resolve: @escaping RCTPromiseResolveBlock,
                      rejecter reject: @escaping RCTPromiseRejectBlock) {

    guard center.authorizationStatus == .approved else {
      reject("NOT_AUTHORIZED", "Screen Time not authorized", nil)
      return
    }

    // Clear all restrictions
    store.clearAllSettings()

    resolve(["success": true])
  }

  // MARK: - App Selection

  @objc
  func openAppPicker(_ resolve: @escaping RCTPromiseResolveBlock,
                     rejecter reject: @escaping RCTPromiseRejectBlock) {

    // Note: FamilyActivityPicker must be presented from SwiftUI view
    // This is a placeholder - needs SwiftUI bridge
    reject("NOT_IMPLEMENTED", "App picker requires SwiftUI view presentation", nil)
  }

  // MARK: - Installed Apps

  @objc
  func getInstalledApps(_ resolve: @escaping RCTPromiseResolveBlock,
                        rejecter reject: @escaping RCTPromiseRejectBlock) {

    // iOS doesn't allow querying all installed apps directly
    // Only apps selected via FamilyActivityPicker can be accessed

    // Return mock data for development
    let mockApps = [
      [
        "bundleId": "com.instagram.instagram",
        "name": "Instagram",
        "icon": ""
      ],
      [
        "bundleId": "com.facebook.Facebook",
        "name": "Facebook",
        "icon": ""
      ],
      [
        "bundleId": "com.twitter.twitter",
        "name": "Twitter",
        "icon": ""
      ],
      [
        "bundleId": "com.snapchat.snapchat",
        "name": "Snapchat",
        "icon": ""
      ],
      [
        "bundleId": "com.zhiliaoapp.musically",
        "name": "TikTok",
        "icon": ""
      ]
    ]

    resolve(mockApps)
  }

  // MARK: - React Native Setup

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
