const express = require("express");

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "whatsapp-webhook-api",
  });
});

// Meta WhatsApp webhook verification
app.get("/webhook/whatsapp", (req, res) => {
  const {
    "hub.mode": mode,
    "hub.challenge": challenge,
    "hub.verify_token": token,
  } = req.query;

  if (mode === "subscribe" && token === verifyToken) {
    console.log("WEBHOOK VERIFIED");
    return res.status(200).send(challenge);
  }

  return res.status(403).send("Forbidden");
});

// Meta WhatsApp webhook events
app.post("/webhook/whatsapp", (req, res) => {
  const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);

  console.log(`\n\nWebhook received ${timestamp}\n`);
  console.log(JSON.stringify(req.body, null, 2));

  return res.status(200).send("EVENT_RECEIVED");
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Listening on port ${port}`);
});
