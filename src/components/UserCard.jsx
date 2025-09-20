import './UserCard.css';

export default function UserCard({ user }) {
  return (
    <div className="user-card">
      <img src={user.avatar_url} alt="avatar" />
      <h4>{user.login}</h4>
      <a href={user.html_url} target="_blank">View Profile</a>
    </div>
  );
}
