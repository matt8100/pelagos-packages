import {shallow} from 'enzyme';

import RadioButton from '../../src/components/RadioButton';

jest.unmock('../../src/components/RadioButton');

describe('RadioButton', () => {
	describe('rendering', () => {
		it('renders expected elements', () => {
			const wrapper = shallow(
				<RadioButton id="test" className="TestClass" label="Test" checked onChange={jest.fn()} />
			);
			expect(wrapper.getElement()).toMatchSnapshot();
		});

		it('renders expected elements when tabIndex is set', () => {
			const wrapper = shallow(
				<RadioButton id="test" className="TestClass" label="Test" checked tabIndex={-1} onChange={jest.fn()} />
			);
			expect(wrapper.getElement()).toMatchSnapshot();
		});

		it('renders expected elements when error is true', () => {
			const wrapper = shallow(
				<RadioButton id="test" className="TestClass" label="Test" checked error onChange={jest.fn()} />
			);
			expect(wrapper.getElement()).toMatchSnapshot();
		});
	});

	describe('behaviour', () => {
		it('calls onChange when clicked', () => {
			const onChange = jest.fn();
			const wrapper = shallow(<RadioButton className="TestClass" label="Test" checked onChange={onChange} />);
			wrapper.simulate('click');
			expect(onChange).toHaveBeenCalled();
		});

		it('calls onChange when the space key is pressed', () => {
			const onChange = jest.fn();
			const event = {preventDefault: jest.fn(), keyCode: 32};
			const wrapper = shallow(<RadioButton className="TestClass" label="Test" checked onChange={onChange} />);
			wrapper.simulate('keydown', event);
			expect(onChange).toHaveBeenCalled();
			expect(event.preventDefault).toHaveBeenCalled();
		});

		it('does not call onChange when the any other key is pressed', () => {
			const onChange = jest.fn();
			const event = {preventDefault: jest.fn(), keyCode: 9};
			const wrapper = shallow(<RadioButton className="TestClass" label="Test" checked onChange={onChange} />);
			wrapper.simulate('keydown', event);
			expect(onChange).not.toHaveBeenCalled();
			expect(event.preventDefault).not.toHaveBeenCalled();
		});
	});
});
