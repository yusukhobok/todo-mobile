import React from "react";
import { Button, Body, Icon, Text, Card, CardItem, Container, Left, Right, Form, Item, Picker } from 'native-base';
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
    handleChangeCategory = (value) => {
        this.props.onChangeCurrentCategory(value)
    }

    render() {
        let textStyle;
        if (!this.props.showCompleted)
            textStyle = styles.performedText;
        else
            textStyle = styles.unperformedText;

        const categoriesList = this.props.categories.map((value, index) =>
            <Picker.Item value={value.id} key={value.id} label={value.catTitle} />
        )

        return (
            <Card>
                <CardItem>
                    <Picker
                        note
                        mode="dropdown"
                        selectedValue={this.props.currentCategory}
                        onValueChange={this.handleChangeCategory}>
                        {categoriesList}
                    </Picker>

                    <Button bordered onPress={this.props.onRefresh}>
                        <Icon type='MaterialCommunityIcons' name='refresh' />
                    </Button>

                    <Button bordered onPress={this.props.onChangeShowCompleted} >
                        <Text style={textStyle}>
                            Выполненные
                        </Text>
                    </Button>
					
					<Button bordered onPress={this.props.onSortTodosInAlphabeticalOrder} >
                        <Text>
                            С
                        </Text>
                    </Button>

                    {/* <Button bordered onPress={this.props.logout}>
                        <Icon type='MaterialCommunityIcons' name='logout' />
                    </Button> */}

                </CardItem>
            </Card>
        )
    }
}

export default TodoSettings;
