package com.prayscreen

import android.content.Context
import android.content.Intent
import android.provider.Settings
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

/**
 * BlockingNativeModule
 *
 * React Native bridge for app blocking functionality via Accessibility Service
 */
class BlockingNativeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "BlockingModule"
    }

    // MARK: - Permission & Service Status

    @ReactMethod
    fun checkPermissionStatus(promise: Promise) {
        try {
            val hasPermission = isAccessibilityServiceEnabled()
            val isRunning = AppBlockingService.isServiceRunning()

            val result = Arguments.createMap().apply {
                putBoolean("hasPermission", hasPermission)
                putBoolean("isServiceRunning", isRunning)
                putString("status", when {
                    hasPermission && isRunning -> "granted"
                    hasPermission && !isRunning -> "enabled_not_running"
                    else -> "denied"
                })
            }

            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("PERMISSION_CHECK_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun requestPermission(promise: Promise) {
        try {
            // Open accessibility settings
            val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            reactApplicationContext.startActivity(intent)

            promise.resolve(Arguments.createMap().apply {
                putBoolean("opened", true)
                putString("message", "Please enable PrayScreen in Accessibility settings")
            })
        } catch (e: Exception) {
            promise.reject("PERMISSION_REQUEST_ERROR", e.message, e)
        }
    }

    private fun isAccessibilityServiceEnabled(): Boolean {
        val context = reactApplicationContext
        val serviceName = "${context.packageName}/${AppBlockingService::class.java.canonicalName}"

        val enabledServices = Settings.Secure.getString(
            context.contentResolver,
            Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
        ) ?: return false

        return enabledServices.contains(serviceName)
    }

    // MARK: - App Blocking

    @ReactMethod
    fun blockApps(bundleIds: ReadableArray, promise: Promise) {
        try {
            val service = AppBlockingService.getInstance()

            if (service == null) {
                promise.reject("SERVICE_NOT_RUNNING", "Accessibility service is not running")
                return
            }

            val apps = mutableSetOf<String>()
            for (i in 0 until bundleIds.size()) {
                bundleIds.getString(i)?.let { apps.add(it) }
            }

            service.setBlockedApps(apps)

            promise.resolve(Arguments.createMap().apply {
                putBoolean("success", true)
                putInt("blockedCount", apps.size)
            })
        } catch (e: Exception) {
            promise.reject("BLOCK_APPS_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun unblockApps(bundleIds: ReadableArray, durationSeconds: Int, promise: Promise) {
        try {
            val service = AppBlockingService.getInstance()

            if (service == null) {
                promise.reject("SERVICE_NOT_RUNNING", "Accessibility service is not running")
                return
            }

            val apps = mutableSetOf<String>()
            for (i in 0 until bundleIds.size()) {
                bundleIds.getString(i)?.let { apps.add(it) }
            }

            service.unlockApps(apps, durationSeconds)

            promise.resolve(Arguments.createMap().apply {
                putBoolean("success", true)
                putInt("unblockedCount", apps.size)
                putInt("duration", durationSeconds)
            })
        } catch (e: Exception) {
            promise.reject("UNBLOCK_APPS_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun getBlockedApps(promise: Promise) {
        try {
            val service = AppBlockingService.getInstance()

            if (service == null) {
                promise.resolve(Arguments.createArray())
                return
            }

            val blockedApps = service.getBlockedApps()
            val result = Arguments.createArray()

            blockedApps.forEach { result.pushString(it) }

            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("GET_BLOCKED_APPS_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun lockAllApps(promise: Promise) {
        try {
            val service = AppBlockingService.getInstance()

            if (service == null) {
                promise.reject("SERVICE_NOT_RUNNING", "Accessibility service is not running")
                return
            }

            service.lockApps()

            promise.resolve(Arguments.createMap().apply {
                putBoolean("success", true)
            })
        } catch (e: Exception) {
            promise.reject("LOCK_APPS_ERROR", e.message, e)
        }
    }

    // MARK: - Installed Apps

    @ReactMethod
    fun getInstalledApps(promise: Promise) {
        try {
            val pm = reactApplicationContext.packageManager
            val packages = pm.getInstalledApplications(PackageManager.GET_META_DATA)

            val result = Arguments.createArray()

            packages.forEach { app ->
                // Filter out system apps and our own app
                if (app.flags and ApplicationInfo.FLAG_SYSTEM == 0 &&
                    app.packageName != reactApplicationContext.packageName) {

                    val appMap = Arguments.createMap().apply {
                        putString("bundleId", app.packageName)
                        putString("name", pm.getApplicationLabel(app).toString())
                        // Icon would require more processing, omitted for now
                        putString("icon", "")
                    }
                    result.pushMap(appMap)
                }
            }

            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("GET_INSTALLED_APPS_ERROR", e.message, e)
        }
    }

    // MARK: - Events

    fun sendAppBlockedEvent(packageName: String) {
        val params = Arguments.createMap().apply {
            putString("packageName", packageName)
            putDouble("timestamp", System.currentTimeMillis().toDouble())
        }

        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("onAppBlocked", params)
    }
}
