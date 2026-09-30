import { useStore } from '@nanostores/react';
import { $userStore } from "@clerk/astro/client";
import '../styles/text.scss';

export default function UserWelcome({containerStyle: string = ""}) {
  const user = useStore($userStore);
  console.log(JSON.stringify(user));
  
  if (user === undefined) {
    return <span className="loading user-data">Booting up your user data</span>;
  }

  if (user === null) {
    return <span className="user-data">Please sign in to continue.</span>;
  }
  
  return <div class="welcome" style={containerStyle}>
    <span>Welcome, { user.username }</span>
  </div>
}