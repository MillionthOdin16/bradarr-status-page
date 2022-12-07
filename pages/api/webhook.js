import { processWebhook } from '../../src/functions/webhook'

export default async (event) => {
  // used only for local debugging
  return processWebhook(event)
}
