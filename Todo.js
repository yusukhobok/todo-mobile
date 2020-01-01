import React from "react";

import { Button, Icon, Text, Card, CardItem, Left, Right } from 'native-base';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    performedText: {
        color: 'gray',
        textDecorationLine: 'line-through'
    },
    unperformedText: {
        color: 'blue',
        textDecorationLine: 'none'
    },
});

class Todo extends React.Component {
    handleTodoClick = (e) => {
        this.props.onChangeTodoCompleted(this.props.todo)
    }

    handleTodoDelete = (e) => {
        this.props.onDelete(this.props.todo)
    }

    render() {
        let textStyle;
        if (this.props.todo.isCompleted)
            textStyle = styles.performedText;
        else
            textStyle = styles.unperformedText;

        return (
            <Card>
                <CardItem >
                    <Button bordered onPress={this.handleTodoDelete}>
                        <Icon type='MaterialIcons' name='delete' />
                    </Button>
                    <Button bordered onPress={this.handleTodoClick} >
                        <Text style={textStyle}>
                            {this.props.todo.title}
                        </Text>
                    </Button>

                </CardItem>
            </Card>
        )
    }
}

export default Todo;
