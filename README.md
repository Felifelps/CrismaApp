<p align="center">
    <img src="/frontend/public/icon.png" width="100px">
</p>

# CrismaApp

CrismaApp is an organizational web app designed to manage the attendance of the Confirmation Group.

## Functionalities

- Search frequency by name
- Administration area protected with username and password
- CRUD operations for confirmation candidates
- CRUD operations for meeting frequencies
- Generation of Excel tables
- Export data in CSV format
- Download photos from data tables

## Technologies

### Backend (API REST and Server-Side Application)
- Python
- Flask
- Bcrypt
- Peewee
- Dotenv
- waitress
- pandas

### Frontend
- React
- TypeScript
- React Router
- html2canvas
- file-saver
- SweetAlert2

## Installation

To install this project, follow the steps below on this order.

1. Clone this project:

    ```shell
    git clone https://github.com/Felifelps/CrismaApp CrismaApp
    ```

2. Backend setup:

    - Navigate to the `backend` directory:

        ```shell
        cd CrismaApp/backend
        ```

    - Create and activate a virtual environment:

        - On Windows:
        ```shell
        python -m venv .venv
        .venv\Scripts\Activate
        ```

        - On Linux/Mac:
        ```shell
        python3 -m venv .venv
        source .venv/bin/activate
        ```

    - Install the dependencies by running `pip install -r requirements.txt`

    - Setup the admin user and .env file by running:

        ```shell
        python setup.py
        ```

    - Run the server with `python app.py`

3. Frontend setup:

    - Navigate to the `frontend` directory:

        ```shell
        cd CrismaApp/frontend
        ```

    - Install dependencies:

        ```shell
        npm install
        ```

    - Start the development server:

        ```shell
        npm start
        ```

4. Access the backend old version with [this link](http://localhost:5000), and the frontend with [this link](http://localhost:3000) for the frontend.

## Contribution

Fork this repository, make your changes, and submit a pull request. I'll review it as soon as possible.
