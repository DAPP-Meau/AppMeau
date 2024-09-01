import { PushMessage } from "@/models/Message"

export default function sendPushNotification(message: PushMessage) {
  console.log("sending push notification to: " + message.to)
  fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  }).then(
    (response) => {
      // Fetch acception
      console.log(
        "Push notification response " +
          response.status +
          ": " +
          JSON.stringify(response),
      )
    },
    (reason) => {
      // Fetch rejection
      console.error(
        "Push notification rejection: " +
          reason.status +
          ": " +
          JSON.stringify(reason),
      )
    },
  )
}
