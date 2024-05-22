import { Link } from "react-router-dom";

export default function UserLink({ user }) {
  return <Link className="user-link" to={`/users/${user.id}`}>{user.username}</Link>;
}
