# Crop Monitoring System - Frontend

This is the front-end for the Crop Monitoring System, developed for Green Shadow (Pvt) Ltd., using HTML, CSS, JavaScript, jQuery, and AJAX. It interacts with the Spring Boot backend to provide a user interface for managing crop operations, field activities, staff, vehicles, and equipment. The front-end allows managers, administrators, and scientists to access, monitor, and update data efficiently.

## Key Features

- **User Authentication**: Login screen with JWT authentication
- **Field Management**: CRUD operations for managing fields
- **Crop Management**: Create, update, and delete crops in fields
- **Staff Management**: View and manage staff assignments
- **Monitoring Logs**: View field activity logs and crop observations
- **Responsive Design**: Mobile-friendly UI for easy access on mobile devices

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/ranindunethmina/CropMonitoringSystemFrontend.git
    cd crop-monitoring-system-frontend
    ```

2. Open the `index.html` file in your web browser, or deploy it to a web server.

3. Ensure the backend service is running and accessible.

4. The frontend will be accessible from `http://localhost:5055`.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript, jQuery, AJAX
- **Backend**: Spring Boot (Interfacing via REST API)
- **Security**: JWT Authentication
- **Libraries/Tools**: jQuery, Bootstrap (optional for responsive design)

## User Interface

The UI is designed to be intuitive, with separate pages and sections for different functionalities:

- **Login Page**: User authentication for access control.
- **Dashboard**: Overview of fields, crops, staff, and vehicles.
- **Field Management**: Interface for adding, editing, and removing fields.
- **Crop Management**: Create and manage crops within fields.
- **Staff Management**: View staff details and assign tasks.
- **Monitoring Logs**: View and log observations on crop and field activities.

## Contributing

We welcome contributions! Please fork the repository, make your changes, and submit a pull request. Ensure that your code is well-documented and tested.

## License

This project is licensed under the MIT License. See the [LICENSE](License) file for more details.
