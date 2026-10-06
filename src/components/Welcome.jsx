import { useStore } from '@nanostores/react';
import { $userStore } from "@clerk/astro/client";
import '../styles/welcome.scss';

export default function UserWelcome() {
  const user = useStore($userStore);
  
  if (user === undefined) {
    return (
      <strong>
        <span className="loading user-data">Booting up your user data</span>
      </strong>
    );
  }

  if (user === null) {
    return (
      <strong>
        <span className="user-data">Please sign in to continue.</span>;
      </strong>
    );
  }
  
  return (
    <div class="welcome container">
      <img class="welcome avatar" src={user.imageUrl} alt={user.username} />
      <span class="welcome declaration">
        <div class="welcome stats">
          <span class="welcome title">
            <strong>Welcome, { user.username }</strong>
          </span>
          <span class="welcome-stats posts"># posts: [# posts]</span>
          <span class="welcome-stats posts">Joined @ [Date]</span>
        </div>
      </span>
    </div>
  );
}