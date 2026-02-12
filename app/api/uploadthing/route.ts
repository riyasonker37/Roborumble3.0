
import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";
 
// Export routes for Next App Router - TEMPORARY HARDCODED TOKEN for hosting
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    token: 'eyJhcGlLZXkiOiJza19saXZlX2YwZWEzNDM3M2EzNTliZjMxYzhmN2NkNzViMGUxYTYxNDM2M2FiZjY4ZjUxOWVjZWM3ODhkZjYxMGRlNTMyNjAiLCJhcHBJZCI6ImRrdHR3NTJrZzAiLCJyZWdpb25zIjpbInNlYTEiXX0=',
  },
});
