import React from "react";
import Todo from "./Todo";



class TodoList extends React.Component {
    constructor() {
        super();
        this.sortedTodos = null;
        this.visibleTodos = null;
    }

    sortTodos = todos => {
        let sortedTodos = todos.slice();
        sortedTodos.sort((a, b) => (a.order > b.order ? 1 : -1));
        return sortedTodos;
    }

    render() {
        this.sortedTodos = this.sortTodos(this.props.todos);
        this.visibleTodos = this.sortedTodos.filter(item => {
            return (this.props.showCompleted || !item.isCompleted)
        })

        return this.visibleTodos.map((value, index) => {
            return (
                <Todo
                    key={value.id}
                    todo={value}
                    showCompleted={this.props.showCompleted}
                    onChangeTodoCompleted={this.props.onChangeTodoCompleted}
                    onDelete={this.props.onDelete}
                    width="100%"
                />
            )
        })
    }
}

export default TodoList;