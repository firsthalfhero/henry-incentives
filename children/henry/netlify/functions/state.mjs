import { getStore } from "@netlify/blobs";
import activitiesData from "../../activities.json" with { type: "json" };
import { makeHandler } from "../../../../core/lib/state-core.mjs";

export default makeHandler({ activitiesData, storeName: "henry-chart", getStore });
export const config = { path: "/api/state" };
