// public/main.js
document.addEventListener('DOMContentLoaded', () => {
    // API URL
    const API_URL = 'http://localhost:5000/api/tasks';

    // DOM Elements
    const tasksContainer = document.getElementById('tasks-container');
    const createTaskForm = document.getElementById('create-task-form');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const statusIndicator = document.getElementById('status-indicator');
    const statusText = document.getElementById('status-text');

    // Current filter state
    let currentFilter = 'all';
    let tasks = [];

    // WebSocket Connection
    let socket;

    // Initialize WebSocket connection
    function connectWebSocket() {
        socket = new WebSocket('ws://localhost:5000');

        socket.onopen = () => {
            console.log('WebSocket connected');
            updateConnectionStatus(true);
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            handleWebSocketMessage(data);
        };

        socket.onclose = () => {
            console.log('WebSocket disconnected');
            updateConnectionStatus(false);

            // Attempt to reconnect after 5 seconds
            setTimeout(connectWebSocket, 5000);
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            updateConnectionStatus(false);
        };
    }

    // Update connection status indicator
    function updateConnectionStatus(isConnected) {
        if (isConnected) {
            statusIndicator.className = 'online';
            statusText.textContent = 'Online (Real-time updates active)';
        } else {
            statusIndicator.className = 'offline';
            statusText.textContent = 'Offline (Trying to reconnect...)';
        }
    }

    // Handle WebSocket messages
    function handleWebSocketMessage(data) {
        console.log('Received WebSocket message:', data);

        switch (data.type) {
            case 'task_created':
                tasks.unshift(data.payload);
                renderTasks();
                break;

            case 'task_updated':
                const updatedIndex = tasks.findIndex(task => task.id === data.payload.id);
                if (updatedIndex !== -1) {
                    tasks[updatedIndex] = data.payload;
                    renderTasks();
                }
                break;

            case 'task_deleted':
                tasks = tasks.filter(task => task.id !== data.payload.id);
                renderTasks();
                break;

            case 'connection_established':
                console.log(data.message);
                break;

            default:
                console.log('Unknown message type:', data.type);
        }
    }

    // Fetch all tasks from API
    async function fetchTasks() {
        tasksContainer.innerHTML = '<div class="loading">Loading tasks...</div>';

        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            tasks = await response.json();
            renderTasks();
        } catch (error) {
            console.error('Error fetching tasks:', error);
            tasksContainer.innerHTML = `
                <div class="no-tasks">
                    Failed to load tasks. Please try again later.
                </div>
            `;
        }
    }

    // Render tasks based on current filter
    function renderTasks() {
        // Filter tasks based on current selection
        const filteredTasks = currentFilter === 'all'
            ? tasks
            : tasks.filter(task => task.status === currentFilter);

        // Clear container
        tasksContainer.innerHTML = '';

        // Display message if no tasks
        if (filteredTasks.length === 0) {
            tasksContainer.innerHTML = `
                <div class="no-tasks">
                    No ${currentFilter === 'all' ? '' : currentFilter} tasks found.
                </div>
            `;
            return;
        }

        // Render each task
        filteredTasks.forEach(task => {
            const taskElement = createTaskElement(task);
            tasksContainer.appendChild(taskElement);
        });
    }

    // Create task element
    function createTaskElement(task) {
        const taskCard = document.createElement('div');
        taskCard.className = `task-card ${task.status === 'completed' ? 'completed' : ''}`;
        taskCard.dataset.id = task.id;

        const createdDate = new Date(task.createdAt).toLocaleString();

        taskCard.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <div class="task-actions">
                <div class="task-status">
                    <input type="checkbox" id="status-${task.id}" 
                        ${task.status === 'completed' ? 'checked' : ''}>
                    <label for="status-${task.id}">Completed</label>
                </div>
                <button class="delete-btn">Delete</button>
            </div>
            <div class="task-date">Created: ${createdDate}</div>
        `;

        // Add event listeners
        const checkbox = taskCard.querySelector(`#status-${task.id}`);
        checkbox.addEventListener('change', () => {
            updateTaskStatus(task.id, checkbox.checked ? 'completed' : 'pending');
        });

        const deleteBtn = taskCard.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            deleteTask(task.id);
        });

        return taskCard;
    }

    // Create a new task
    async function createTask(title, description) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const newTask = await response.json();
            console.log('Task created:', newTask);

            // Note: We don't need to add to array or render it here
            // The WebSocket will handle that
        } catch (error) {
            console.error('Error creating task:', error);
            alert('Failed to create task. Please try again.');
        }
    }

    // Update task status
    async function updateTaskStatus(taskId, isCompleted) {
        const status = isCompleted ? 'completed' : 'pending';

        try {
            const response = await fetch(`${API_URL}/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            console.log(`Task ${taskId} updated to ${status}`);
            // The WebSocket will handle updating the UI
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Failed to update task. Please try again.');
            // Reset UI to previous state
            fetchTasks();
        }
    }

    // Delete a task
    async function deleteTask(taskId) {
        if (!confirm('Are you sure you want to delete this task?')) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${taskId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            console.log(`Task ${taskId} deleted`);
            // The WebSocket will handle removing from UI
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task. Please try again.');
        }
    }

    // Event listeners
    createTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value.trim();
        const description = document.getElementById('description').value.trim();

        if (!title || !description) {
            alert('Please fill in all fields');
            return;
        }

        createTask(title, description);
        createTaskForm.reset();
    });

    // Filter button click events
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Update filter and render
            currentFilter = button.dataset.filter;
            renderTasks();
        });
    });

    // Initialize the app
    connectWebSocket();
    fetchTasks();
});