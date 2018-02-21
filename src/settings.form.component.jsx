import React from 'react';

const {dialog} = require('electron')

import { Form, Input, Upload, Button } from 'antd';
import Defaults from './defaults';

const isValidNumber = value => /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/.test(value);

class SettingsForm extends React.Component {

    constructor(props) {

        super(props);

        this.validateHeight = this.validateHeight.bind(this);
        this.validateWidth = this.validateWidth.bind(this);

        this.ratio = this.props.dimensions.height / this.props.dimensions.width;
    }

    validateWidth(rule, value, callback) {

        const form = this.props.form;

        if (!isValidNumber(value)) {
            callback(Defaults.Strings.ValueNotNumeric);
            return;
        }

        form.setFieldsValue({
            height: value * this.ratio,
        });

        callback();
    }

    validateHeight(rule, value, callback) {

        const form = this.props.form;

        if (!isValidNumber(value)) {
            callback(Defaults.Strings.ValueNotNumeric);
            return;
        }

        form.setFieldsValue({
            width: value / this.ratio,
        });

        callback();
    }


    render() {

        const { getFieldDecorator } = this.props.form;


        return (
            <Form layout="inline">
                <Form.Item label="Anchura">
                    {getFieldDecorator('width', {
                        initialValue: this.props.dimensions.width,
                        rules: [{
                            validator: this.validateWidth,
                        }],
                    })(
                        <Input />
                    )}
                </Form.Item>

                <Form.Item label="Altura">
                    {getFieldDecorator('height', {
                        initialValue: this.props.dimensions.height,
                        rules: [{
                            validator: this.validateHeight,
                        }],
                    })(
                        <Input />
                    )}
                </Form.Item>


            </Form>
        );
    }
}

export default Form.create()(SettingsForm);


