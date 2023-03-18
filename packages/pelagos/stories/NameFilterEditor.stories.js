import {NameFilterEditor} from '../src';

const list = ['foo', 'baz'];
const foo = {id: 'foo', name: 'Foo'};
const bar = {id: 'bar', name: 'Bar'};
const baz = {id: 'baz', name: 'Baz'};
const sourceById = {foo, bar, baz};

export default {
	title: 'Components/NameFilterEditor',
	component: NameFilterEditor,
};

export const Default = {
	args: {label: 'Default', placeholder: 'Placeholder', list, sourceById, validateSaveRef: {}},
};
