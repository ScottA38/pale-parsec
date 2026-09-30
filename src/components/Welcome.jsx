import { useStore } from '@nanostores/react';
import { $userStore, $isLoadedStore } from "@clerk/astro/client";

export default function UserWelcome() {
  const user = useStore($userStore);
  // const isLoaded = useStore($isLoadedStore);
  console.log(JSON.stringify(user));
  
  if (user === undefined) {
    return <span className="loading user-data">Booting up your user data</span>;
  }

  if (user === null) {
    return <span className="user-data">Please sign in to continue.</span>;
  }
  
  return <div class="welcome">
    <h1>Welcome, { user.username }</h1>
  </div>
}