"use client";

import React, { useEffect, useState } from "react";
const BASE_URL = "http://localhost:4000";
const TodoApp = () => {
  const [todo, setTodo] = useState("");
  const [data, setData] = useState(null); //Backend se aaya hua data store kar raha hai, jo fetchTodos function se aata hai.

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [id, setId] = useState(null);

  // Function to fetch data using async/await

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleClick = async () => {
    if (!todo) {
      return;
    }
    setLoading(true);
                                                                                                                              
    await createTodo(todo);
    await fetchTodos();
    setTodo("");
  };

  const handleDelete = async (id) => {
    console.log(id);
    await deleteTodo(id);
    await fetchTodos();
  };

  const handleUpdate = async () => {
    await updateTodo(id);
    setTodo("");
    setIsUpdate(false);
    setId(null);
    await fetchTodos();
  };

  const handleEdit = async (jdjd) => {
    setTodo(jdjd.title);
    setIsUpdate(true);
    setId(jdjd._id);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const createTodo = async (todo) => {
    try {
      const response = await fetch(`${BASE_URL}/task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Set content type to JSON
        body: JSON.stringify({ title: todo }), // Convert postData object to JSON string
      });
      if (!response.ok) {
        throw new Error("Failed to post data");
      }
      const responseData = await response.json();
      // setData(responseData);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${BASE_URL}/tasks`); // API endpoint
      console.log(response);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      console.log(jsonData);
      setData(jsonData.data); // Set data from the response
    } catch (error) {
      setError(error.message); // Set error message if fetch fails
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/task/${id}`, {
        method: "DELETE", // Specify DELETE method to tell server to delete the resource
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }
      // Optionally, you can refresh or refetch the todos list after deletion
    } catch (error) {
      setError(error.message); // Handle error
    }
  };

  const updateTodo = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/task/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }, // Set content type to JSON
        body: JSON.stringify({ title: todo }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }
      // Optionally, you can refresh or refetch the todos list after deletion
    } catch (error) {
      setError(error.message); // Handle error
    }
  };

  // next path
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <>
      <div className="flex gap-2">
        <input
          className="border border-black"
          type="text"
          value={todo}
          onChange={handleChange}
        />
        {isUpdate ? (
          <button
            onClick={handleUpdate}
            className="border border-black text-black bg-green-500 p-2"
          >
            Update
          </button>
        ) : (
          <button
            onClick={handleClick}
            className="border border-black text-black bg-green-500 p-2"
          >
            SAVE
          </button>
        )}
      </div>
      <div>
        {data.map((todo) => (
          <div key={todo._id} className="flex gap-2">
            <h1>
              {todo.title} - {todo.status} - {todo.createdAt}
            </h1>
            <button
              onClick={() => handleDelete(todo._id)}
              className="border-2 border-black bg-red-500 text-black"
            >
              delete
            </button>
            <button
              onClick={() => handleEdit(todo)}
              className="border-2 border-black bg-blue-500 text-black"
            >
              update
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default TodoApp;
