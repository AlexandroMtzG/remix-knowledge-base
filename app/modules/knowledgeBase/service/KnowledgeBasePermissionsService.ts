import { json } from "@remix-run/node";

async function hasPermission({ action }: { action?: string }) {
  // TODO: Implement your own permission logic
  if (process.env.LOGGED_AS_ADMIN !== "true") {
    // throw new Error("DEMO CANNOT BE UPDATED");
    throw json({ message: "DEMO CANNOT BE UPDATED" }, { status: 400 });
  }
}

export default {
  hasPermission,
};
