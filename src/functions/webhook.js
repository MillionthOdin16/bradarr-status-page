import config from '../../config.yaml'

import {
  notifySlack,
  notifyTelegram,
  getCheckLocation,
  getKVMonitors,
  setKVMonitors,
  notifyDiscord,
} from './helpers'

function getDate() {
  return new Date().toISOString().split('T')[0]
}

export async function processWebhook(event) {
  // Get Worker PoP and save it to monitorsStateMetadata
  const checkDay = getDate()

  // Get monitors state from KV
  let monitorsState = await getKVMonitors()

  // Create empty state objects if not exists in KV storage yet
  if (!monitorsState) {
    monitorsState = { lastUpdate: {}, monitors: {} }
  }

  // Reset default all monitors state to true
  //monitorsState.lastUpdate.allOperational = true

  // Get the monitor that corresponds to the webhook
  const json = event.request.json()
  console.log(json)
  console.log(json.text)
  console.log(json.data)
  // Ignore webhook test notification upon creation
  if ((json.text || "").includes("Hello World!")) return

  let incomingMonitorID = json.data?.name || "Unknown"
  let incomingMonitorDetails = {
    status: json.data?.status || "Unknown",
    time: json.data?.time || "Unknown",
    failureReason: json.data?.reason || "Unknown"
  }

  console.log(`Received ${incomingMonitorID} status update ...`)

  for (const monitor of config.monitors) {
    // Create default monitor state if does not exist yet
    if (typeof monitorsState.monitors[monitor.id] === 'undefined') {
      monitorsState.monitors[monitor.id] = {
        firstCheck: checkDay,
        lastCheck: {},
        checks: {},
      }
    }

    if (monitor.id !== incomingMonitorID) {
      continue;
    }

    // Determine whether operational and status changed
    const monitorOperational = incomingMonitorDetails.status === "Healthy"
    const monitorStatusChanged = true

    // Save monitor's last check response status
    monitorsState.monitors[monitor.id].lastCheck = {
      status: incomingMonitorDetails.status,
      statusText: incomingMonitorDetails.failureReason,
      operational: monitorOperational,
    }

    // Send Slack message on monitor change
    if (
        monitorStatusChanged &&
        typeof SECRET_SLACK_WEBHOOK_URL !== 'undefined' &&
        SECRET_SLACK_WEBHOOK_URL !== 'default-gh-action-secret'
    ) {
      event.waitUntil(notifySlack(monitor, monitorOperational))
    }

    // Send Telegram message on monitor change
    if (
        monitorStatusChanged &&
        typeof SECRET_TELEGRAM_API_TOKEN !== 'undefined' &&
        SECRET_TELEGRAM_API_TOKEN !== 'default-gh-action-secret' &&
        typeof SECRET_TELEGRAM_CHAT_ID !== 'undefined' &&
        SECRET_TELEGRAM_CHAT_ID !== 'default-gh-action-secret'
    ) {
      event.waitUntil(notifyTelegram(monitor, monitorOperational))
    }

    // Send Discord message on monitor change
    if (
        monitorStatusChanged &&
        typeof SECRET_DISCORD_WEBHOOK_URL !== 'undefined' &&
        SECRET_DISCORD_WEBHOOK_URL !== 'default-gh-action-secret'
    ) {
      event.waitUntil(notifyDiscord(monitor, monitorOperational))
    }

if (!monitorOperational) {
      // Save allOperational to false
      monitorsState.lastUpdate.allOperational = false
    }
  }

  // Save monitorsState to KV storage
  await setKVMonitors(monitorsState)

  return new Response('OK')
}
