import { Collection, MongoClient } from "mongodb";

let scheduledLivestreams: Collection;

export default class scheduledLivestreamsDAO {
  static async injectDB(conn: MongoClient) {
    if (scheduledLivestreams) return;

    try {
      scheduledLivestreams = await conn
        .db(process.env.DATABASE_NAMESPACE)
        .collection("scheduledLivestreams");
    } catch (e) {
      console.error(
        `Unable to establish collection handles in scheduledLivestreamsDAO: ${e}`
      );
    }
  }

  /**
   * Finds the market price stored in the 'marketPrice' collection
   */
  static async getScheduledLivestreams() {
    try {
      const results = await scheduledLivestreams.find().toArray();
      console.log("Current schedule (from MongoDB):", results);
      return results;
    } catch (e) {
      console.error(`Unable to run aggregation: ${e}`);
      throw e;
    }
  }

  static async addScheduledLivestream(
    author: string,
    url: string,
    unixTimestamp: number
  ) {
    // if (author == null || url == null || unixTimestamp == null) return null;

    try {
      const _filter = {
        url: url,
      };

      const _replacement = {
        author: author,
        url: url,
        unixTimestamp: unixTimestamp,
        date: new Date(unixTimestamp * 1000),
      };

      const result = await scheduledLivestreams.replaceOne(
        _filter,
        _replacement,
        {
          upsert: true,
        }
      );

      console.log("Livestream schedule result:", result);

      return result;
    } catch (e) {
      console.error(e);
    }
  }
}
