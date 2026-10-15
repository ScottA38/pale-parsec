import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { $userStore } from "@clerk/astro/client";
import '../styles/welcome.scss';

export default function UserWelcome() {
  const user = useStore($userStore);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted || user === undefined) {
    return (
      <div className="welcome container" aria-busy="true" aria-label="Loading user data">
        <div className="welcome avatar skeleton" aria-hidden="true" />
        <div className="welcome stats">
          <span className="welcome title">
            <span className="skeleton skeleton-text" aria-hidden="true" />
          </span>
          <span className="welcome-stats posts">
            <span className="skeleton skeleton-text" aria-hidden="true" />
          </span>
          <span className="welcome-stats posts">
            <span className="skeleton skeleton-text" aria-hidden="true" />
          </span>
        </div>
      </div>
    );
  }

  if (user === null) {
    return (
      <div className="welcome container">
        <span className="user-data">Please sign in to continue.</span>
      </div>
    );
  }

  return (
    <div className="welcome container">
      <img className="welcome avatar" src={ user.imageUrl } alt={ user.username } />
      <div className="welcome stats">
        <span className="welcome title">
          <strong>Welcome, { user.username }</strong>
        </span>
        <span className="welcome-stats posts"># posts: # posts</span>
        <span className="welcome-stats posts">Joined @ Date</span>
      </div>
    </div>
  );
}