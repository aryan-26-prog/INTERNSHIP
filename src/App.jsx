import { useState } from 'react';
import './App.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSun, FaMoon, FaGithub, FaSearch, FaUser, FaUsers, FaCode, FaLink } from 'react-icons/fa';
import { RiGitRepositoryFill } from 'react-icons/ri';
import { BsStarFill } from 'react-icons/bs';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren"
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const cardVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  },
  exit: { scale: 0.9, opacity: 0 }
};

function App() {
  const [dark, setDark] = useState(true);
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleTheme = () => {
    setDark(!dark);
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      document.body.style.overflow = 'auto';
    }, 1000);
  };

  const handleSearch = async () => {
    if (!username) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`https://api.github.com/users/${username}`);
      const data = await res.json();
      
      if (data.message === "Not Found") {
        setError("User not found 😢");
        setUserData(null);
      } else {
        setUserData(data);
      }
    } catch (error) {
      console.error("Error fetching GitHub user:", error);
      setError("Failed to fetch user data");
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={`app ${dark ? 'dark' : 'light'}`}>
      {/* Advanced background animation */}
      <div className="gradient-bg">
        <motion.div 
          className="gradient-1"
          animate={{
            x: [0, 50, 0, -30, 0],
            y: [0, 30, 50, 30, 0],
            rotate: [0, 5, -5, 5, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="gradient-2"
          animate={{
            x: [0, -40, 0, 30, 0],
            y: [0, -20, -40, -20, 0],
            rotate: [0, -5, 5, -5, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
        <motion.div 
          className="gradient-3"
          animate={{
            x: [0, 30, -20, 20, 0],
            y: [0, -30, 20, -20, 0],
            rotate: [0, 3, -3, 3, 0]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6
          }}
        />
      </div>
      
      {/* Floating particles with physics simulation */}
      <div className="particles">
        {Array(30).fill(0).map((_, i) => (
          <motion.div 
            key={i}
            className="particle"
            initial={{
              x: Math.random() * 100 + 'vw',
              y: Math.random() * 100 + 'vh',
              opacity: 0
            }}
            animate={{
              y: '-100vh',
              opacity: [0, 0.8, 0],
              x: `${Math.random() * 20 - 10 + parseInt(i * 3)}vw`
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
            style={{
              width: `${Math.random() * 5 + 2}px`,
              height: `${Math.random() * 5 + 2}px`,
              background: `hsl(${Math.random() * 60 + 200}, 80%, 70%)`
            }}
          />
        ))}
      </div>

      <motion.div 
        className="container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="header" variants={itemVariants}>
          <motion.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <FaGithub className="github-icon" /> GitHub Profile Finder
          </motion.h1>
          <motion.button 
            className="theme-btn" 
            onClick={toggleTheme}
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            {dark ? <FaSun /> : <FaMoon />}
          </motion.button>
        </motion.div>

        <motion.div
          className="search-box"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="search-input">
            <FaSearch className="search-icon" />
            <motion.input 
              type="text" 
              placeholder="Enter GitHub username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              whileFocus={{ 
                boxShadow: "0 0 0 3px rgba(129, 140, 248, 0.5)",
                borderColor: "#818cf8"
              }}
            />
          </div>
          <motion.button 
            onClick={handleSearch}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 5px 15px rgba(129, 140, 248, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            Search
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {loading && (
            <motion.div 
              className="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="spinner"
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <motion.p
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              >
                Searching...
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.p 
              className="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                boxShadow: ["0 0 0 rgba(239, 68, 68, 0)", 
                           "0 0 10px rgba(239, 68, 68, 0.3)", 
                           "0 0 0 rgba(239, 68, 68, 0)"]
              }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.5,
                boxShadow: {
                  duration: 2,
                  repeat: Infinity
                }
              }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {userData && (
            <motion.div 
              className="user-card"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              whileHover={{ 
                y: -5,
                boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)"
              }}
            >
              <motion.div 
                className="user-header"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.img 
                  src={userData.avatar_url} 
                  alt="avatar" 
                  className="user-avatar"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 150,
                    damping: 10
                  }}
                  whileHover={{ rotate: 5, scale: 1.05 }}
                />
                <div className="user-names">
                  <motion.h2
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {userData.name || userData.login}
                  </motion.h2>
                  <motion.p
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    @{userData.login}
                  </motion.p>
                </div>
              </motion.div>
              
              <motion.p 
                className="user-bio"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {userData.bio || "No bio available"}
              </motion.p>
              
              <motion.div 
                className="user-stats"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {[
                  { icon: <FaUsers />, value: userData.followers, label: "Followers" },
                  { icon: <FaUser />, value: userData.following, label: "Following" },
                  { icon: <RiGitRepositoryFill />, value: userData.public_repos, label: "Repos" },
                  { icon: <BsStarFill />, value: Math.floor((userData.followers + userData.public_repos) / 2), label: "Stars" }
                ].map((stat, index) => (
                  <motion.div 
                    key={index}
                    className="stat"
                    whileHover={{ 
                      y: -5,
                      scale: 1.05,
                      boxShadow: "0 5px 15px rgba(129, 140, 248, 0.3)"
                    }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <div className="stat-icon">{stat.icon}</div>
                    <span>{stat.value}</span>
                    <small>{stat.label}</small>
                  </motion.div>
                ))}
              </motion.div>
              
              <motion.a 
                href={userData.html_url} 
                target="_blank" 
                rel="noreferrer"
                className="profile-link"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 5px 15px rgba(129, 140, 248, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <FaLink /> View GitHub Profile
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default App;