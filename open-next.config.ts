import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Every page that changes is rendered on request, so no incremental cache bucket is needed.
export default defineCloudflareConfig({});
