import React from "react";
import { Button, Body, Icon, Text, Card, CardItem, Container, Left, Right } from 'native-base';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    performedText: {
        color: 'gray',
    },
    unperformedText: {
        color: 'blue',
    },
});


class TodoSettings extends React.Component {
    render() {
        let textStyle;
        if (this.props.showCompleted)
            textStyle = styles.performedText;
        else
            textStyle = styles.unperformedText;

        return (
            <Card >
                <CardItem >
                    <Left>
                    <Button bordered onPress={this.props.onRefresh}>
                        <Icon type='MaterialIcons' name='refresh' />
                    </Button>
                    </Left>
                    
                    <Button bordered onPress={this.props.onChangeShowCompleted} >
                        <Text style={textStyle}>
                            Показывать выполненные
                        </Text>
                    </Button>
                </CardItem>
            </Card>
        )
    }
}

export default TodoSettings;
