import React, { useContext, useRef, useState, useEffect } from 'react';
import commonContext from '../../contexts/common/commonContext';
import useForm from '../../hooks/useForm';
import useOutsideClose from '../../hooks/useOutsideClose';
import useScrollDisable from '../../hooks/useScrollDisable';

const AccountForm = () => {
  const { isFormOpen, toggleForm } = useContext(commonContext);
  const { inputValues, handleInputValues } = useForm();
  const formRef = useRef();

  useOutsideClose(formRef, () => toggleForm(false));
  useScrollDisable(isFormOpen);

  const [isSignupVisible, setIsSignupVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleIsSignupVisible = () => setIsSignupVisible((prev) => !prev);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const url = isSignupVisible
      ? 'http://localhost:5000/api/user/register'
      : 'http://localhost:5000/api/user/login';
  
    const payload = isSignupVisible
      ? inputValues
      : { 
          mobilenumber: inputValues.mobilenumber, 
          password: inputValues.password 
        };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
  
      if (response.ok) {
        alert(data.message);
        if (!isSignupVisible) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('mobilenumber', inputValues.mobilenumber);
          setUserData({ username: inputValues.username, mobilenumber: inputValues.mobilenumber });
          setIsLoggedIn(true);
        }
        toggleForm(false);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('mobilenumber');
    setUserData(null);
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const mobilenumber = localStorage.getItem('mobilenumber');
    if (token && mobilenumber) {
      setUserData({ username: 'WL7448539858', mobilenumber });
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <>
      {isFormOpen && (
        <div className="backdrop">
          <div className="modal_centered">
            <form id="account_form" ref={formRef} onSubmit={handleFormSubmit}>
              <div className="form_head">
                <h2>{isSignupVisible ? 'Signup' : 'Login'}</h2>
                <p>
                  {isSignupVisible
                    ? 'Already have an account?'
                    : 'New to our platform?'}{' '}
                  <button type="button" onClick={handleIsSignupVisible}>
                    {isSignupVisible ? 'Login' : 'Create an account'}
                  </button>
                </p>
              </div>
              <div className="form_body">
                {isSignupVisible && (
                  <>
                    <div className="input_box">
                      <input
                        type="text"
                        name="username"
                        className="input_field"
                        value={inputValues.username || ''}
                        onChange={handleInputValues}
                        required
                      />
                      <label className="input_label">Username</label>
                    </div>
                    <div className="input_box">
                      <input
                        type="email"
                        name="email"
                        className="input_field"
                        value={inputValues.email || ''}
                        onChange={handleInputValues}
                        required
                      />
                      <label className="input_label">Email</label>
                    </div>
                  </>
                )}
                <div className="input_box">
                  <input
                    type="phone"
                    name="mobilenumber"
                    className="input_field"
                    value={inputValues.mobilenumber || ''}
                    onChange={handleInputValues}
                    required
                  />
                  <label className="input_label">Mobile Number</label>
                </div>
                <div className="input_box">
                  <input
                    type="password"
                    name="password"
                    className="input_field"
                    value={inputValues.password || ''}
                    onChange={handleInputValues}
                    required
                  />
                  <label className="input_label">Password</label>
                </div>
                {isSignupVisible && (
                  <div className="input_box">
                    <input
                      type="password"
                      name="conf_password"
                      className="input_field"
                      value={inputValues.conf_password || ''}
                      onChange={handleInputValues}
                      required
                    />
                    <label className="input_label">Confirm Password</label>
                  </div>
                )}
                <button type="submit" className="btn login_btn">
                  {isSignupVisible ? 'Signup' : 'Login'}
                </button>
              </div>
              <div
                className="close_btn"
                title="Close"
                onClick={() => toggleForm(false)}
              >
                &times;
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Display Logged In info 
      {isLoggedIn && (
        <div>
          <p>Hello, {userData.username}</p>
          <p>Mobile Number: {userData.mobilenumber}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}*/}
    </>
  );
};

export default AccountForm;
