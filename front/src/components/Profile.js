import { useLocation } from "react-router-dom";
import auth from "../config/firebase";
import axios from 'axios';

export default function Profile() {
  const location = useLocation();
  const email = location.state;

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('@token');
  
      if (email) {
        const response = await axios.get(
          'http://localhost:4000/logout?email=' + email,
        ); 
        // Check if response status is 200 OK
        if (response.status === 200) {
          // Redirect to home page after successful logout
          window.location.href = '/';
        } else {
          // Handle non-200 status code
          console.error('Logout failed. Status:', response.status);
        }
      } else {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };
  

  return (
    <div>
      <h1>Profile</h1>
      <p>Data received: Welcome {email ? email : 'Guest'}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
