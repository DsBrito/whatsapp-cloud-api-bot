import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

//const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT } = process.env;
const WEBHOOK_VERIFY_TOKEN = "wa - webhook";

const GRAPH_API_TOKEN =
  "EAAQZAWjQgrU4BOxsaZB1HOsfp9KZCcOaMNKtdCssFami3cO7Foka7WUAKI87R4DnOcOEm7ZCSGZCAq5aZAhD6shYj6HpOHFQovErQFSjss4UyAaPwfUSq0Oc8ZCVhHEAZC9yUJX2UQkoScX8ZBCQFS6mSQBowyBzq4cUuSBthf8z3UNPsjO8PfQSb6YnwEpWXEZAXVQHgYi1hc59ZBv8VxdHrcZD";

const API_VERSION = "v18.0";
const BIZ_PHONE_NUMBER_ID = "298103803375174";
const PORT = "3000";
app.post("/webhook", (req, res) => {
  //defaultMessage(req)
  //showMovieIntegrations(req, res);
  testButtons(req);
  // testPayloads(req);
});

// accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // check the mode and token sent are correct
  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    // respond with 200 OK and challenge token from the request
    res.status(200).send(challenge);
    console.log("Webhook verified successfully!");
  } else {
    // respond with '403 Forbidden' if verify tokens do not match
    res.sendStatus(403);
  }
});

app.get("/", (req, res) => {
  res.send(`<pre>Nothing to see here.
Checkout README.md to start.</pre>`);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
  console.log(WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT);
});

//MY FUNCTIONS

//functions
function defaultMessage(req) {
  // log incoming messages
  console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));

  // check if the webhook request contains a message
  // details on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];

  // check if the incoming message contains text
  if (message?.type === "text") {
    // extract the business number to send the reply from it
    const business_phone_number_id =
      req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

    // send a reply message as per the docs here https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
    axios({
      method: "POST",
      url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
      headers: {
        Authorization: `Bearer ${GRAPH_API_TOKEN}`,
      },
      data: {
        messaging_product: "whatsapp",
        to: message.from,
        text: { body: "Echo: " + message.text.body },
        context: {
          message_id: message.id, // shows the message as a reply to the original user message
        },
      },
    });

    // mark incoming message as read
    axios({
      method: "POST",
      url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
      headers: {
        Authorization: `Bearer ${GRAPH_API_TOKEN}`,
      },
      data: {
        messaging_product: "whatsapp",
        status: "read",
        message_id: message.id,
      },
    });
  }
}

async function testButtons(req) {
  // log incoming messages
  console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));

  // check if the webhook request contains a message
  // details on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  let message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];
  const business_phone_number_id =
    req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;
  const from = req.body.entry?.[0].changes?.[0].value?.messages?.[0].from;
  // check if the incoming message contains text
  if (message?.type === "text") {
    // extract the business number to send the reply from it
    const business_phone_number_id =
      req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;
    const from = req.body.entry?.[0].changes?.[0].value?.messages?.[0].from;

    // send a reply message as per the docs here https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
      headers: {
        Authorization: `Bearer ${GRAPH_API_TOKEN}`,
      },
      data: {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: "5527988465011",
        type: "template",
        template: {
          name: "rtk_app",
          language: {
            code: "pt_BR",
          },
        },
        type: "interactive",
        interactive: {
          type: "button",
          body: {
            text: "oi",
          },
          action: {
            buttons: [
              {
                type: "reply",
                reply: {
                  id: "UNIQUE_BUTTON_ID_1",
                  title: "BUTTON_TITLE_1",
                },
              },
              {
                type: "reply",
                reply: {
                  id: "UNIQUE_BUTTON_ID_2",
                  title: "BUTTON_TITLE_2",
                },
              },
            ],
          },
        },
      },
    });

    // mark incoming message as read
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
      headers: {
        Authorization: `Bearer ${GRAPH_API_TOKEN}`,
      },
      data: {
        messaging_product: "whatsapp",
        status: "read",
        message_id: message.id,
      },
    });
  }
  ///

  const Message = req.body.entry?.[0].changes?.[0].value?.messages?.[0];
  if (Message != null && Message.type === "interactive") {
    if (Message.interactive.button_reply.title === "BUTTON_TITLE_1") {
      console.log("AAAAASAAAAAAAAAAAAAAAAAAAAAAAAAAH");
      await axios({
        method: "POST",
        url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
        headers: {
          Authorization: `Bearer ${GRAPH_API_TOKEN}`,
        },
        data: {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: "5527988465011",
          type: "template",
          template: {
            name: "rtk_app",
            language: {
              code: "pt_BR",
            },
          },
        },
      });
    } else if (Message.interactive.button_reply.title === "BUTTON_TITLE_2") {
      console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
      axios({
        method: "POST",
        url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
        headers: {
          Authorization: `Bearer ${GRAPH_API_TOKEN}`,
        },
        data: {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: "5527988465011",
          type: "template",
          template: {
            name: "rttk_app_select",
            language: {
              code: "pt_BR",
            },
          },
        },
      });
    }
  }
}

function showMovieIntegrations(req, res) {
  if (isMenssageValid) {
    var data = getTemplatedMessageInput(
      req.body.entry?.[0].changes?.[0].value?.messages?.[0].from
    );

    sendMensage(data)
      .then((response) => {
        console.log("mensage sent");
      })
      .catch((error) => {
        console.log(error);
        res.sendStatus(404);
      });

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
}

function sendMensage(data) {
  let config = {
    method: "POST",
    url: `https://graph.facebook.com/${process.env.API_VERSION}/${process.env.BIZ_PHONE_NUMBER_ID}/messages`,
    headers: {
      Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    data: data,
  };

  return axios(config);
}

function isMenssageValid(req) {
  let body = req.body;
  return (
    body.object &&
    body.entry &&
    body.entry[0].changes &&
    body.entry[0].changes[0].value.messages &&
    body.entry[0].changes[0].value.messages[0]
  );
}

function getTemplatedMessageInput(recipient) {
  return JSON.stringify({
    messaging_product: "whatsapp",
    to: recipient,
    type: {
      template: "rtk_app",
      language: {
        code: "pt_BR",
      },
    },
  });
}

function testPayloads(req) {
  // log incoming messages
  // console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));

  let message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];
  const business_phone_number_id =
    req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;
  const from = req.body.entry?.[0].changes?.[0].value?.messages?.[0].from;

  if (message?.type === "text") {
    const business_phone_number_id =
      req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;
    const from = req.body.entry?.[0].changes?.[0].value?.messages?.[0].from;

    axios({
      method: "POST",
      url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
      headers: {
        Authorization: `Bearer ${GRAPH_API_TOKEN}`,
      },
      data: {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: "5527988465011",
        type: "template",
        template: {
          name: "rtk_app",
          language: {
            code: "pt_BR",
          },
        },
      },
    });
    const Message = req.body.entry?.[0].changes[0].value.messages;
    console.log(JSON.stringify(req.body, null, 2));
    if (Message != null && Message.type === "button") {
      if (Message.button.payload === "Conhecer") {
        console.log(
          "AAAAASAAAAAAAAASSSSSSSSSSSSSSSSSSSSSSSSSSSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH"
        );
      }
    }
  }
}
