#!/usr/bin/env node

/**
 * ChromaDB Skill - Direct interface to ChromaDB
 * Provides memory storage and retrieval for the memory_manager agent
 * Supports multiple collections for different services/contexts
 */

import { ChromaClient } from "chromadb";
import { DefaultEmbeddingFunction } from "@chroma-core/default-embed";

const CHROMA_URL = process.env.CHROMA_URL || "http://localhost:8000";
const DEFAULT_COLLECTION = "repo_memory";

const client = new ChromaClient({
  host: "localhost",
  port: 8000,
});

const embedder = new DefaultEmbeddingFunction();

async function getOrCreateCollection(collectionName = DEFAULT_COLLECTION) {
  try {
    return await client.getOrCreateCollection({
      name: collectionName,
      metadata: { description: `Memory for ${collectionName}` },
      embeddingFunction: embedder,
    });
  } catch (error) {
    throw new Error(
      `Failed to get/create collection '${collectionName}': ${error.message}`,
    );
  }
}

async function listCollections() {
  try {
    const collections = await client.listCollections();
    return collections.map((c) => ({ name: c.name, metadata: c.metadata }));
  } catch (error) {
    throw new Error(`Failed to list collections: ${error.message}`);
  }
}

async function deleteCollection(collectionName) {
  try {
    await client.deleteCollection({ name: collectionName });
    return { success: true, collection: collectionName };
  } catch (error) {
    throw new Error(
      `Failed to delete collection '${collectionName}': ${error.message}`,
    );
  }
}

async function addMemory(collectionName, id, content, metadata = {}) {
  const collection = await getOrCreateCollection(collectionName);

  await collection.add({
    ids: [id],
    documents: [content],
    metadatas: [metadata],
  });

  return { success: true, collection: collectionName, id };
}

async function searchMemory(
  collectionName,
  query,
  nResults = 5,
  filter = null,
) {
  const collection = await getOrCreateCollection(collectionName);

  const queryParams = {
    queryTexts: [query],
    nResults: nResults,
  };

  if (filter) {
    queryParams.where = filter;
  }

  const results = await collection.query(queryParams);

  return results;
}

async function updateMemory(collectionName, id, content, metadata = {}) {
  const collection = await getOrCreateCollection(collectionName);

  await collection.update({
    ids: [id],
    documents: [content],
    metadatas: [metadata],
  });

  return { success: true, collection: collectionName, id };
}

async function deleteMemory(collectionName, id) {
  const collection = await getOrCreateCollection(collectionName);

  await collection.delete({
    ids: [id],
  });

  return { success: true, collection: collectionName, id };
}

async function listMemories(collectionName, limit = 100) {
  const collection = await getOrCreateCollection(collectionName);

  const results = await collection.get({
    limit: limit,
  });

  return results;
}

async function getStats(collectionName) {
  const collection = await getOrCreateCollection(collectionName);
  const count = await collection.count();

  return {
    name: collection.name,
    count: count,
    metadata: collection.metadata,
  };
}

// CLI Interface
async function main() {
  const [command, ...args] = process.argv.slice(2);

  try {
    switch (command) {
      case "collections":
        const collections = await listCollections();
        console.log(JSON.stringify(collections, null, 2));
        break;

      case "delete-collection":
        const [collName] = args;
        if (!collName) throw new Error("Collection name required");
        const deleteCollResult = await deleteCollection(collName);
        console.log(JSON.stringify(deleteCollResult));
        break;

      case "add":
        const [collection, id, content, ...metaParts] = args;
        if (!collection || !id || !content) {
          throw new Error(
            "Usage: add <collection> <id> <content> [metadata_json]",
          );
        }
        const metadata =
          metaParts.length > 0 ? JSON.parse(metaParts.join(" ")) : {};
        const addResult = await addMemory(collection, id, content, metadata);
        console.log(JSON.stringify(addResult));
        break;

      case "search":
        const [searchColl, query, nResults = "5", filterJson] = args;
        if (!searchColl || !query) {
          throw new Error(
            "Usage: search <collection> <query> [n_results] [filter_json]",
          );
        }
        const filter = filterJson ? JSON.parse(filterJson) : null;
        const results = await searchMemory(
          searchColl,
          query,
          parseInt(nResults),
          filter,
        );
        console.log(JSON.stringify(results, null, 2));
        break;

      case "update":
        const [updateColl, updateId, updateContent, ...updateMetaParts] = args;
        if (!updateColl || !updateId || !updateContent) {
          throw new Error(
            "Usage: update <collection> <id> <content> [metadata_json]",
          );
        }
        const updateMetadata =
          updateMetaParts.length > 0
            ? JSON.parse(updateMetaParts.join(" "))
            : {};
        const updateResult = await updateMemory(
          updateColl,
          updateId,
          updateContent,
          updateMetadata,
        );
        console.log(JSON.stringify(updateResult));
        break;

      case "delete":
        const [deleteColl, deleteId] = args;
        if (!deleteColl || !deleteId) {
          throw new Error("Usage: delete <collection> <id>");
        }
        const deleteResult = await deleteMemory(deleteColl, deleteId);
        console.log(JSON.stringify(deleteResult));
        break;

      case "list":
        const [listColl, listLimit = "100"] = args;
        if (!listColl) {
          throw new Error("Usage: list <collection> [limit]");
        }
        const memories = await listMemories(listColl, parseInt(listLimit));
        console.log(JSON.stringify(memories, null, 2));
        break;

      case "stats":
        const [statsColl] = args;
        if (!statsColl) {
          throw new Error("Usage: stats <collection>");
        }
        const stats = await getStats(statsColl);
        console.log(JSON.stringify(stats, null, 2));
        break;

      default:
        console.error(`Unknown command: ${command}`);
        console.error("Available commands:");
        console.error("  collections - List all collections");
        console.error("  delete-collection <name> - Delete a collection");
        console.error("  add <collection> <id> <content> [metadata_json]");
        console.error(
          "  search <collection> <query> [n_results] [filter_json]",
        );
        console.error("  update <collection> <id> <content> [metadata_json]");
        console.error("  delete <collection> <id>");
        console.error("  list <collection> [limit]");
        console.error("  stats <collection>");
        process.exit(1);
    }
  } catch (error) {
    console.error(JSON.stringify({ error: error.message }));
    process.exit(1);
  }
}

main();
