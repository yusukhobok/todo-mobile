import React from "react";

import { Button, Form, Item, Input, Text, Card, CardItem, Badge } from 'native-base';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: "",
            password: ""
        };
    }

    handleSubmit = () => {
        this.props.loginSubmit(this.state.login, this.state.password);
    }

    render() {
        return (
            <Form>
                <Item>
                    <Input placeholder="Логин"
                        onChangeText={(login) => this.setState({ login })} />
                </Item>

                <Item>
                    <Input placeholder="Пароль" secureTextEntry={true}
                        onChangeText={(password) => this.setState({ password })} />
                </Item>

                <Card>
                    <CardItem>
                        <Button bordered onPress={this.handleSubmit} >
                            <Text>
                                Вход
                        </Text>
                        </Button>
                    </CardItem>
                </Card>

                {this.props.wrongLoginOrPassword &&
                    <Badge>
                        <Text>
                            Неверный логин или пароль
                            </Text>
                    </Badge>
                }
            </Form>
        )
    }
}

export default LoginForm;
