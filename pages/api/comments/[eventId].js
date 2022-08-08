// Path - /api/comments/some-event-id
const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("../../../helpers/config");
const dbContext = require("../../../helpers/databaseContext");

async function handler(req, res) {
  const eventId = req.query.eventId;

  // Db config
  const { endpoint, key, databaseId, commentsContainerId } = config;
  const client = new CosmosClient({ endpoint, key });
  const database = client.database(databaseId);
  const container = database.container(commentsContainerId);

  try {
    // Refer https://docs.microsoft.com/en-us/azure/cosmos-db/sql/sql-api-nodejs-get-started?tabs=windows
    // Make sure database is already setup, else create it
    await dbContext.create(client, databaseId, commentsContainerId);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Connecting to db failed!" });
    return;
  }

  if (req.method === "POST") {
    const { email, name, text } = req.body;

    // server side validation
    if (
      !email.includes("@") ||
      !name ||
      name.trim() === "" ||
      !text ||
      text.trim() === ""
    ) {
      res.status(422).json({ message: "Invalid input." });
      return;
    }
    const newComment = {
      email,
      name,
      text,
      eventId,
    };
    // Update eventId
    newComment.eventId = eventId;
    console.log(newComment);

    try {
      // Insert an item
      const { resource: createdItem } = await container.items.create(
        newComment
      );
      console.log(
        `Created new item: ${createdItem.email} - ${createdItem.name} - ${createdItem.text} - ${createdItem.eventId}`
      );
      // To understand this
      newComment.id = createdItem.id;
      res.status(201).json({ message: "Added comment.", comment: newComment });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Inserting comment data failed!" });
      return;
    }
  }

  if (req.method === "GET") {
    // Get data from db
    console.log(`Querying container: Items`);
    //SELECT * from c where c.eventId = "e2";
    const querySpec = {
      query: `SELECT * from c where c.eventId = "${eventId}"`,
    };

    try {
      // read all items in the Items container
      const { resources: items } = await container.items
        .query(querySpec)
        .fetchAll();
      items.forEach((item) => {
        console.log(
          `Got item : ${item.email} - ${item.name} - ${item.text} - ${item.eventId}`
        );
      });
      res.status(200).json({ comments: items });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Fetching comment data failed!" });
      return;
    }
  }
}

export default handler;
