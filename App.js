import React from 'react';
import axios from "axios";


import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Card, CardItem } from 'native-base';
import Constants from 'expo-constants';

import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

import TodoList from "./TodoList";
import AddTodo from "./AddTodo";
import TodoSettings from "./TodoSettings";


const API_URL = "https://boiling-woodland-05459.herokuapp.com/api/";


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      isError: false,
      errorMessage: "",
      showCompleted: false,
      draggable: false,
      timeInterval = 10000,
      todos: []
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    })

    this.refreshTodos();
    this.setTimer();
  }

  setTimer = () => {
    setInterval(() => {
      if (!this.state.loading)
        this.refreshTodos();
    }, this.state.timeInterval);
  }


  removeOldTodos = todosFromAPI => {
    const filteredTodos = this.state.todos.filter(item => {
      const id = item.id;
      const index = todosFromAPI.findIndex(item => item.id === id);
      return index !== -1;
    })
    this.setState(prevState => {
      return {
        ...prevState,
        todos: filteredTodos
      }
    })
  }


  addNewTodos = todosFromAPI => {
    const filteredTodosFromAPI = todosFromAPI.filter(item => {
      const id = item.id;
      const index = this.state.todos.findIndex(item => item.id === id);
      return index === -1;
    })
    this.setState(prevState => {
      return {
        ...prevState,
        todos: prevState.todos.concat(filteredTodosFromAPI)
      }
    })
  }


  getTodosFromAPI = async () => {
    try {
      const responce = await axios.get(API_URL);
      let todosFromAPI = responce.data.slice();
      // todosFromAPI = todosFromAPI.map((item) => {
      //   return {
      //     ...item,
      //     order: item.id
      //   }
      // })
      return todosFromAPI;
    } catch (error) {
      throw new Error("Ошибка доступа к данным");
    }
  }


  updateTodosToAPI = async () => {
    if (this.state.todos.length === 0)
      return
    try {
      await axios.put(API_URL, this.state.todos);
    } catch (error) {
      throw new Error("Ошибка обновления данных");
    }
  }


  refreshTodos = async () => {
    this.setState(prevState => {
      return {
        ...prevState,
        loading: true
      }
    })

    try {
      const todosFromAPI = await this.getTodosFromAPI();

      this.removeOldTodos(todosFromAPI);

      try {
        await this.updateTodosToAPI();
        this.addNewTodos(todosFromAPI);
        this.setState(prevState => {
          return {
            ...prevState,
            loading: false,
            isError: false,
            errorMessage: "",
          }
        });
      } catch (error) {
        console.log(error.message);
        this.setState(prevState => {
          return {
            ...prevState,
            loading: false,
            isError: false,
            errorMessage: "",
            todos: todosFromAPI,
          }
        });
      }

    } catch (error) {
      this.setState(prevState => {
        return {
          ...prevState,
          loading: false,
          isError: true,
          errorMessage: error.message,
          todos: [],
        }
      });
    }
  };


  onChangeTodoCompleted = todo => {
    const newTodo = {
      id: todo.id,
      title: todo.title,
      isCompleted: !todo.isCompleted,
      order: todo.order
    };

    this.setState(prevState => {
      return {
        ...prevState,
        todos: prevState.todos.map(item => {
          if (item.id === newTodo.id) return newTodo;
          else return item;
        })
      };
    });
  };

  onDelete = async (todo) => {
    this.setState((prevState) => {
      return { ...prevState, loading: true }
    })
    try {
      await axios.delete(API_URL + todo.id);
      this.setState(prevState => {
        return {
          ...prevState,
          loading: false,
          todos: prevState.todos.filter(item => item.id !== todo.id)
        };
      });
    }
    catch (error) {
      console.log(error.message);
    }
  };

  onChangeShowCompleted = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        showCompleted: !prevState.showCompleted
      };
    });
  };

  onChangeDraggable = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        draggable: !prevState.draggable
      }
    })
  }

  onAddTodo = async (newTitle) => {
    const orders = this.state.todos.map(item => item.order)
    const maxOrder = Math.max(...orders);

    const newTodo = {
      title: newTitle,
      isCompleted: false,
      order: maxOrder + 1
    };

    this.setState((prevState) => {
      return { ...prevState, loading: true }
    })

    try {
      const res = await axios.post(API_URL, newTodo);
      const newTodoFromAPI = res.data;

      let newTodos = this.state.todos.slice();
      newTodos.push(newTodoFromAPI);
      this.setState(prevState => {
        return {
          ...prevState,
          todos: newTodos,
          loading: false
        };
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  changeTodos = (newVisibleTodos) => {
    this.setState(prevState => {
      return {
        ...prevState,
        todos: prevState.todos.map(item => {
          const newTodo = newVisibleTodos.find(item2 => item2.id === item.id)
          if (newTodo === undefined)
            return item
          else
            return { ...item, order: newTodo.order };

        })
      };
    })
  }


  render() {
    let todoList;
    if (this.state.isError) {
      todoList = (
        <CardItem>
          <Body>
            <Text>
              {this.state.errorMessage}
            </Text>
          </Body>
        </CardItem>
      )
    }
    else if (this.state.loading) {
      todoList = (
        <CardItem>
          <Body>
            <Text>
              Загрузка...
            </Text>
          </Body>
        </CardItem>
      )
    }
    else {
      todoList = (
        <>
          <TodoSettings
            showCompleted={this.state.showCompleted}
            draggable={this.state.draggable}
            onChangeShowCompleted={this.onChangeShowCompleted}
            onChangeDraggable={this.onChangeDraggable}
            onRefresh={this.refreshTodos}
          />
          <AddTodo
            onAddTodo={this.onAddTodo}
          />
          <TodoList
            todos={this.state.todos}
            showCompleted={this.state.showCompleted}
            draggable={this.state.draggable}
            onChangeTodoCompleted={this.onChangeTodoCompleted}
            onDelete={this.onDelete}
            onSortEnd={this.changeTodos}
          />

        </>
      )
    }


    return (
      <Container style={{ marginTop: Constants.statusBarHeight }}>
        <Content>
          {todoList}
        </Content>
      </Container>
    );
  }
}


export default App;
