async function hasPermission({ action }: { action?: string }) {
  // TODO: Implement your own permission logic
  if (process.env.LOGGED_AS_ADMIN !== "true") {
    throw new Error("DEMO CANNOT BE UPDATED");
  }
}

export default {
  hasPermission,
};
