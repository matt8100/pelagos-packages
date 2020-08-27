import React from 'react';
import {shallow} from 'enzyme';

import RadioGroup from '../../src/components/RadioGroup';

jest.unmock('../../src/components/RadioGroup');

const options = ['foo', 'bar', 'baz'];
const renderLabel = (v) => v.toUpperCase();

describe('RadioGroup', () => {
	describe('rendering', () => {
		it('renders expected elements', () => {
			const wrapper = shallow(<RadioGroup id="test" value="foo" options={options} renderLabel={renderLabel} />);
			expect(wrapper.getElement()).toMatchSnapshot();
		});
	});

	describe('behaviour', () => {
		it('calls onChange when a radio button is changed', () => {
			const onChange = jest.fn();
			const wrapper = shallow(
				<RadioGroup id="test" value="foo" options={options} renderLabel={renderLabel} onChange={onChange} />
			);
			wrapper.find('#test-bar').simulate('change', {target: {dataset: {value: 'bar'}}});
			expect(onChange.mock.calls).toEqual([['bar']]);
		});

		it('calls onChange when the left key is pressed', () => {
			const onChange = jest.fn();
			const focus = jest.fn();
			const wrapper = shallow(
				<RadioGroup id="test" value="bar" options={options} renderLabel={renderLabel} onChange={onChange} />
			);
			wrapper.find('#test').simulate('keydown', {keyCode: 37, currentTarget: {childNodes: [{focus}]}});
			expect(onChange.mock.calls).toEqual([['foo']]);
			expect(focus).toHaveBeenCalledTimes(1);
		});

		it('calls onChange when the up key is pressed on the first option', () => {
			const onChange = jest.fn();
			const focus = jest.fn();
			const wrapper = shallow(
				<RadioGroup id="test" value="foo" options={options} renderLabel={renderLabel} onChange={onChange} />
			);
			wrapper.find('#test').simulate('keydown', {keyCode: 38, currentTarget: {childNodes: [{}, {}, {focus}]}});
			expect(onChange.mock.calls).toEqual([['baz']]);
			expect(focus).toHaveBeenCalledTimes(1);
		});

		it('calls onChange when the right key is pressed', () => {
			const onChange = jest.fn();
			const focus = jest.fn();
			const wrapper = shallow(
				<RadioGroup id="test" value="bar" options={options} renderLabel={renderLabel} onChange={onChange} />
			);
			wrapper.find('#test').simulate('keydown', {keyCode: 39, currentTarget: {childNodes: [{}, {}, {focus}]}});
			expect(onChange.mock.calls).toEqual([['baz']]);
			expect(focus).toHaveBeenCalledTimes(1);
		});

		it('calls onChange when the down key is pressed on the last option', () => {
			const onChange = jest.fn();
			const focus = jest.fn();
			const wrapper = shallow(
				<RadioGroup id="test" value="baz" options={options} renderLabel={renderLabel} onChange={onChange} />
			);
			wrapper.find('#test').simulate('keydown', {keyCode: 40, currentTarget: {childNodes: [{focus}]}});
			expect(onChange.mock.calls).toEqual([['foo']]);
			expect(focus).toHaveBeenCalledTimes(1);
		});

		it('does not call onChange when other key is pressed', () => {
			const onChange = jest.fn();
			const wrapper = shallow(
				<RadioGroup id="test" value="baz" options={options} renderLabel={renderLabel} onChange={onChange} />
			);
			wrapper.find('#test').simulate('keydown', {keyCode: 32});
			expect(onChange).not.toHaveBeenCalled();
		});
	});
});
