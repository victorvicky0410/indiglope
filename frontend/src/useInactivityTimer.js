import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useInactivityTimer = (timeoutDuration = 60000) => {
  const navigate = useNavigate();

  useEffect(() => {
    let inactivityTimer;

    const resetTimer = () => {
      if (localStorage.getItem('admintoken')) {
        // If the user is authenticated, reset the timer
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
          // Remove token after inactivity for the specified duration (1 min)
          localStorage.removeItem('admintoken');
          alert('You have been logged out due to inactivity.');
          navigate('/admin/login'); // Redirect to login page
        }, timeoutDuration);
      }
    };

    // Listen to mouse, keyboard, and other user activity events to reset the timer
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer); // Optional, to reset on scroll as well

    // Set initial timer
    resetTimer();

    // Cleanup event listeners on component unmount
    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, [navigate, timeoutDuration]);
};

export default useInactivityTimer;
