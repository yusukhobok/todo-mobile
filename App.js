import React from 'react';
import axios from "axios";


import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Card, CardItem } from 'native-base';
import Constants from 'expo-constants';
import { AsyncStorage } from 'react-native';

import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

import TodoList from "./TodoList";
import AddTodo from "./AddTodo";
import TodoSettings from "./TodoSettings";
import LoginForm from "./LoginForm";


const API_URL = "https://boiling-woodland-05459.herokuapp.com/api/";
const API_URL_CATEGORIES = "https://boiling-woodland-05459.herokuapp.com/categories/";
const API_URL_AUTH = "https://boiling-woodland-05459.herokuapp.com/auth/token/";


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      token: "7796f3dc61faba68eeae7421d4aba8f21cf89e16", //this.getTokenFromStorage(),
      wrongLoginOrPassword: false,
      loading: true,
      isError: false,
      errorMessage: "",
      showCompleted: false,
      draggable: false,
      currentCategory: 1,
      categories: [],
      todos: []
    };
  }

  getTokenFromStorage = async () => {
    token = await AsyncStorage.getItem("token");
    return token
  }


  async componentDidMount() {
    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    })

    if (this.state.token !== null)
      this.refreshTodos(true);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.token !== this.state.token) {
      if (this.state.token !== null) {
        this.refreshTodos(true);
      }
      else {
        this.setState(prevState => {
          return {
            ...prevState,
            categories: [],
            todos: []
          }
        });
      }
    }
  }

  setToken = async (token) => {
    if (token === null)
      await AsyncStorage.removeItem("token");
    else
      await AsyncStorage.setItem("token", token);
    this.setState(prevState => {
      return {
        ...prevState,
        token: token,
        wrongLoginOrPassword: false
      }
    });
  }

  getTokenInfo = () => {
    return { headers: { Authorization: 'Token ' + this.state.token } }
  }


  login = async (username, password) => {
    try {
      username = username.trim();
      const data = { username, password };
      const res = await axios.post(API_URL_AUTH + "login/", data);
      const token = res.data["auth_token"];
      this.setToken(token)

      // this.refreshTodos(true);

    } catch (error) {
      console.log(error.message)
      this.setState(prevState => {
        return {
          ...prevState,
          wrongLoginOrPassword: true
        }
      })
    }
  }

  logout = async () => {
    // try {
    //   await axios.post(API_URL_AUTH + "logout/", null, this.getTokenInfo());
    //   this.setToken(null);

    // } catch (error) {
    //   console.log(error.message);
    // }
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
      const responce = await axios.get(API_URL, this.getTokenInfo());
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


  getCategoriesFromAPI = async () => {
    try {
      const responce = await axios.get(API_URL_CATEGORIES, this.getTokenInfo());
      const categoriesFromAPI = responce.data.slice();
      this.setState(prevState => {
        return {
          ...prevState,
          "categories": categoriesFromAPI
        }
      })
    } catch (error) {
      throw new Error("Ошибка доступа к данным категорий");
    }
  }


  updateTodosToAPI = async () => {
    if (this.state.todos.length === 0)
      return
    try {
      await axios.put(API_URL, this.state.todos, this.getTokenInfo());
    } catch (error) {
      throw new Error("Ошибка обновления данных");
    }
  }


  refreshTodos = async (isGetCategoriesFromAPI = false) => {
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
      if (isGetCategoriesFromAPI)
        this.getCategoriesFromAPI();
    } catch (error) {
      console.log(error.message);
      this.setToken(null);
      // this.setState(prevState => {
      //   return {
      //     ...prevState,
      //     loading: false,
      //     isError: true,
      //     errorMessage: error.message,
      //     todos: [],
      //   }
      // });
    }
  };


  onChangeTodoCompleted = todo => {
    const newTodo = {
      id: todo.id,
      title: todo.title,
      isCompleted: !todo.isCompleted,
      order: todo.order,
      category: todo.category
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
      await axios.delete(API_URL + todo.id + "/", this.getTokenInfo());
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

  onChangeCurrentCategory = (newCurrentCategory) => {
    this.setState(prevState => {
      return {
        ...prevState,
        currentCategory: newCurrentCategory
      }
    });
  }

  onAddTodo = async (newTitle) => {
    const orders = this.state.todos.map(item => item.order)
    const maxOrder = Math.max(...orders);

    const newTodo = {
      title: newTitle,
      isCompleted: false,
      order: maxOrder + 1,
      category: this.state.currentCategory
    };

    this.setState((prevState) => {
      return { ...prevState, loading: true }
    })

    try {
      const res = await axios.post(API_URL, newTodo, this.getTokenInfo());
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


  sortTodosInAlphabeticalOrder = () => {
    let newTodos = this.state.todos.slice();
    newTodos.sort((a,b) => {
      if (a.title.toUpperCase() > b.title.toUpperCase()) return 1;
      if (a.title.toUpperCase() == b.title.toUpperCase()) return 0;
      if (a.title.toUpperCase() < b.title.toUpperCase()) return -1;
    })

    newTodos = newTodos.map((item, index, array) => {
      return {...item, order: index};
    })

    this.setState(prevState => {
      return {
        ...prevState,
        todos: newTodos,
        loading: false
      };
    });
  }

  render() {
    let todoList;
    if (this.state.token === null) {
      todoList = (
        <LoginForm loginSubmit={this.login} wrongLoginOrPassword={this.state.wrongLoginOrPassword} />
      )
    }
    else {

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
              categories={this.state.categories}
              currentCategory={this.state.currentCategory}
              onChangeCurrentCategory={this.onChangeCurrentCategory}
			        onSortTodosInAlphabeticalOrder={this.sortTodosInAlphabeticalOrder}
              logout={this.logout}
            />
            <AddTodo
              onAddTodo={this.onAddTodo}
            />
            <TodoList
              todos={this.state.todos}
              currentCategory={this.state.currentCategory}
              showCompleted={this.state.showCompleted}
              draggable={this.state.draggable}
              onChangeTodoCompleted={this.onChangeTodoCompleted}
              onDelete={this.onDelete}
              onSortEnd={this.changeTodos}
            />

          </>
        )
      }
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
