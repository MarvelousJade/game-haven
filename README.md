game-haven App
game-haven App is a full-stack web application. The app serves as a simple e-commerce platform where users can register, log in, and manage store items and categories. It uses separate databases for authentication and store data, combining MongoDB (with Mongoose) for user authentication and PostgreSQL (with Sequelize) for store items.

Features
User Authentication:
Users can register, log in, and view their login history.

Store Management:
Add, view, and delete items and categories.

Responsive UI:
Frontend views are built using Handlebars and styled with Bootstrap for a modern, responsive design.

Image Uploads:
Feature images for items are uploaded using Multer and hosted on Cloudinary.

Technologies
Backend: Node.js, Express
Databases: MongoDB (Mongoose) & PostgreSQL (Sequelize)
Templating: Handlebars
Frontend: HTML, CSS, Bootstrap
Session Management: client-sessions
File Uploads: Multer, Cloudinary
Environment Management: dotenv
File Structure
bash
Copy
.
├── auth-service.js         # Handles user authentication (MongoDB with Mongoose)
├── config.js               # Loads environment variables using dotenv
├── store-service.js        # Manages store items & categories (PostgreSQL with Sequelize)
├── server.js               # Main Express server setup and route definitions
├── package.json            # Project metadata and dependencies
├── package-lock.json       # Lock file for NPM dependencies
├── public/                 # Static assets (CSS, images, etc.)
├── views/                  # Handlebars templates
│   ├── layouts/            # Main layout (main.hbs)
│   ├── about.hbs
│   ├── addCategory.hbs
│   ├── addItem.hbs
│   ├── categories.hbs
│   ├── items.hbs
│   ├── login.hbs
│   ├── register.hbs
│   ├── shop.hbs
│   └── userHistory.hbs
└── .env                    # Environment variables (not committed to source control)
Installation
Clone the Repository:

bash
Copy
git clone https://github.com/MarvelousJade/game-haven.git
cd game-haven
Install Dependencies:

bash
Copy
npm install
Create a .env File:

In the root directory, create a .env file with your environment variables. For example:

pgsql
Copy
PORT=8080
SESSION_SECRET=your-session-secret
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/your-db?retryWrites=true&w=majority
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
PG_DATABASE=SenecaDB
PG_USER=SenecaDB_owner
PG_PASSWORD=your-postgres-password
PG_HOST=your-postgres-host
PG_PORT=5432
Note: Do not commit your .env file to version control. Make sure it is listed in your .gitignore.

Run the Application:

bash
Copy
npm start
The app should now be running at http://localhost:8080.

Deployment on Render
To deploy the app on Render:

Create a New Web Service:

Log in to Render and create a new Web Service linked to your GitHub repository.
Set Environment Variables:

In your service's settings on the Render dashboard, add each environment variable (as listed in your .env file) manually. Render will inject these variables at runtime.
Deploy:

After setting the environment variables, click "Deploy" or "Redeploy" to launch your application on Render.
Contributing
Contributions, bug reports, and feature requests are welcome! Please open an issue or submit a pull request for any improvements or fixes.

License
This project is licensed under the ISC License.
