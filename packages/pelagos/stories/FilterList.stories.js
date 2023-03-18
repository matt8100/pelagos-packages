import identity from 'lodash-es/identity';

import {FilterList} from '../src';

const filters = {foo: 'foo values', bar: 'bar values', baz: 'baz values'};

const getValues = (key, values) => values;

const getEditor = (name) => <div>Mock Editor for {name}</div>;

export default {
	title: 'Components/FilterList',
	component: FilterList,
};

export const Default = {args: {filters, getFilterTitle: identity, getValues, getEditor}};
