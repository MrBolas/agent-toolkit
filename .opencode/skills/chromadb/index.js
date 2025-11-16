#!/usr/bin/env node

/**
 * ChromaDB Skill - Direct interface to ChromaDB
 * Provides memory storage and retrieval for the memory_manager agent
 * Supports multiple collections for different services/contexts
 */

import { log, logSuccess, logError, logInfo } from "./logger.js";

const CHROMA_URL = process.env.CHROMA_URL || "http://localhost:8000";
const API_VERSION = "v1";
const DEFAULT_COLLECTION = "repo_memory";

logInfo("ChromaDB server skill initialized", { url: CHROMA_URL });



async function listCollections() {
  try {
    const response = await fetch(`${CHROMA_URL}/api/v1/collections`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const collections = await response.json();
    return collections.map((c) => ({ name: c.name, metadata: c.metadata }));
  } catch (error) {
    throw new Error(`Failed to list collections: ${error.message}`);
  }
}

async function deleteCollection(collectionName) {
  try {
    const response = await fetch(`${CHROMA_URL}/api/v1/collections/${collectionName}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return { success: true, collection: collectionName };
  } catch (error) {
    throw new Error(
      `Failed to delete collection '${collectionName}': ${error.message}`,
    );
  }
}

async function addMemory(collectionName, id, content, metadata = {}) {
  try {
    // Ensure collection exists
    await fetch(`${CHROMA_URL}/api/v1/collections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: collectionName }),
    });

    const response = await fetch(`${CHROMA_URL}/api/v1/collections/${collectionName}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ids: [id],
        documents: [content],
        metadatas: [metadata],
      }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return { success: true, collection: collectionName, id };
  } catch (error) {
    throw new Error(`Failed to add memory: ${error.message}`);
  }
}

async function searchMemory(
  collectionName,
  query,
  nResults = 5,
  filter = null,
) {
  try {
    const body = {
      query_texts: [query],
      n_results: nResults,
    };
    if (filter) body.where = filter;

    const response = await fetch(`${CHROMA_URL}/api/v1/collections/${collectionName}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    throw new Error(`Failed to search memory: ${error.message}`);
  }
}

async function updateMemory(collectionName, id, content, metadata = {}) {
  try {
    const response = await fetch(`${CHROMA_URL}/api/v1/collections/${collectionName}/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ids: [id],
        documents: [content],
        metadatas: [metadata],
      }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return { success: true, collection: collectionName, id };
  } catch (error) {
    throw new Error(`Failed to update memory: ${error.message}`);
  }
}

async function deleteMemory(collectionName, id) {
  try {
    const response = await fetch(`${CHROMA_URL}/api/v1/collections/${collectionName}/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ids: [id],
      }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return { success: true, collection: collectionName, id };
  } catch (error) {
    throw new Error(`Failed to delete memory: ${error.message}`);
  }
}

async function listMemories(collectionName, limit = 100) {
  try {
    const response = await fetch(`${CHROMA_URL}/api/v1/collections/${collectionName}/get?limit=${limit}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    throw new Error(`Failed to list memories: ${error.message}`);
  }
}

async function getStats(collectionName) {
  try {
    const countResponse = await fetch(`${CHROMA_URL}/api/v1/collections/${collectionName}/count`);
    if (!countResponse.ok) throw new Error(`HTTP ${countResponse.status}`);
    const count = await countResponse.json();

    const collResponse = await fetch(`${CHROMA_URL}/api/v1/collections/${collectionName}`);
    if (!collResponse.ok) throw new Error(`HTTP ${collResponse.status}`);
    const collection = await collResponse.json();

    return {
      name: collection.name,
      count: count,
      metadata: collection.metadata,
    };
  } catch (error) {
    throw new Error(`Failed to get stats: ${error.message}`);
  }
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
        logInfo("Adding memory", { collection, id });
        const addResult = await addMemory(collection, id, content, metadata);
        logSuccess("Memory added", { collection, id });
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
        logInfo("Searching memory", {
          collection: searchColl,
          query,
          nResults,
        });
        const results = await searchMemory(
          searchColl,
          query,
          parseInt(nResults),
          filter,
        );
        logSuccess("Search completed", {
          collection: searchColl,
          resultCount: results.ids[0]?.length || 0,
        });
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
    logError(`Command '${command}' execution`, error, { args });
    console.error(JSON.stringify({ error: error.message }));
    process.exit(1);
  }
}

main();
