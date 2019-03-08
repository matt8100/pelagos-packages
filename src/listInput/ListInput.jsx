import React, {useCallback, useState} from 'react';
import PropTypes from 'prop-types';

import Label from '../components/Label';
import ComboBox from '../components/ComboBox';
import FieldError from '../formFields/FieldError';

import ListEntries from './ListEntries';

import './ListInput.less';

const ListInput = ({
	id,
	label,
	notice,
	placeholder,
	emptyText,
	list,
	text,
	error,
	getSuggestions,
	getSuggestionText,
	getHighlightKey,
	parseInput,
	validateSuggestion,
	renderSuggestion,
	getItemKey,
	renderItem,
	onListChange,
	onTextChange,
	onErrorChange,
}) => {
	const [highlightKey, setHighlightKey] = useState(null);

	const handleGetSuggestions = useCallback(
		text => {
			const {suggestions, error} = getSuggestions(text, list);
			if (error) {
				onErrorChange(error);
				return [];
			}

			return suggestions;
		},
		[list, getSuggestions, onErrorChange]
	);

	const handleChange = useCallback(
		suggestion => {
			const id = getHighlightKey(suggestion);
			if (id) {
				onTextChange('');
				setHighlightKey(id);
			} else if (parseInput) {
				onTextChange('');
				onListChange([getSuggestionText(suggestion), ...list]);
			} else {
				const error = validateSuggestion && validateSuggestion(suggestion);
				if (error) {
					onTextChange(getSuggestionText(suggestion));
					onErrorChange(error);
				} else {
					onTextChange('');
					onListChange([suggestion, ...list]);
				}
			}
		},
		[list, getHighlightKey, validateSuggestion, onListChange, onTextChange, onErrorChange]
	);

	const handleEnter = useCallback(() => {
		if (text === '/clear') {
			onTextChange('');
			onListChange([]);
		} else if (parseInput) {
			const {entries, error} = parseInput(text, list);
			if (error) {
				onErrorChange(error);
			} else {
				onTextChange('');
				onListChange([...entries, ...list]);
			}
		}
	}, [list, text, parseInput, onTextChange, onListChange, onErrorChange]);

	const handleTextChange = useCallback(
		text => {
			if (error) {
				onErrorChange(null);
			}
			onTextChange(text);
		},
		[error, onTextChange, onErrorChange]
	);

	const handleRemoveClick = useCallback(item => onListChange(list.filter(old => old !== item)), [list, onListChange]);

	const handleHighlightClear = useCallback(() => setHighlightKey(null), []);

	return (
		<div className="ListInput">
			<div className="ListInput__label">
				<Label htmlFor={id} text={label} />
				{notice && <div className="ListInput__notice">{notice}</div>}
			</div>
			<ComboBox
				id={id}
				placeholder={placeholder}
				autoSelect={!parseInput}
				text={text}
				error={!!error}
				getSuggestions={handleGetSuggestions}
				renderSuggestion={renderSuggestion}
				onChange={handleChange}
				onEnter={handleEnter}
				onTextChange={handleTextChange}
			/>
			<FieldError id={id + '-error'} text={error} />
			{list && list.length !== 0 ? (
				<ListEntries
					id={id + '-grid'}
					highlightKey={highlightKey}
					list={list}
					getItemKey={getItemKey}
					renderItem={renderItem}
					onRemoveClick={handleRemoveClick}
					onHighlightClear={handleHighlightClear}
				/>
			) : (
				<div className="ListInput__empty" id={id + '-empty'}>
					{emptyText}
				</div>
			)}
		</div>
	);
};

ListInput.propTypes = {
	id: PropTypes.string.isRequired,
	label: PropTypes.string,
	notice: PropTypes.string,
	placeholder: PropTypes.string,
	emptyText: PropTypes.string,
	list: PropTypes.array,
	text: PropTypes.string,
	error: PropTypes.string,
	getSuggestions: PropTypes.func,
	getSuggestionText: PropTypes.func,
	getHighlightKey: PropTypes.func,
	parseInput: PropTypes.func,
	validateSuggestion: PropTypes.func,
	renderSuggestion: PropTypes.func,
	getItemKey: PropTypes.func,
	renderItem: PropTypes.func,
	onListChange: PropTypes.func,
	onTextChange: PropTypes.func,
	onErrorChange: PropTypes.func,
};

export default ListInput;
