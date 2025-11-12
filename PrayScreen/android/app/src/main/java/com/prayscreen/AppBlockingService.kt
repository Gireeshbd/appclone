package com.prayscreen

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.AccessibilityServiceInfo
import android.content.Intent
import android.view.accessibility.AccessibilityEvent
import android.util.Log

/**
 * AppBlockingService
 *
 * Accessibility Service that monitors app launches and blocks configured apps
 * by returning user to home screen or showing prayer screen.
 *
 * Requires BIND_ACCESSIBILITY_SERVICE permission
 */
class AppBlockingService : AccessibilityService() {

    companion object {
        private const val TAG = "AppBlockingService"

        // Shared preferences key for blocked apps
        const val PREFS_NAME = "PrayScreenPrefs"
        const val BLOCKED_APPS_KEY = "blocked_apps"
        const val UNLOCKED_APPS_KEY = "unlocked_apps"
        const val UNLOCK_EXPIRY_KEY = "unlock_expiry"

        // Static reference to service instance
        private var instance: AppBlockingService? = null

        fun isServiceRunning(): Boolean {
            return instance != null
        }

        fun getInstance(): AppBlockingService? {
            return instance
        }
    }

    private val blockedApps = mutableSetOf<String>()
    private val unlockedApps = mutableSetOf<String>()
    private var unlockExpiryTime: Long = 0

    override fun onServiceConnected() {
        super.onServiceConnected()
        instance = this

        Log.d(TAG, "AppBlockingService connected")

        // Configure the accessibility service
        val info = AccessibilityServiceInfo().apply {
            eventTypes = AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED
            feedbackType = AccessibilityServiceInfo.FEEDBACK_GENERIC
            flags = AccessibilityServiceInfo.FLAG_INCLUDE_NOT_IMPORTANT_VIEWS
            notificationTimeout = 100
        }

        serviceInfo = info

        // Load blocked apps from preferences
        loadBlockedApps()

        Log.d(TAG, "Service configured with ${blockedApps.size} blocked apps")
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event?.eventType == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
            val packageName = event.packageName?.toString() ?: return

            // Ignore system UI and our own app
            if (packageName == "com.prayscreen" ||
                packageName.startsWith("com.android") ||
                packageName == "com.google.android.launcher") {
                return
            }

            // Check if app is blocked
            if (isAppBlocked(packageName)) {
                Log.d(TAG, "Blocked app detected: $packageName")
                handleBlockedApp(packageName)
            }
        }
    }

    override fun onInterrupt() {
        Log.d(TAG, "AppBlockingService interrupted")
    }

    override fun onDestroy() {
        super.onDestroy()
        instance = null
        Log.d(TAG, "AppBlockingService destroyed")
    }

    // MARK: - App Blocking Logic

    private fun isAppBlocked(packageName: String): Boolean {
        // Check if unlock period expired
        if (unlockExpiryTime > 0 && System.currentTimeMillis() > unlockExpiryTime) {
            clearUnlock()
        }

        // Check if app is in blocked list and not in unlocked list
        return blockedApps.contains(packageName) && !unlockedApps.contains(packageName)
    }

    private fun handleBlockedApp(packageName: String) {
        try {
            // Send broadcast to React Native app to show prayer screen
            val intent = Intent("com.prayscreen.APP_BLOCKED").apply {
                putExtra("packageName", packageName)
                setPackage("com.prayscreen")
            }
            sendBroadcast(intent)

            // Return to home screen
            val homeIntent = Intent(Intent.ACTION_MAIN).apply {
                addCategory(Intent.CATEGORY_HOME)
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            startActivity(homeIntent)

        } catch (e: Exception) {
            Log.e(TAG, "Error handling blocked app: ${e.message}", e)
        }
    }

    // MARK: - Configuration Methods (called from native module)

    fun setBlockedApps(apps: Set<String>) {
        blockedApps.clear()
        blockedApps.addAll(apps)
        saveBlockedApps()
        Log.d(TAG, "Updated blocked apps: ${blockedApps.size} apps")
    }

    fun getBlockedApps(): Set<String> {
        return blockedApps.toSet()
    }

    fun unlockApps(apps: Set<String>, durationSeconds: Int) {
        unlockedApps.clear()
        unlockedApps.addAll(apps)
        unlockExpiryTime = System.currentTimeMillis() + (durationSeconds * 1000L)

        saveUnlockedApps()

        Log.d(TAG, "Unlocked ${apps.size} apps for ${durationSeconds} seconds")
    }

    fun lockApps() {
        clearUnlock()
        Log.d(TAG, "Locked all apps")
    }

    private fun clearUnlock() {
        unlockedApps.clear()
        unlockExpiryTime = 0
        saveUnlockedApps()
    }

    // MARK: - Persistence

    private fun loadBlockedApps() {
        val prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE)
        val blockedAppsString = prefs.getString(BLOCKED_APPS_KEY, "") ?: ""
        val unlockedAppsString = prefs.getString(UNLOCKED_APPS_KEY, "") ?: ""
        unlockExpiryTime = prefs.getLong(UNLOCK_EXPIRY_KEY, 0)

        if (blockedAppsString.isNotEmpty()) {
            blockedApps.addAll(blockedAppsString.split(","))
        }

        if (unlockedAppsString.isNotEmpty()) {
            unlockedApps.addAll(unlockedAppsString.split(","))
        }
    }

    private fun saveBlockedApps() {
        val prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE)
        prefs.edit().putString(BLOCKED_APPS_KEY, blockedApps.joinToString(",")).apply()
    }

    private fun saveUnlockedApps() {
        val prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE)
        prefs.edit()
            .putString(UNLOCKED_APPS_KEY, unlockedApps.joinToString(","))
            .putLong(UNLOCK_EXPIRY_KEY, unlockExpiryTime)
            .apply()
    }
}
