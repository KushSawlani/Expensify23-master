const { Expo } = require("expo-server-sdk");

exports.sendPushNotification = async (targetExpoPushToken, message) => {
  const expo = new Expo();
  const chunks = expo.chunkPushNotifications([
    { to: targetExpoPushToken, sound: "default", body: message },
  ]);

  const sendChunks = async () => {
    chunks.forEach(async (chunk) => {
      try {
        await expo.sendPushNotificationsAsync(chunk);
      } catch (error) {
        console.log("Error sending chunk", error);
      }
    });
  };

  await sendChunks();
};
