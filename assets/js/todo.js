const { createApp } = Vue;

createApp({
  data() {
    return {
      todos: [],
      newTodo: "",
      searchQuery: "",
      darkMode: false,
    };
  },
  computed: {
    filteredTodos() {
      const searchTerm = this.searchQuery.toLowerCase();
      return this.todos.filter((todo) =>
        todo.text.toLowerCase().includes(searchTerm)
      );
    },
    completedTodos() {
      return this.todos.filter((todo) => todo.completed).length;
    },
    remainingTodos() {
      return this.todos.filter((todo) => !todo.completed).length;
    },
  },
  watch: {
    todos: {
      handler: function (todos) {
        localStorage.setItem("todos", JSON.stringify(todos));
      },
      deep: true,
    },
  },
  mounted() {
    try {
      const savedTodos = localStorage.getItem("todos");
      if (savedTodos) {
        this.todos = JSON.parse(savedTodos);
      }
      const savedDarkMode = localStorage.getItem("darkMode");
      this.darkMode = savedDarkMode === "true" ? true : false;
      document.body.classList.toggle("dark", this.darkMode);
    } catch (e) {
      console.error("Error loading todos from localStorage:", e);
    }
  },
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      localStorage.setItem("darkMode", this.darkMode);
      document.body.classList.toggle("dark", this.darkMode);
    },
    addTodo() {
      if (this.newTodo.trim() !== "") {
        this.todos.push({
          text: this.newTodo.trim(),
          completed: false,
          editing: false,
          createdAt: new Date().toISOString(),
        });
        this.newTodo = "";
      }
    },
    removeTodo(index) {
      this.todos.splice(index, 1);
    },
    removeTodoTitle(index) {
      this.todos[index].text = "";
    },
    toggleTodo(index) {
      this.todos[index].completed = !this.todos[index].completed;
    },
    editTodo(index) {
      this.todos[index].editing = true;
    },
    saveTodo(index) {
      this.todos[index].editing = false;
    },
    clearCompleted() {
      this.todos = this.todos.filter((todo) => !todo.completed);
    },
    formatTime(isoString) {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
}).mount("#app");
