import { EventStoreDBClient, FORWARDS, START } from "@eventstore/db-client";
import { eventstoreUrl } from "./connection";

export const client = EventStoreDBClient.connectionString(eventstoreUrl);
export async function connectToEventstoreDB() {

    const test = await client.readAll({
      direction: FORWARDS,
      fromPosition: START,
      maxCount: 1
    });
}