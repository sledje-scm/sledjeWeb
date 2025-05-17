
**  Home.js **

The frontend is injected through index.html and reat app is hosted
on App.js .The designing starts from home.js and following are main 
points and features.
    1.	On load, the navbar is visible.
	2.	Scroll down → navbar hides; scroll up → navbar reappears.
	3.	Click “Login” → sets showLoginModal = true → modal overlay appears.
	4.	Successful login (inside <Login />) calls handleLoginSuccess() → modal closes + navigates to /layout.
	5.	Hero “Get Started” could be wired to scroll you down or link to another route.
	6.	Feature cards animate on hover thanks to Framer Motion.
	7.	Footer stays at the bottom with useful links and info.

The App.js controls routing logic and has all pages included as headers.


** Layout.js **


Regarding the Navbar and logout logic.
	Updated Layout.js
	Key Changes:
	Added a Logout Button:

	The logout button is added to the rightmost side of the navigation bar using flex justify-between to separate the logo/navigation items and the logout button.
	Logout Functionality:

	The handleLogout function:
	Clears the user session by removing userInfo from localStorage.
	Redirects the user to the home page (navigate("/")).
	Styling:

	The logout button uses the same styling as the login button in Navbar.js:
	bg-blue-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 transition.
	Responsive Layout:

	The flex justify-between ensures the logo/navigation items are on the left, and the logout button is on the right.



