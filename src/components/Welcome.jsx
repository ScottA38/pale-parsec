import { $userStore } from "@clerk/astro/client";
import { useSyncExternalStore } from "react";

export default function UserWelcome() {
  const user = useSyncExternalStore($userStore.listen, $userStore.get, $userStore.get);
  return <div class="welcome">
    <h1>Welcome, { user?.firstName }</h1>
  </div>
}