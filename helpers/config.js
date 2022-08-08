// Db config
const config = {
  endpoint: "https://recaidev-cosmosdb.documents.azure.com:443/",
  key: "ozvG0q3a86quQGqQqhIqEhkLLn8hlcM4S37vdGxG8eu1u0mCGJFhSY04kEA5hQIfJwWOegRLwBM7wYnRNetfgA==",
  databaseId: "recaidev",
  newsletterContainerId: "newsletter",
  commentsContainerId: "comments",
  partitionKey: { kind: "Hash", paths: ["/category"] },
};

module.exports = config;
