// Db config
const config = {
  endpoint: "YOUR AZURE ENDPOINT",
  key: "YOUR AZURE KEY",
  databaseId: "recaidev",
  newsletterContainerId: "newsletter",
  commentsContainerId: "comments",
  partitionKey: { kind: "Hash", paths: ["/category"] },
};

module.exports = config;
