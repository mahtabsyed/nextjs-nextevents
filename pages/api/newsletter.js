const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("../../helpers/config");
const dbContext = require("../../helpers/databaseContext");

async function handler(req, res) {
  if (req.method === "POST") {
    const userEmail = req.body.email;

    // Db config
    const { endpoint, key, databaseId, newsletterContainerId } = config;
    const client = new CosmosClient({ endpoint, key });
    const database = client.database(databaseId);
    const container = database.container(newsletterContainerId);

    if (!userEmail || !userEmail.includes("@")) {
      res.status(422).json({ message: "Invalid email address." });
      return;
    }
    try {
      // Refer https://docs.microsoft.com/en-us/azure/cosmos-db/sql/sql-api-nodejs-get-started?tabs=windows
      // Make sure database is already setup, else create it
      await dbContext.create(client, databaseId, newsletterContainerId);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Connecting to db failed!" });
      return;
    }

    try {
      // Insert an item
      const { resource: createdItem } = await container.items.create({
        email: userEmail,
      });
      console.log(`Created new item: ${createdItem.id} - ${createdItem.email}`);
      res.status(201).json({ message: "Signed up!" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Inserting email data failed!" });
      return;
    }
  }
}

export default handler;
