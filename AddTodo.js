import React from "react";

import { Button, Body, Icon, Text, Card, CardItem, Input } from 'native-base';

class AddTodo extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: "" };
    }

    onChange = event => {
        this.setState({ value: event.nativeEvent.text });
    };

    onFormSubmit = event => {
        event.preventDefault();
        if (this.state.value !== "") {
            this.props.onAddTodo(this.state.value);
            this.setState({ value: "" });
        }
    }

    render() {
        return (
            <Card >
                <CardItem >

                    <Input
                        placeholder="Добавить..."
                        onChange={this.onChange}
                        onSubmitEditing={this.onFormSubmit}
                        value={this.state.value}

                    />

                </CardItem>
            </Card>
        );
    }
}

export default AddTodo;