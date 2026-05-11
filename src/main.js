import { router } from "./router.js";
import { setupLinkInterception } from "./navigation.js";

setupLinkInterception();

router()