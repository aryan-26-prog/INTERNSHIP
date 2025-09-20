import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import UserCard from '../components/UserCard';
import './Home.css';

export default function Home() {
  const [users, setUsers] = useState([]);

  return (
    <div className="home">
      <h1>GitHub User Finder Pro 🔍</h1>
      <SearchBar setUsers={setUsers} />
      <div className="user-grid">
        {users.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}
import { motion } from 'framer-motion';

<motion.h1
  initial={{ opacity: 0, y: -30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7 }}
>
  GitHub User Finder Pro 🔍
</motion.h1>
